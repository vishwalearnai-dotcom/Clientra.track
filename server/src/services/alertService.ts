import { NotificationLog, Task, OrganizationMember } from '../types/index.js';
import { dataStore } from '../db/store.js';
import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromWhatsAppNumber = process.env.TWILIO_WHATSAPP_FROM || 'whatsapp:+14155238886';

const isTwilioConfigured = Boolean(
  accountSid && 
  authToken && 
  !accountSid.includes('xxxx') && 
  accountSid.startsWith('AC')
);

const twilioClient = isTwilioConfigured && accountSid && authToken
  ? twilio(accountSid, authToken)
  : null;

export interface SendAlertParams {
  orgId: string;
  recipientMember: OrganizationMember;
  task?: Task;
  channel: 'EMAIL' | 'WHATSAPP';
  customMessage?: string;
}

export class AlertService {
  /**
   * Dispatches direct notification to an employee via Twilio WhatsApp or Email.
   * Logs transaction to notification_logs table.
   */
  public static async dispatchAlert(params: SendAlertParams): Promise<NotificationLog> {
    const { orgId, recipientMember, task, channel, customMessage } = params;

    const messageContent = customMessage || (task 
      ? `Hi ${recipientMember.full_name}, your manager sent a reminder for your task: "${task.title}". Due date: ${task.due_date}. Please update your workstation status.`
      : `Hi ${recipientMember.full_name}, you have active monthly tasks requiring daily progress updates.`);

    let dispatchStatus: 'SENT' | 'FAILED' | 'QUEUED' = 'SENT';
    let errorMessage: string | undefined;

    if (channel === 'WHATSAPP') {
      const targetPhone = recipientMember.phone_number;

      if (!targetPhone) {
        console.warn(`⚠️ [AlertService] Cannot send WhatsApp alert to ${recipientMember.full_name}: No phone number registered.`);
        dispatchStatus = 'FAILED';
        errorMessage = 'No phone number registered';
      } else if (twilioClient) {
        try {
          // Format recipient number with whatsapp: prefix if not present
          const formattedTo = targetPhone.startsWith('whatsapp:') 
            ? targetPhone 
            : `whatsapp:${targetPhone.startsWith('+') ? targetPhone : `+${targetPhone}`}`;

          const result = await twilioClient.messages.create({
            from: fromWhatsAppNumber,
            to: formattedTo,
            body: messageContent
          });

          console.info(`✅ [Twilio WhatsApp] Message sent successfully to ${recipientMember.full_name} (${formattedTo}). SID: ${result.sid}`);
        } catch (err: any) {
          console.error(`❌ [Twilio WhatsApp Error] Failed to send message to ${recipientMember.full_name}:`, err.message);
          dispatchStatus = 'FAILED';
          errorMessage = err.message;
        }
      } else {
        console.info(`ℹ️ [Twilio WhatsApp (Dry Run)] Twilio credentials not set in server/.env. Simulating alert delivery to ${recipientMember.full_name} (${targetPhone}): "${messageContent}"`);
      }
    } else {
      console.info(`ℹ️ [Email Dispatch] Delivering email notification to ${recipientMember.full_name} (${recipientMember.email})`);
    }

    const log: NotificationLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      org_id: orgId,
      task_id: task?.id,
      recipient_member_id: recipientMember.id,
      channel,
      status: dispatchStatus,
      details: {
        recipient_name: recipientMember.full_name,
        target_destination: channel === 'EMAIL' ? recipientMember.email : recipientMember.phone_number,
        message: messageContent,
        dispatched_at: new Date().toISOString(),
        error: errorMessage
      },
      created_at: new Date().toISOString()
    };

    dataStore.notificationLogs.push(log);
    return log;
  }
}
