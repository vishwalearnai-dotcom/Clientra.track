import { Router, Request, Response } from 'express';
import { dataStore } from '../db/store.js';

export const organizationRouter = Router();

// GET /api/v1/organizations/:idOrSlug
organizationRouter.get('/:idOrSlug', (req: Request, res: Response) => {
  const { idOrSlug } = req.params;
  const org = dataStore.organizations.find(o => o.id === idOrSlug || o.slug === idOrSlug);
  if (!org) {
    return res.status(404).json({ error: 'Organization not found' });
  }
  return res.json({ organization: org });
});

// POST /api/v1/organizations (Onboarding new company)
organizationRouter.post('/', (req: Request, res: Response) => {
  const { name, slug } = req.body;
  if (!name || !slug) {
    return res.status(400).json({ error: 'Company name and slug are required' });
  }

  const existing = dataStore.organizations.find(o => o.slug === slug);
  if (existing) {
    return res.status(409).json({ error: 'Organization slug is already taken' });
  }

  const newOrg = {
    id: `org-${Date.now()}`,
    name,
    slug,
    plan_status: 'TRIAL' as const,
    trial_ends_at: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  dataStore.organizations.push(newOrg);
  return res.status(201).json({ organization: newOrg });
});

// PATCH /api/v1/organizations/:id/plan (Super-Admin grant free trial or change status)
organizationRouter.patch('/:id/plan', (req: Request, res: Response) => {
  const { id } = req.params;
  const { plan_status, trial_days } = req.body;

  const org = dataStore.organizations.find(o => o.id === id);
  if (!org) {
    return res.status(404).json({ error: 'Organization not found' });
  }

  if (plan_status) org.plan_status = plan_status;
  if (trial_days) {
    org.trial_ends_at = new Date(Date.now() + trial_days * 24 * 60 * 60 * 1000).toISOString();
  }
  org.updated_at = new Date().toISOString();

  return res.json({ organization: org, message: 'Organization plan updated' });
});
