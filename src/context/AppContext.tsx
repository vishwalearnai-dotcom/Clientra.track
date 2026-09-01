import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Task, NotificationItem, Role, TaskStatus, DomainInfo, DomainName } from '../types';
import { INITIAL_USERS, INITIAL_TASKS, INITIAL_NOTIFICATIONS, DOMAINS } from '../data/initialData';

interface AppContextType {
  users: User[];
  domains: DomainInfo[];
  currentUser: User;
  setCurrentUser: (user: User) => void;
  currentRole: Role;
  setCurrentRole: (role: Role) => void;
  selectedMonth: string; // e.g. "2026-09"
  setSelectedMonth: (month: string) => void;
  selectedUserForDetail: User | null;
  setSelectedUserForDetail: (user: User | null) => void;
  tasks: Task[];
  notifications: NotificationItem[];
  
  // Actions
  addTask: (taskData: Omit<Task, 'id' | 'lastUpdated' | 'nudgedCount' | 'acknowledgedByEmployee'>) => void;
  updateTaskStatus: (taskId: string, status: TaskStatus) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  deleteTask: (taskId: string) => void;
  
  // 1-Click Reminder Engine
  nudgeTask: (taskId: string) => void;
  nudgeAllDomainPendingTasks: (domain?: DomainName) => number;
  acknowledgeTask: (taskId: string) => void;
  
  // Notifications
  markNotificationRead: (notifId: string) => void;
  markAllNotificationsRead: () => void;
  
  // Utility
  resetDataToDefault: () => void;
  toast: { text: string; type: 'info' | 'success' | 'warning' } | null;
  clearToast: () => void;
  showToast: (text: string, type?: 'info' | 'success' | 'warning') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY_TASKS = 'exec_tasks_v3';
const LOCAL_STORAGE_KEY_NOTIFS = 'exec_notifs_v3';
const LOCAL_STORAGE_KEY_USER = 'exec_current_user_v3';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users] = useState<User[]>(INITIAL_USERS);
  const [domains] = useState<DomainInfo[]>(DOMAINS);
  
  // Default to Admin: Tejas Signal (Founder / Admin)
  const [currentUser, setCurrentUserInternal] = useState<User>(() => {
    const savedUserId = localStorage.getItem(LOCAL_STORAGE_KEY_USER);
    if (savedUserId) {
      const found = INITIAL_USERS.find(u => u.id === savedUserId);
      if (found) return found;
    }
    return INITIAL_USERS[0]; // Tejas Signal
  });

  const [currentRole, setCurrentRoleInternal] = useState<Role>(currentUser.role);
  const [selectedMonth, setSelectedMonth] = useState<string>('2026-09');
  const [selectedUserForDetail, setSelectedUserForDetail] = useState<User | null>(null);

  const setCurrentUser = (user: User) => {
    setCurrentUserInternal(user);
    setCurrentRoleInternal(user.role);
    localStorage.setItem(LOCAL_STORAGE_KEY_USER, user.id);
  };

  const setCurrentRole = (role: Role) => {
    setCurrentRoleInternal(role);
  };

  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY_TASKS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved tasks', e);
      }
    }
    return INITIAL_TASKS;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY_NOTIFS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved notifications', e);
      }
    }
    return INITIAL_NOTIFICATIONS;
  });

  const [toast, setToast] = useState<{ text: string; type: 'info' | 'success' | 'warning' } | null>(null);

  const showToast = (text: string, type: 'info' | 'success' | 'warning' = 'info') => {
    setToast({ text, type });
    setTimeout(() => setToast(null), 3000);
  };

  const clearToast = () => setToast(null);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_TASKS, JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_NOTIFS, JSON.stringify(notifications));
  }, [notifications]);

  // Actions
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
    const now = new Date().toISOString();

    setTasks(prev =>
      prev.map(t => {
        if (t.id === taskId) {
          return {
            ...t,
            nudgedCount: t.nudgedCount + 1,
            acknowledgedByEmployee: false
          };
        }
        return t;
      })
    );

    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      userId: targetTask.assigneeId,
      type: 'REMINDER',
      title: `Reminder from Head ${targetTask.delegatedByHeadName}`,
      message: `Reminder for "${targetTask.title}". Please update your status today.`,
      taskId: targetTask.id,
      createdAt: now,
      read: false
    };

    setNotifications(prev => [newNotif, ...prev]);
    showToast(`Sent 1-click reminder to ${assignee?.name || 'Member'}`, 'success');
  };

  const nudgeAllDomainPendingTasks = (domain?: DomainName): number => {
    const pending = tasks.filter(t => t.status !== 'DONE' && (!domain || t.domain === domain) && t.month === selectedMonth);
    if (pending.length === 0) {
      showToast('All tasks are up to date!', 'info');
      return 0;
    }

    const now = new Date().toISOString();
    let count = 0;

    const newNotifs: NotificationItem[] = [];

    setTasks(prev =>
      prev.map(t => {
        if (t.status !== 'DONE' && (!domain || t.domain === domain) && t.month === selectedMonth) {
          count++;
          newNotifs.push({
            id: `notif-${Date.now()}-${t.id}`,
            userId: t.assigneeId,
            type: 'REMINDER',
            title: `Domain Reminder from Head ${t.delegatedByHeadName}`,
            message: `Please update status for task: "${t.title}".`,
            taskId: t.id,
            createdAt: now,
            read: false
          });

          return {
            ...t,
            nudgedCount: t.nudgedCount + 1,
            acknowledgedByEmployee: false
          };
        }
        return t;
      })
    );

    setNotifications(prev => [...newNotifs, ...prev]);
    showToast(`Sent reminders to ${count} pending tasks`, 'success');
    return count;
  };

  const acknowledgeTask = (taskId: string) => {
    setTasks(prev =>
      prev.map(t => (t.id === taskId ? { ...t, acknowledgedByEmployee: true } : t))
    );
    showToast('Task acknowledged', 'info');
  };

  const markNotificationRead = (notifId: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === notifId ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    showToast('Notifications marked as read', 'info');
  };

  const resetDataToDefault = () => {
    setTasks(INITIAL_TASKS);
    setNotifications(INITIAL_NOTIFICATIONS);
    localStorage.removeItem(LOCAL_STORAGE_KEY_TASKS);
    localStorage.removeItem(LOCAL_STORAGE_KEY_NOTIFS);
    showToast('Data reset to default', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        users,
        domains,
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
        resetDataToDefault,
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
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
