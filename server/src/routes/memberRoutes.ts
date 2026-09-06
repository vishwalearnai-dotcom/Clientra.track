import { Router, Request, Response } from 'express';
import { dataStore } from '../db/store.js';
import { HierarchyService } from '../services/hierarchyService.js';

export const memberRouter = Router();

// GET /api/v1/members?orgId=...&viewerMemberId=...
memberRouter.get('/', (req: Request, res: Response) => {
  const orgId = req.query.orgId as string || 'org-clientra-demo';
  const viewerMemberId = req.query.viewerMemberId as string;

  const orgMembers = dataStore.members.filter(m => m.org_id === orgId && m.is_active);

  if (!viewerMemberId) {
    return res.json({ members: orgMembers });
  }

  const viewer = orgMembers.find(m => m.id === viewerMemberId);
  if (!viewer) {
    return res.status(404).json({ error: 'Viewer member not found' });
  }

  // Admin sees all employees
  if (viewer.permission_level === 'ADMIN') {
    return res.json({ members: orgMembers });
  }

  // Manager sees self + all direct/indirect reporting subordinates
  if (viewer.permission_level === 'MANAGER') {
    const subordinateIds = HierarchyService.getSubordinateMemberIds(viewer.id, orgId);
    const visible = orgMembers.filter(m => m.id === viewer.id || subordinateIds.includes(m.id));
    return res.json({ members: visible });
  }

  // Individual contributor only sees self
  return res.json({ members: [viewer] });
});

// POST /api/v1/members (Invite/Add employee with custom hierarchy pointer)
memberRouter.post('/', (req: Request, res: Response) => {
  const { 
    org_id, 
    email, 
    full_name, 
    permission_level, 
    custom_title, 
    department_id, 
    reports_to_member_id, 
    avatar_url, 
    phone_number 
  } = req.body;

  if (!org_id || !email || !full_name) {
    return res.status(400).json({ error: 'org_id, email, and full_name are required' });
  }

  const dept = department_id ? dataStore.departments.find(d => d.id === department_id) : undefined;
  const manager = reports_to_member_id ? dataStore.members.find(m => m.id === reports_to_member_id) : undefined;

  const newMember = {
    id: `mem-${Date.now()}`,
    org_id,
    email,
    full_name,
    permission_level: permission_level || 'INDIVIDUAL',
    custom_title: custom_title || 'Team Member',
    department_id,
    department_name: dept?.name,
    reports_to_member_id,
    manager_name: manager?.full_name,
    avatar_url: avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    phone_number,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  dataStore.members.push(newMember);
  return res.status(201).json({ member: newMember });
});
