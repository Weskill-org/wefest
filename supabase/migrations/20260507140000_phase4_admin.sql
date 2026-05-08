-- Admin Users Table
create table public.admin_users (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade unique,
  created_at timestamptz not null default now()
);
alter table public.admin_users enable row level security;
create policy "admin_users read" on public.admin_users for select to authenticated using (true);

-- Add status to events table
alter table public.events add column status text not null default 'approved';
-- A constraint to ensure status is one of pending, approved, rejected
alter table public.events add constraint events_status_check check (status in ('pending', 'approved', 'rejected'));

-- Update event policies for admin to be able to approve/reject
-- (Currently organizers can update their own events, we add a policy for admins)
create policy "admins can update any event" on public.events for update to authenticated
  using (exists (select 1 from public.admin_users where user_id = auth.uid()));

-- Blacklisted Users Table
create table public.blacklisted_users (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade unique,
  reason text not null default '',
  created_by uuid not null references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);
alter table public.blacklisted_users enable row level security;
create policy "anyone can read blacklist" on public.blacklisted_users for select using (true);
create policy "admins can insert blacklist" on public.blacklisted_users for insert to authenticated
  with check (exists (select 1 from public.admin_users where user_id = auth.uid()));
create policy "admins can delete blacklist" on public.blacklisted_users for delete to authenticated
  using (exists (select 1 from public.admin_users where user_id = auth.uid()));

-- Broadcast Messages Table
create table public.broadcast_messages (
  id uuid primary key default gen_random_uuid(),
  message text not null,
  severity text not null default 'info', -- info, warning, emergency
  active boolean not null default true,
  created_by uuid not null references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);
alter table public.broadcast_messages enable row level security;
create policy "anyone can read active broadcasts" on public.broadcast_messages for select using (active = true);
create policy "admins can read all broadcasts" on public.broadcast_messages for select to authenticated
  using (exists (select 1 from public.admin_users where user_id = auth.uid()));
create policy "admins can insert broadcasts" on public.broadcast_messages for insert to authenticated
  with check (exists (select 1 from public.admin_users where user_id = auth.uid()));
create policy "admins can update broadcasts" on public.broadcast_messages for update to authenticated
  using (exists (select 1 from public.admin_users where user_id = auth.uid()));

-- Audit Logs Table
create table public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  admin_user_id uuid not null references auth.users(id) on delete cascade,
  action text not null,
  resource_type text not null,
  resource_id text,
  details jsonb default '{}'::jsonb,
  created_at timestamptz not null default now()
);
alter table public.audit_logs enable row level security;
create policy "admins can read audit logs" on public.audit_logs for select to authenticated
  using (exists (select 1 from public.admin_users where user_id = auth.uid()));
create policy "admins can insert audit logs" on public.audit_logs for insert to authenticated
  with check (exists (select 1 from public.admin_users where user_id = auth.uid()));

-- Allow admins to read all tickets and proposals for analytics
create policy "admins can read all tickets" on public.tickets for select to authenticated
  using (exists (select 1 from public.admin_users where user_id = auth.uid()));

create policy "admins can read all proposals" on public.sponsorship_proposals for select to authenticated
  using (exists (select 1 from public.admin_users where user_id = auth.uid()));
