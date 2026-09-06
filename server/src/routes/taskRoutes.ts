import { Router, Request, Response } from 'express';
import { dataStore } from '../db/store.js';
import { Task } from '../types/index.js';
import { HierarchyService } from '../services/hierarchyService.js';

export const taskRouter = Router();

// GET /api/v1/tasks?orgId=...&month=...&viewerMemberId=...
taskRouter.get('/', (req: Request, res: Response) => {
  const orgId = req.query.orgId as string || 'org-clientra-demo';
  const month = req.query.month as string;
  const viewerMemberId = req.query.viewerMemberId as string;

  let filtered = dataStore.tasks.filter(t => t.org_id === orgId);

  if (month) {
    filtered = filtered.filter(t => t.month_period === month);
  }

  if (viewerMemberId) {
    const viewer = dataStore.members.find(m => m.id === viewerMemberId);
    if (viewer) {
      if (viewer.permission_level === 'INDIVIDUAL') {
        // Individual only sees tasks assigned directly to them
        filtered = filtered.filter(t => t.assignee_member_id === viewer.id);
      } else if (viewer.permission_level === 'MANAGER') {
        // Manager sees their own tasks + tasks of all subordinates
        const subIds = HierarchyService.getSubordinateMemberIds(viewer.id, orgId);
        filtered = filtered.filter(t => 
          t.assignee_member_id === viewer.id || 
          (t.assignee_member_id && subIds.includes(t.assignee_member_id)) ||
          t.delegated_by_member_id === viewer.id
        );
      }
      // ADMIN sees everything in the company
    }
  }

  return res.json({ tasks: filtered });
});

// POST /api/v1/tasks (Create new task)
taskRouter.post('/', (req: Request, res: Response) => {
  const { 
    org_id, 
    department_id, 
    title, 
    description, 
    priority, 
    status, 
    assignee_member_id, 
    delegated_by_member_id, 
    due_date, 
    month_period 
  } = req.body;

  if (!title || !org_id || !due_date || !month_period) {
    return res.status(400).json({ error: 'title, org_id, due_date, and month_period are required' });
  }

  const dept = department_id ? dataStore.departments.find(d => d.id === department_id) : undefined;
  const assignee = assignee_member_id ? dataStore.members.find(m => m.id === assignee_member_id) : undefined;
  const delegator = delegated_by_member_id ? dataStore.members.find(m => m.id === delegated_by_member_id) : undefined;

  const newTask: Task = {
    id: `task-${Date.now()}`,
    org_id,
    department_id,
    department_name: dept?.name || 'General',
    title,
    description,
    priority: priority || 'High',
    status: status || 'TODO',
    assignee_member_id,
    assignee_name: assignee?.full_name,
    assignee_avatar: assignee?.avatar_url,
    delegated_by_member_id,
    delegator_name: delegator?.full_name,
    due_date,
    month_period,
    nudged_count: 0,
    acknowledged: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  dataStore.tasks.push(newTask);
  return res.status(201).json({ task: newTask });
});

// PATCH /api/v1/tasks/:id (Update task status or fields)
taskRouter.patch('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const task = dataStore.tasks.find(t => t.id === id);
  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }

  const allowedFields = ['title', 'description', 'priority', 'status', 'assignee_member_id', 'due_date', 'acknowledged'];
  for (const field of allowedFields) {
    if (req.body[field] !== undefined) {
      (task as any)[field] = req.body[field];
    }
  }

  if (req.body.assignee_member_id) {
    const assignee = dataStore.members.find(m => m.id === req.body.assignee_member_id);
    if (assignee) {
      task.assignee_name = assignee.full_name;
      task.assignee_avatar = assignee.avatar_url;
    }
  }

  task.updated_at = new Date().toISOString();
  return res.json({ task });
});

// DELETE /api/v1/tasks/:id
taskRouter.delete('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const index = dataStore.tasks.findIndex(t => t.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }

  dataStore.tasks.splice(index, 1);
  return res.json({ message: 'Task deleted successfully' });
});
