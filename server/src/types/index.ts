export type PermissionLevel = 'ADMIN' | 'MANAGER' | 'INDIVIDUAL';
export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';
export type Priority = 'High' | 'Medium' | 'Low';
export type PlanStatus = 'TRIAL' | 'ACTIVE' | 'EXPIRED';

export interface Organization {
  id: string;
  name: string;
  slug: string;
  plan_status: PlanStatus;
  trial_ends_at: string;
  stripe_customer_id?: string;
  stripe_subscription_id?: string;
  created_at: string;
  updated_at: string;
}

export interface Department {
  id: string;
  org_id: string;
  name: string;
  lead_user_id?: string;
  created_at: string;
}

export interface OrganizationMember {
  id: string;
  org_id: string;
  user_id?: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  phone_number?: string;
  department_id?: string;
  department_name?: string;
  reports_to_member_id?: string;
  manager_name?: string;
  permission_level: PermissionLevel;
  custom_title: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: string;
  org_id: string;
  department_id?: string;
  department_name?: string;
  title: string;
  description?: string;
  priority: Priority;
  status: TaskStatus;
  assignee_member_id?: string;
  assignee_name?: string;
  assignee_avatar?: string;
  delegated_by_member_id?: string;
  delegator_name?: string;
  due_date: string;
  month_period: string; // e.g. "2026-09"
  nudged_count: number;
  last_nudged_at?: string;
  acknowledged: boolean;
  created_at: string;
  updated_at: string;
}

export interface NotificationLog {
  id: string;
  org_id: string;
  task_id?: string;
  recipient_member_id: string;
  channel: 'EMAIL' | 'WHATSAPP' | 'IN_APP';
  status: 'QUEUED' | 'SENT' | 'FAILED';
  details?: Record<string, unknown>;
  created_at: string;
}
