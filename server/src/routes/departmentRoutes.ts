import { Router, Request, Response } from 'express';
import { dataStore } from '../db/store.js';

export const departmentRouter = Router();

// GET /api/v1/departments?orgId=...
departmentRouter.get('/', (req: Request, res: Response) => {
  const orgId = req.query.orgId as string || 'org-clientra-demo';
  const departments = dataStore.departments.filter(d => d.org_id === orgId);
  return res.json({ departments });
});

// POST /api/v1/departments (Create custom department for company)
departmentRouter.post('/', (req: Request, res: Response) => {
  const { org_id, name, lead_user_id } = req.body;
  if (!name || !org_id) {
    return res.status(400).json({ error: 'Department name and org_id are required' });
  }

  const existing = dataStore.departments.find(d => d.org_id === org_id && d.name.toLowerCase() === name.toLowerCase());
  if (existing) {
    return res.status(409).json({ error: 'Department already exists for this organization' });
  }

  const newDept = {
    id: `dept-${Date.now()}`,
    org_id,
    name,
    lead_user_id,
    created_at: new Date().toISOString()
  };

  dataStore.departments.push(newDept);
  return res.status(201).json({ department: newDept });
});

// DELETE /api/v1/departments/:id
departmentRouter.delete('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const index = dataStore.departments.findIndex(d => d.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Department not found' });
  }

  dataStore.departments.splice(index, 1);
  return res.json({ message: 'Department deleted successfully' });
});
