import { User, Task, DomainInfo, NotificationItem } from '../types';

export const DOMAINS: DomainInfo[] = [
  { name: 'Sales', headName: 'Vinitha', headRole: 'Head of Sales' },
  { name: 'Marketing', headName: 'Guru', headRole: 'Head of Marketing' },
  { name: 'Operations', headName: 'Dr Karthik', headRole: 'Head of Operations' },
  { name: 'Installation', headName: 'Lokeshwar', headRole: 'Head of Installation' },
  { name: 'R&D', headName: 'Dr Karthik', headRole: 'Head of R&D' },
  { name: 'Founders Office', headName: 'Vinitha', headRole: 'Head of Founders Office' },
  { name: 'Finance', headName: 'Tharun', headRole: 'Head of Finance' },
];

export const INITIAL_USERS: User[] = [
  // Admin / Founder
  {
    id: 'user-admin-tejas',
    name: 'Tejas Signal',
    email: 'tejas@company.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    role: 'ADMIN',
    title: 'Founder / Admin',
    domain: 'Founders Office',
    headName: 'Tejas Signal'
  },

  // Domain Heads (Leads)
  {
    id: 'lead-vinitha',
    name: 'Vinitha',
    email: 'vinitha@company.com',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    role: 'LEAD',
    title: 'Head of Sales & Founders Office',
    domain: 'Sales',
    headName: 'Vinitha'
  },
  {
    id: 'lead-guru',
    name: 'Guru',
    email: 'guru@company.com',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    role: 'LEAD',
    title: 'Head of Marketing',
    domain: 'Marketing',
    headName: 'Guru'
  },
  {
    id: 'lead-dr-karthik',
    name: 'Dr Karthik',
    email: 'drkarthik@company.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    role: 'LEAD',
    title: 'Head of Operations & R&D',
    domain: 'Operations',
    headName: 'Dr Karthik'
  },
  {
    id: 'lead-lokeshwar',
    name: 'Lokeshwar',
    email: 'lokeshwar@company.com',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150',
    role: 'LEAD',
    title: 'Head of Installation',
    domain: 'Installation',
    headName: 'Lokeshwar'
  },
  {
    id: 'lead-tharun',
    name: 'Tharun',
    email: 'tharun@company.com',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150',
    role: 'LEAD',
    title: 'Head of Finance',
    domain: 'Finance',
    headName: 'Tharun'
  },

  // Members (Assigned to specific Leads)
  {
    id: 'member-nithin',
    name: 'Nithin',
    email: 'nithin@company.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    role: 'MEMBER',
    title: 'Sales Account Executive',
    domain: 'Sales',
    headName: 'Vinitha'
  },
  {
    id: 'member-srijan',
    name: 'Srijan',
    email: 'srijan@company.com',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150',
    role: 'MEMBER',
    title: 'Founders Office Associate',
    domain: 'Founders Office',
    headName: 'Vinitha'
  },
  {
    id: 'member-sachin',
    name: 'Sachin',
    email: 'sachin@company.com',
    avatar: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=150',
    role: 'MEMBER',
    title: 'Operations Specialist',
    domain: 'Operations',
    headName: 'Dr Karthik'
  },
  {
    id: 'member-shiva',
    name: 'Shiva',
    email: 'shiva@company.com',
    avatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=150',
    role: 'MEMBER',
    title: 'Installation Lead Engineer',
    domain: 'Installation',
    headName: 'Lokeshwar'
  },
  {
    id: 'member-neha',
    name: 'Neha',
    email: 'neha@company.com',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150',
    role: 'MEMBER',
    title: 'R&D Firmware Researcher',
    domain: 'R&D',
    headName: 'Dr Karthik'
  },
  {
    id: 'member-ananya',
    name: 'Ananya',
    email: 'ananya@company.com',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
    role: 'MEMBER',
    title: 'Marketing Manager',
    domain: 'Marketing',
    headName: 'Guru'
  },
  {
    id: 'member-pooja',
    name: 'Pooja',
    email: 'pooja@company.com',
    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150',
    role: 'MEMBER',
    title: 'Financial Analyst',
    domain: 'Finance',
    headName: 'Tharun'
  }
];

export const INITIAL_TASKS: Task[] = [
  // September 2026 Monthly Tasks
  // Nithin (Sales under Vinitha)
  {
    id: 'task-nithin-1',
    title: 'Finalize Enterprise Contract with Key Client',
    domain: 'Sales',
    status: 'IN_PROGRESS',
    priority: 'High',
    assigneeId: 'member-nithin',
    delegatedByHeadName: 'Vinitha',
    dueDate: '2026-09-15',
    month: '2026-09',
    lastUpdated: '2026-09-01',
    nudgedCount: 1,
    acknowledgedByEmployee: true
  },
  {
    id: 'task-nithin-2',
    title: 'Submit Q3 Regional Sales Pitch Deck',
    domain: 'Sales',
    status: 'TODO',
    priority: 'High',
    assigneeId: 'member-nithin',
    delegatedByHeadName: 'Vinitha',
    dueDate: '2026-09-10',
    month: '2026-09',
    lastUpdated: '2026-09-01',
    nudgedCount: 2,
    acknowledgedByEmployee: false // Pending reminder
  },

  // Srijan (Founders Office under Vinitha)
  {
    id: 'task-srijan-1',
    title: 'Prepare Founders Office Weekly Strategic Briefing',
    domain: 'Founders Office',
    status: 'IN_PROGRESS',
    priority: 'High',
    assigneeId: 'member-srijan',
    delegatedByHeadName: 'Vinitha',
    dueDate: '2026-09-08',
    month: '2026-09',
    lastUpdated: '2026-09-01',
    nudgedCount: 0,
    acknowledgedByEmployee: true
  },
  {
    id: 'task-srijan-2',
    title: 'Coordinate Investor Update Report for Q3',
    domain: 'Founders Office',
    status: 'TODO',
    priority: 'Medium',
    assigneeId: 'member-srijan',
    delegatedByHeadName: 'Vinitha',
    dueDate: '2026-09-20',
    month: '2026-09',
    lastUpdated: '2026-09-01',
    nudgedCount: 1,
    acknowledgedByEmployee: false
  },
  {
    id: 'task-srijan-3',
    title: 'Prepare Founders Office Weekly Strategic Briefing',
    domain: 'Founders Office',
    status: 'IN_PROGRESS',
    priority: 'High',
    assigneeId: 'member-srijan',
    delegatedByHeadName: 'Vinitha',
    dueDate: '2026-09-08',
    month: '2026-09',
    lastUpdated: '2026-09-01',
    nudgedCount: 0,
    acknowledgedByEmployee: true
  },
  {
    id: 'task-srijan-4',
    title: 'Prepare Founders Office Weekly Strategic Briefing',
    domain: 'Founders Office',
    status: 'IN_PROGRESS',
    priority: 'High',
    assigneeId: 'member-srijan',
    delegatedByHeadName: 'Vinitha',
    dueDate: '2026-09-08',
    month: '2026-09',
    lastUpdated: '2026-09-01',
    nudgedCount: 0,
    acknowledgedByEmployee: true
  },
  {
    id: 'task-srijan-5',
    title: 'Prepare Founders Office Weekly Strategic Briefing',
    domain: 'Founders Office',
    status: 'IN_PROGRESS',
    priority: 'High',
    assigneeId: 'member-srijan',
    delegatedByHeadName: 'Vinitha',
    dueDate: '2026-09-08',
    month: '2026-09',
    lastUpdated: '2026-09-01',
    nudgedCount: 0,
    acknowledgedByEmployee: true
  },
  {
    id: 'task-srijan-6',
    title: 'Prepare Founders Office Weekly Strategic Briefing',
    domain: 'Founders Office',
    status: 'IN_PROGRESS',
    priority: 'High',
    assigneeId: 'member-srijan',
    delegatedByHeadName: 'Vinitha',
    dueDate: '2026-09-08',
    month: '2026-09',
    lastUpdated: '2026-09-01',
    nudgedCount: 0,
    acknowledgedByEmployee: true
  },
  {
    id: 'task-srijan-7',
    title: 'Prepare Founders Office Weekly Strategic Briefing',
    domain: 'Founders Office',
    status: 'IN_PROGRESS',
    priority: 'High',
    assigneeId: 'member-srijan',
    delegatedByHeadName: 'Vinitha',
    dueDate: '2026-09-08',
    month: '2026-09',
    lastUpdated: '2026-09-01',
    nudgedCount: 0,
    acknowledgedByEmployee: true
  },

  // Sachin (Operations under Dr Karthik)
  {
    id: 'task-sachin-1',
    title: 'Audit Regional Logistics & Dispatch Timeline',
    domain: 'Operations',
    status: 'IN_PROGRESS',
    priority: 'High',
    assigneeId: 'member-sachin',
    delegatedByHeadName: 'Dr Karthik',
    dueDate: '2026-09-12',
    month: '2026-09',
    lastUpdated: '2026-09-01',
    nudgedCount: 1,
    acknowledgedByEmployee: true
  },
  {
    id: 'task-sachin-2',
    title: 'Reconcile Warehouse Inventory Discrepancies',
    domain: 'Operations',
    status: 'TODO',
    priority: 'High',
    assigneeId: 'member-sachin',
    delegatedByHeadName: 'Dr Karthik',
    dueDate: '2026-09-05',
    month: '2026-09',
    lastUpdated: '2026-09-01',
    nudgedCount: 2,
    acknowledgedByEmployee: false
  },

  // Shiva (Installation under Lokeshwar)
  {
    id: 'task-shiva-1',
    title: 'Complete On-Site Hardware Installation at Main Hub',
    domain: 'Installation',
    status: 'IN_PROGRESS',
    priority: 'High',
    assigneeId: 'member-shiva',
    delegatedByHeadName: 'Lokeshwar',
    dueDate: '2026-09-14',
    month: '2026-09',
    lastUpdated: '2026-09-01',
    nudgedCount: 0,
    acknowledgedByEmployee: true
  },

  // Neha (R&D under Dr Karthik)
  {
    id: 'task-neha-1',
    title: 'Run Sensor Calibration & Microcontroller Testing',
    domain: 'R&D',
    status: 'DONE',
    priority: 'High',
    assigneeId: 'member-neha',
    delegatedByHeadName: 'Dr Karthik',
    dueDate: '2026-09-02',
    month: '2026-09',
    lastUpdated: '2026-09-02',
    nudgedCount: 0,
    acknowledgedByEmployee: true
  },

  // Ananya (Marketing under Guru)
  {
    id: 'task-ananya-1',
    title: 'Launch September Q3 Digital Campaign',
    domain: 'Marketing',
    status: 'IN_PROGRESS',
    priority: 'High',
    assigneeId: 'member-ananya',
    delegatedByHeadName: 'Guru',
    dueDate: '2026-09-18',
    month: '2026-09',
    lastUpdated: '2026-09-01',
    nudgedCount: 0,
    acknowledgedByEmployee: true
  },

  // Pooja (Finance under Tharun)
  {
    id: 'task-pooja-1',
    title: 'Process Monthly Vendor Invoices & Tax Audits',
    domain: 'Finance',
    status: 'DONE',
    priority: 'High',
    assigneeId: 'member-pooja',
    delegatedByHeadName: 'Tharun',
    dueDate: '2026-09-01',
    month: '2026-09',
    lastUpdated: '2026-09-01',
    nudgedCount: 0,
    acknowledgedByEmployee: true
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    userId: 'member-nithin',
    type: 'REMINDER',
    title: 'Reminder from Head Vinitha',
    message: 'Please update status for task "Submit Q3 Regional Sales Pitch Deck".',
    taskId: 'task-nithin-2',
    createdAt: '2026-09-01T09:00:00Z',
    read: false
  }
];
