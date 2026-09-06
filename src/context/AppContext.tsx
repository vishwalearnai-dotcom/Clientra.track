import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Task, NotificationItem, Role, TaskStatus, DomainInfo } from '../types';

interface OrganizationState {
  id: string;
  name: string;
  slug: string;
  planStatus: 'TRIAL' | 'ACTIVE' | 'EXPIRED';
  trialEndsAt: string;
}

interface AppContextType {
  // Organization state
  currentOrg: OrganizationState | null;
  isOnboarded: boolean;
  completeOnboarding: (orgData: {
    orgName: string;
    orgSlug: string;
    adminName: string;
    adminEmail: string;
    adminPhone: string;
    departments: string[];
  }) => void;

  users: User[];
  domains: DomainInfo[];
  addDepartment: (deptName: string) => void;
  inviteMember: (memberData: {
    name: string;
    email: string;
    role: Role;
    title: string;
    department: string;
    phone?: string;
    managerName?: string;
  }) => void;

  currentUser: User;
  setCurrentUser: (user: User) => void;
  currentRole: Role;
  setCurrentRole: (role: Role) => void;
  selectedMonth: string;
  setSelectedMonth: (month: string) => void;
  selectedUserForDetail: User | null;
  setSelectedUserForDetail: (user: User | null) => void;
  tasks: Task[];
  notifications: NotificationItem[];
  
  // Task Actions
  addTask: (taskData: Omit<Task, 'id' | 'lastUpdated' | 'nudgedCount' | 'acknowledgedByEmployee'>) => void;
  updateTaskStatus: (taskId: string, status: TaskStatus) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  deleteTask: (taskId: string) => void;
  
  // Reminders & WhatsApp Alerts
  nudgeTask: (taskId: string) => void;
  nudgeAllDomainPendingTasks: (domain?: string) => number;
  acknowledgeTask: (taskId: string) => void;
  
  // Notifications
  markNotificationRead: (notifId: string) => void;
  markAllNotificationsRead: () => void;
  
  // Utility & Feedback
  resetWorkspace: () => void;
  toast: { text: string; type: 'info' | 'success' | 'warning' } | null;
  clearToast: () => void;
  showToast: (text: string, type?: 'info' | 'success' | 'warning') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY_ORG = 'clientra_org_v1';
const STORAGE_KEY_DEPTS = 'clientra_depts_v1';
const STORAGE_KEY_USERS = 'clientra_users_v1';
const STORAGE_KEY_TASKS = 'clientra_tasks_v1';
const STORAGE_KEY_NOTIFS = 'clientra_notifs_v1';
const STORAGE_KEY_CURRENT_USER = 'clientra_curr_user_v1';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load saved organization or start in clean onboarding mode
  const [currentOrg, setCurrentOrg] = useState<OrganizationState | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_ORG);
    return saved ? JSON.parse(saved) : null;
  });

  const [domains, setDomains] = useState<DomainInfo[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_DEPTS);
    return saved ? JSON.parse(saved) : [];
  });

  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_USERS);
    return saved ? JSON.parse(saved) : [];
  });

  const [currentUser, setCurrentUserInternal] = useState<User>(() => {
    const savedId = localStorage.getItem(STORAGE_KEY_CURRENT_USER);
    if (savedId && users.length > 0) {
      const found = users.find(u => u.id === savedId);
      if (found) return found;
    }
    return users[0] || {
      id: 'admin-temp',
      name: 'Founder / Admin',
      email: 'admin@clientra.com',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      role: 'ADMIN',
      title: 'Founder & CEO',
      domain: 'Executive',
      headName: 'Founder'
    };
  });

  const [currentRole, setCurrentRoleInternal] = useState<Role>(currentUser?.role || 'ADMIN');
  const [selectedMonth, setSelectedMonth] = useState<string>('2026-09');
  const [selectedUserForDetail, setSelectedUserForDetail] = useState<User | null>(null);

  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_TASKS);
    return saved ? JSON.parse(saved) : [];
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_NOTIFS);
    return saved ? JSON.parse(saved) : [];
  });

  const [toast, setToast] = useState<{ text: string; type: 'info' | 'success' | 'warning' } | null>(null);

  const showToast = (text: string, type: 'info' | 'success' | 'warning' = 'info') => {
    setToast({ text, type });
  };

  const clearToast = () => setToast(null);

  // Sync to localStorage
  useEffect(() => {
    if (currentOrg) localStorage.setItem(STORAGE_KEY_ORG, JSON.stringify(currentOrg));
    localStorage.setItem(STORAGE_KEY_DEPTS, JSON.stringify(domains));
    localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));
    localStorage.setItem(STORAGE_KEY_TASKS, JSON.stringify(tasks));
    localStorage.setItem(STORAGE_KEY_NOTIFS, JSON.stringify(notifications));
    if (currentUser?.id) localStorage.setItem(STORAGE_KEY_CURRENT_USER, currentUser.id);
  }, [currentOrg, domains, users, tasks, notifications, currentUser]);

  const setCurrentUser = (user: User) => {
    setCurrentUserInternal(user);
    setCurrentRoleInternal(user.role);
    localStorage.setItem(STORAGE_KEY_CURRENT_USER, user.id);
  };

  const setCurrentRole = (role: Role) => {
    setCurrentRoleInternal(role);
  };

  // Complete Onboarding Flow for Any Organization
  const completeOnboarding = (orgData: {
    orgName: string;
    orgSlug: string;
    adminName: string;
    adminEmail: string;
    adminPhone: string;
    departments: string[];
  }) => {
    const newOrg: OrganizationState = {
      id: `org-${Date.now()}`,
      name: orgData.orgName,
      slug: orgData.orgSlug,
      planStatus: 'TRIAL',
      trialEndsAt: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000).toISOString()
    };

    const newDepts: DomainInfo[] = orgData.departments.map(d => ({
      name: d,
      headName: orgData.adminName,
      headRole: `${d} Lead`
    }));

    const adminUser: User = {
      id: `user-${Date.now()}`,
      name: orgData.adminName,
      email: orgData.adminEmail,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      role: 'ADMIN',
      title: 'Founder & CEO',
      domain: orgData.departments[0] || 'Executive',
      headName: orgData.adminName,
      phone_number: orgData.adminPhone
    };

    setCurrentOrg(newOrg);
    setDomains(newDepts);
    setUsers([adminUser]);
    setCurrentUserInternal(adminUser);
    setCurrentRoleInternal('ADMIN');
    setTasks([]);
    setNotifications([]);

    showToast(`Organization "${orgData.orgName}" successfully initialized!`, 'success');
  };

  const addDepartment = (deptName: string) => {
    if (domains.some(d => d.name.toLowerCase() === deptName.toLowerCase())) return;
    const newDept: DomainInfo = {
      name: deptName,
      headName: currentUser.name,
      headRole: `${deptName} Head`
    };
    setDomains(prev => [...prev, newDept]);
    showToast(`Department "${deptName}" added`, 'success');
  };

  const inviteMember = (memberData: {
    name: string;
    email: string;
    role: Role;
    title: string;
    department: string;
    phone?: string;
    managerName?: string;
  }) => {
    const newMember: User = {
      id: `user-${Date.now()}`,
      name: memberData.name,
      email: memberData.email,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
      role: memberData.role,
      title: memberData.title,
      domain: memberData.department,
      headName: memberData.managerName || currentUser.name,
      phone_number: memberData.phone
    };

    setUsers(prev => [...prev, newMember]);
    showToast(`Invited ${memberData.name} (${memberData.title})`, 'success');
  };

  const addTask = (taskData: Omit<Task, 'id' | 'lastUpdated' | 'nudgedCount' | 'acknowledgedByEmployee'>) => {
    const newTask: Task = {
      ...taskData,
      id: `task-${Date.now()}`,
      lastUpdated: new Date().toISOString().split('T')[0],
      nudgedCount: 0,
      acknowledgedByEmployee: false
    };

    setTasks(prev => [newTask, ...prev]);

    const assignee = users.find(u => u.id === newTask.assigneeId);
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      userId: newTask.assigneeId,
      type: 'ASSIGNMENT',
      title: `Task Assigned by Head ${newTask.delegatedByHeadName}`,
      message: `Task "${newTask.title}" assigned to you in ${newTask.domain} (Due: ${newTask.dueDate}).`,
      taskId: newTask.id,
      createdAt: new Date().toISOString(),
      read: false
    };

    setNotifications(prev => [newNotif, ...prev]);
    showToast(`Task assigned to ${assignee?.name || 'Member'}`, 'success');
  };

  const updateTaskStatus = (taskId: string, status: TaskStatus) => {
    setTasks(prev =>
      prev.map(t => {
        if (t.id === taskId) {
          return {
            ...t,
            status,
            lastUpdated: new Date().toISOString().split('T')[0],
            acknowledgedByEmployee: true
          };
        }
        return t;
      })
    );
    showToast(`Status updated to ${status.replace('_', ' ')}`, 'info');
  };

  const updateTask = (taskId: string, updates: Partial<Task>) => {
    setTasks(prev =>
      prev.map(t => (t.id === taskId ? { ...t, ...updates, lastUpdated: new Date().toISOString().split('T')[0] } : t))
    );
    showToast('Task updated', 'info');
  };

  const deleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
    showToast('Task deleted', 'warning');
  };

  const nudgeTask = (taskId: string) => {
    const targetTask = tasks.find(t => t.id === taskId);
    if (!targetTask) return;

    const assignee = users.find(u => u.id === targetTask.assigneeId);
    setTasks(prev =>
      prev.map(t =>
        t.id === taskId
          ? {
              ...t,
              nudgedCount: t.nudgedCount + 1,
              lastUpdated: new Date().toISOString().split('T')[0],
              acknowledgedByEmployee: false
            }
          : t
      )
    );

    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      userId: targetTask.assigneeId,
      type: 'REMINDER',
      title: `WhatsApp Alert Sent: "${targetTask.title}"`,
      message: `Reminder sent to ${assignee?.name || 'Employee'}${assignee?.phone_number ? ` via WhatsApp (${assignee.phone_number})` : ''}.`,
      taskId: targetTask.id,
      createdAt: new Date().toISOString(),
      read: false
    };

    setNotifications(prev => [newNotif, ...prev]);
    showToast(`WhatsApp reminder dispatched to ${assignee?.name || 'employee'}!`, 'info');
  };

  const nudgeAllDomainPendingTasks = (domain?: string): number => {
    const monthTasks = tasks.filter(t => t.month === selectedMonth && t.status !== 'DONE');
    const filteredTasks = domain ? monthTasks.filter(t => t.domain === domain) : monthTasks;

    if (filteredTasks.length === 0) return 0;

    setTasks(prev =>
      prev.map(t => {
        if (filteredTasks.some(ft => ft.id === t.id)) {
          return {
            ...t,
            nudgedCount: t.nudgedCount + 1,
            lastUpdated: new Date().toISOString().split('T')[0],
            acknowledgedByEmployee: false
          };
        }
        return t;
      })
    );

    showToast(`Dispatched reminders to ${filteredTasks.length} pending task(s)!`, 'info');
    return filteredTasks.length;
  };

  const acknowledgeTask = (taskId: string) => {
    setTasks(prev =>
      prev.map(t => (t.id === taskId ? { ...t, acknowledgedByEmployee: true } : t))
    );
    showToast('Task acknowledged. Head has been notified.', 'success');
  };

  const markNotificationRead = (notifId: string) => {
    setNotifications(prev => prev.map(n => (n.id === notifId ? { ...n, read: true } : n)));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    showToast('All notifications marked as read', 'info');
  };

  const resetWorkspace = () => {
    localStorage.removeItem(STORAGE_KEY_ORG);
    localStorage.removeItem(STORAGE_KEY_DEPTS);
    localStorage.removeItem(STORAGE_KEY_USERS);
    localStorage.removeItem(STORAGE_KEY_TASKS);
    localStorage.removeItem(STORAGE_KEY_NOTIFS);
    localStorage.removeItem(STORAGE_KEY_CURRENT_USER);
    setCurrentOrg(null);
    setDomains([]);
    setUsers([]);
    setTasks([]);
    setNotifications([]);
  };

  return (
    <AppContext.Provider
      value={{
        currentOrg,
        isOnboarded: Boolean(currentOrg),
        completeOnboarding,
        users,
        domains,
        addDepartment,
        inviteMember,
        currentUser,
        setCurrentUser,
        currentRole,
        setCurrentRole,
        selectedMonth,
        setSelectedMonth,
        selectedUserForDetail,
        setSelectedUserForDetail,
        tasks,
        notifications,
        addTask,
        updateTaskStatus,
        updateTask,
        deleteTask,
        nudgeTask,
        nudgeAllDomainPendingTasks,
        acknowledgeTask,
        markNotificationRead,
        markAllNotificationsRead,
        resetWorkspace,
        toast,
        clearToast,
        showToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
