-- Phase 12: Advanced Operations & Financial Controls

-- 0. Ensure colleges has metadata for ownership checks
alter table public.colleges add column if not exists metadata jsonb default '{}'::jsonb;

-- 1. Event Budgets & Expenses
create table if not exists public.event_budgets (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  category text not null, -- e.g., "Production", "Marketing", "Security", "Artists"
  allocated_amount int not null default 0,
  spent_amount int not null default 0,
  currency text not null default 'INR',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.event_budgets enable row level security;
create policy "organizers can manage own event budgets" on public.event_budgets for all to authenticated
  using (exists (select 1 from public.events where id = event_id and organizer_user_id = auth.uid()));

create table if not exists public.event_expenses (
  id uuid primary key default gen_random_uuid(),
  budget_id uuid not null references public.event_budgets(id) on delete cascade,
  description text not null,
  amount int not null,
  status text not null default 'pending', -- pending, paid, cancelled
  vendor_name text,
  invoice_url text,
  created_at timestamptz not null default now()
);

alter table public.event_expenses enable row level security;
create policy "organizers can manage own event expenses" on public.event_expenses for all to authenticated
  using (exists (select 1 from public.event_budgets b join public.events e on b.event_id = e.id 
                 where b.id = budget_id and e.organizer_user_id = auth.uid()));

-- 2. Marketing Campaigns & Notifications
create table if not exists public.marketing_campaigns (
  id uuid primary key default gen_random_uuid(),
  college_id uuid not null references public.colleges(id) on delete cascade,
  title text not null,
  message_content text not null,
  channel text not null, -- email, sms, push
  target_segment text not null, -- all_students, ticket_holders, past_attendees
  scheduled_at timestamptz,
  status text not null default 'draft', -- draft, scheduled, sent, failed
  created_at timestamptz not null default now()
);

alter table public.marketing_campaigns enable row level security;
create policy "admins and college owners can manage marketing" on public.marketing_campaigns for all to authenticated
  using (exists (select 1 from public.admin_users where user_id = auth.uid()) 
      or exists (select 1 from public.colleges where id = college_id and (metadata->>'owner_id')::uuid = auth.uid()));

create table if not exists public.notification_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  body text not null,
  is_read boolean default false,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.notification_logs enable row level security;
create policy "users can view own notification logs" on public.notification_logs for select to authenticated
  using (auth.uid() = user_id);

-- 3. Advanced Financials: Vendor Payouts & Tax Rules
create table if not exists public.vendor_payouts (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  vendor_name text not null,
  vendor_id_number text, -- GSTIN or similar
  amount int not null,
  tax_amount int default 0,
  status text not null default 'pending', -- pending, approved, paid
  scheduled_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.vendor_payouts enable row level security;
create policy "organizers can manage own vendor payouts" on public.vendor_payouts for all to authenticated
  using (exists (select 1 from public.events where id = event_id and organizer_user_id = auth.uid()));

create table if not exists public.tax_rules (
  id uuid primary key default gen_random_uuid(),
  country text not null default 'India',
  state text, -- null for national rules
  tax_type text not null, -- GST, VAT, Service Tax
  percentage decimal(5,2) not null,
  is_active boolean default true,
  created_at timestamptz not null default now()
);

alter table public.tax_rules enable row level security;
create policy "anyone can view tax rules" on public.tax_rules for select using (is_active = true);
create policy "admins can manage tax rules" on public.tax_rules for all to authenticated
  using (exists (select 1 from public.admin_users where user_id = auth.uid()));

-- Insert default GST rules for India
insert into public.tax_rules (tax_type, percentage)
values ('GST', 18.00)
on conflict do nothing;
