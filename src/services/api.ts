import { User, Task, DomainInfo } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

export class ApiService {
  public static async fetchDepartments(orgId: string = 'org-clientra-demo'): Promise<DomainInfo[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/departments?orgId=${orgId}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      return (data.departments || []).map((d: any) => ({
        name: d.name,
        headName: 'Lead',
        headRole: `${d.name} Lead`
      }));
    } catch (err) {
      console.warn('⚠️ [ApiService] Backend fetchDepartments offline, using fallback state.');
      return [];
    }
  }

  public static async fetchMembers(orgId: string = 'org-clientra-demo', viewerMemberId?: string): Promise<User[]> {
    try {
      const url = viewerMemberId 
        ? `${API_BASE_URL}/members?orgId=${orgId}&viewerMemberId=${viewerMemberId}`
        : `${API_BASE_URL}/members?orgId=${orgId}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      return (data.members || []).map((m: any) => ({
        id: m.id,
        name: m.full_name,
        email: m.email,
        avatar: m.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
        role: (m.permission_level === 'ADMIN' ? 'ADMIN' : m.permission_level === 'MANAGER' ? 'LEAD' : 'MEMBER') as any,
        title: m.custom_title || 'Team Member',
        domain: m.department_name || 'General',
        department_id: m.department_id,
        headName: m.manager_name || 'Founder',
        reports_to_member_id: m.reports_to_member_id,
        phone_number: m.phone_number
      }));
    } catch (err) {
      console.warn('⚠️ [ApiService] Backend fetchMembers offline, using fallback state.');
      return [];
    }
  }

  public static async fetchTasks(orgId: string = 'org-clientra-demo', month?: string, viewerMemberId?: string): Promise<Task[]> {
    try {
      let url = `${API_BASE_URL}/tasks?orgId=${orgId}`;
      if (month) url += `&month=${month}`;
      if (viewerMemberId) url += `&viewerMemberId=${viewerMemberId}`;
      
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      return (data.tasks || []).map((t: any) => ({
        id: t.id,
        title: t.title,
        domain: t.department_name || 'General',
        department_id: t.department_id,
        status: t.status,
        priority: t.priority,
        assigneeId: t.assignee_member_id || '',
        delegatedByHeadName: t.delegator_name || 'Lead',
        dueDate: t.due_date,
        month: t.month_period,
        lastUpdated: t.updated_at || new Date().toISOString(),
        nudgedCount: t.nudged_count || 0,
        acknowledgedByEmployee: Boolean(t.acknowledged)
      }));
    } catch (err) {
      console.warn('⚠️ [ApiService] Backend fetchTasks offline, using fallback state.');
      return [];
    }
  }

  public static async updateTaskStatus(taskId: string, status: string): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      return res.ok;
    } catch {
      return false;
    }
  }

  public static async sendTaskReminder(taskId: string, channel: 'WHATSAPP' | 'EMAIL' = 'WHATSAPP'): Promise<any> {
    try {
      const res = await fetch(`${API_BASE_URL}/alerts/nudge-task`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task_id: taskId, channel })
      });
      return await res.json();
    } catch (err) {
      console.warn('⚠️ [ApiService] Failed to send reminder via backend API.');
      return null;
    }
  }

  public static async sendBroadcastReminder(orgId: string = 'org-clientra-demo', month?: string, channel: 'WHATSAPP' | 'EMAIL' = 'WHATSAPP'): Promise<any> {
    try {
      const res = await fetch(`${API_BASE_URL}/alerts/broadcast-pending`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ org_id: orgId, month_period: month, channel })
      });
      return await res.json();
    } catch (err) {
      console.warn('⚠️ [ApiService] Failed to send broadcast reminder via backend API.');
      return null;
    }
  }
}
