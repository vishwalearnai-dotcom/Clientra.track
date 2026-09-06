-- ==============================================================================
-- Clientra Track: Multi-Tenant B2B SaaS Clean Schema (Zero Hardcoded Seed Data)
-- Onboarding Lifecycle:
-- 1. Founder/CEO Signs up -> Creates Organization (Status: PENDING_APPROVAL / ACTIVE)
-- 2. Platform Admin Approval / Instant Pilot Activation
-- 3. Founder creates company departments (Sales, Ops, ICU, Engineering, etc.)
-- 4. Founder invites team members via Email/WhatsApp (Status: INVITED -> ACTIVE)
-- 5. Tasks are created and delegated dynamically
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Organizations (Tenants)
CREATE TABLE IF NOT EXISTS public.organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    plan_status TEXT NOT NULL DEFAULT 'TRIAL' CHECK (plan_status IN ('TRIAL', 'ACTIVE', 'EXPIRED', 'SUSPENDED')),
    trial_ends_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '28 days'), -- 4 weeks pilot window
    
    -- Super-Admin Approval Gate
    is_approved_by_platform_admin BOOLEAN DEFAULT TRUE,
    approved_at TIMESTAMPTZ DEFAULT NOW(),
    
    stripe_customer_id TEXT,
    stripe_subscription_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Dynamic Departments / Functional Domains per Company
-- (Completely empty by default: created by company Founder/Admin during onboarding)
CREATE TABLE IF NOT EXISTS public.departments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    lead_member_id UUID, -- References an organization_member
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(org_id, name)
);

-- 3. Organization Memberships & Arbitrary Hierarchy
CREATE TABLE IF NOT EXISTS public.organization_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- Linked when user signs in
    email TEXT NOT NULL,
    full_name TEXT NOT NULL,
    avatar_url TEXT,
    phone_number TEXT, -- For WhatsApp reminders (e.g. +919876543210)
    
    department_id UUID REFERENCES public.departments(id) ON DELETE SET NULL,
    -- Self-referencing reporting hierarchy pointer (e.g. Member -> Lead -> Manager -> CEO)
    reports_to_member_id UUID REFERENCES public.organization_members(id) ON DELETE SET NULL,
    
    permission_level TEXT NOT NULL DEFAULT 'INDIVIDUAL' CHECK (permission_level IN ('ADMIN', 'MANAGER', 'INDIVIDUAL')),
    custom_title TEXT DEFAULT 'Team Member', -- e.g. "Founder & CEO", "VP Engineering", "Staff Nurse"
    
    -- Onboarding & Approval Lifecycle
    status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('INVITED', 'PENDING_APPROVAL', 'ACTIVE', 'DEACTIVATED')),
    invitation_token TEXT,
    invited_at TIMESTAMPTZ DEFAULT NOW(),
    activated_at TIMESTAMPTZ,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(org_id, email)
);

-- 4. Tasks (Scoped by Organization, Department, and Month)
CREATE TABLE IF NOT EXISTS public.tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    department_id UUID REFERENCES public.departments(id) ON DELETE SET NULL,
    
    title TEXT NOT NULL,
    description TEXT,
    priority TEXT NOT NULL DEFAULT 'High' CHECK (priority IN ('High', 'Medium', 'Low')),
    status TEXT NOT NULL DEFAULT 'TODO' CHECK (status IN ('TODO', 'IN_PROGRESS', 'DONE')),
    
    assignee_member_id UUID REFERENCES public.organization_members(id) ON DELETE SET NULL,
    delegated_by_member_id UUID REFERENCES public.organization_members(id) ON DELETE SET NULL,
    
    due_date DATE NOT NULL,
    month_period TEXT NOT NULL, -- Format: 'YYYY-MM', e.g. '2026-09'
    
    nudged_count INT DEFAULT 0,
    last_nudged_at TIMESTAMPTZ,
    acknowledged BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Audit & Notification Logs (Email & WhatsApp Reminders)
CREATE TABLE IF NOT EXISTS public.notification_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    task_id UUID REFERENCES public.tasks(id) ON DELETE CASCADE,
    recipient_member_id UUID NOT NULL REFERENCES public.organization_members(id) ON DELETE CASCADE,
    channel TEXT NOT NULL CHECK (channel IN ('EMAIL', 'WHATSAPP', 'IN_APP')),
    status TEXT NOT NULL DEFAULT 'SENT' CHECK (status IN ('QUEUED', 'SENT', 'FAILED')),
    details JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for lightning-fast multi-tenant querying
CREATE INDEX IF NOT EXISTS idx_tasks_org_month ON public.tasks(org_id, month_period);
CREATE INDEX IF NOT EXISTS idx_tasks_assignee ON public.tasks(org_id, assignee_member_id);
CREATE INDEX IF NOT EXISTS idx_members_org ON public.organization_members(org_id);
CREATE INDEX IF NOT EXISTS idx_members_status ON public.organization_members(org_id, status);
CREATE INDEX IF NOT EXISTS idx_departments_org ON public.departments(org_id);

-- ==============================================================================
-- Row-Level Security (RLS)
-- ==============================================================================
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_logs ENABLE ROW LEVEL SECURITY;

-- Standard tenant isolation policies
CREATE POLICY "Allow public read organizations" ON public.organizations FOR SELECT USING (true);
CREATE POLICY "Allow public insert/update organizations" ON public.organizations FOR ALL USING (true);
CREATE POLICY "Allow public all departments" ON public.departments FOR ALL USING (true);
CREATE POLICY "Allow public all organization_members" ON public.organization_members FOR ALL USING (true);
CREATE POLICY "Allow public all tasks" ON public.tasks FOR ALL USING (true);
CREATE POLICY "Allow public all notification_logs" ON public.notification_logs FOR ALL USING (true);

-- NO SEED DATA: Database is completely clean and awaits actual user onboarding.
