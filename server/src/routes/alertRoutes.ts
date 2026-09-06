import { Router, Request, Response } from 'express';
import { dataStore } from '../db/store.js';
import { AlertService } from '../services/alertService.js';

export const alertRouter = Router();

// POST /api/v1/alerts/nudge-task (Send targeted reminder for a single task)
alertRouter.post('/nudge-task', async (req: Request, res: Response) => {
  const { task_id, channel = 'WHATSAPP' } = req.body;

  const task = dataStore.tasks.find(t => t.id === task_id);
  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }

  const recipient = dataStore.members.find(m => m.id === task.assignee_member_id);
  if (!recipient) {
    return res.status(404).json({ error: 'Assigned employee not found' });
  }

  // Increment nudge count on the task
  task.nudged_count = (task.nudged_count || 0) + 1;
  task.last_nudged_at = new Date().toISOString();
  task.acknowledged = false;

  const log = await AlertService.dispatchAlert({
    orgId: task.org_id,
    recipientMember: recipient,
    task,
    channel: channel as 'EMAIL' | 'WHATSAPP'
  });

  return res.json({ 
    success: true, 
    message: `Reminder sent to ${recipient.full_name} via ${channel}`,
    nudgedCount: task.nudged_count,
    log 
  });
});

// POST /api/v1/alerts/broadcast-pending (Send reminders to all employees with pending tasks)
alertRouter.post('/broadcast-pending', async (req: Request, res: Response) => {
  const { org_id = 'org-clientra-demo', department_id, month_period, channel = 'WHATSAPP' } = req.body;

  let pendingTasks = dataStore.tasks.filter(t => t.org_id === org_id && t.status !== 'DONE');

  if (department_id) {
    pendingTasks = pendingTasks.filter(t => t.department_id === department_id);
  }
  if (month_period) {
    pendingTasks = pendingTasks.filter(t => t.month_period === month_period);
  }

  // Group by assignee
  const memberTasksMap = new Map<string, typeof pendingTasks>();
  for (const t of pendingTasks) {
    if (t.assignee_member_id) {
      const list = memberTasksMap.get(t.assignee_member_id) || [];
      list.push(t);
      memberTasksMap.set(t.assignee_member_id, list);
    }
  }

  const logs = [];
  for (const [memberId, tasks] of memberTasksMap.entries()) {
    const member = dataStore.members.find(m => m.id === memberId);
    if (member) {
      tasks.forEach(t => {
        t.nudged_count = (t.nudged_count || 0) + 1;
        t.last_nudged_at = new Date().toISOString();
      });

      const log = await AlertService.dispatchAlert({
        orgId: org_id,
        recipientMember: member,
        channel: channel as 'EMAIL' | 'WHATSAPP',
        customMessage: `Hi ${member.full_name}, you have ${tasks.length} pending task(s) for ${month_period || 'this month'} requiring your daily update.`
      });
      logs.push(log);
    }
  }

  return res.json({
    success: true,
    totalRecipients: logs.length,
    totalTasksNudged: pendingTasks.length,
    channel,
    logs
  });
});
