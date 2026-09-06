export type Role = 'ADMIN' | 'LEAD' | 'MEMBER';
export type ActiveTab = 'DASHBOARD' | 'STORYBOARD' | 'EMPLOYEE_MANAGEMENT';

// Dynamic Department Model (No hardcoded domain list)
export interface Department {
  id: string;
  org_id: string;
  name: string;
  lead_user_id?: string;
  created_at?: string;
}

// Backwards compatibility alias for components during refactoring
export type DomainName = string;
export interface DomainInfo {
  name: string;
  headName: string;
  headRole: string;
}

// User / Organization Member Model
export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: Role;
  title: string;
  domain: string; // Department name
  department_id?: string;
  headName: string; // Direct Manager / Reporting Lead name
  reports_to_member_id?: string;
  phone_number?: string;
}

export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';
export type Priority = 'High' | 'Medium' | 'Low';

export interface Task {
  id: string;
  title: string;
  domain: string; // Department name
  department_id?: string;
  status: TaskStatus;
  priority: Priority;
  assigneeId: string;
  delegatedByHeadName: string;
  dueDate: string;
  month: string; // e.g. "2026-09"
  lastUpdated: string;
  nudgedCount: number;
  acknowledgedByEmployee: boolean;
}

export interface NotificationItem {
  id: string;
  userId: string;
  type: 'REMINDER' | 'ASSIGNMENT' | 'STATUS_CHANGE';
  title: string;
  message: string;
  taskId?: string;
  createdAt: string;
  read: boolean;
}
