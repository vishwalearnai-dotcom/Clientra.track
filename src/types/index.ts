export type Role = 'ADMIN' | 'LEAD' | 'MEMBER';
export type ActiveTab = 'DASHBOARD' | 'STORYBOARD' | 'EMPLOYEE_MANAGEMENT';

export type DomainName = 
  | 'Sales' 
  | 'Marketing' 
  | 'Operations' 
  | 'Installation' 
  | 'R&D' 
  | 'Founders Office' 
  | 'Finance';

export interface DomainInfo {
  name: DomainName;
  headName: string; // Vinitha, Guru, Dr Karthik, Lokeshwar, Tharun
  headRole: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: Role;
  title: string;
  domain: DomainName;
  headName: string; // Name of Head (e.g. Vinitha, Dr Karthik, Lokeshwar, Tharun, Guru)
}

export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';
export type Priority = 'High' | 'Medium' | 'Low';

export interface Task {
  id: string;
  title: string;
  domain: DomainName;
  status: TaskStatus;
  priority: Priority;
  assigneeId: string;
  delegatedByHeadName: string; // Vinitha, Guru, Dr Karthik, Lokeshwar, Tharun, Tejas Signal
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
