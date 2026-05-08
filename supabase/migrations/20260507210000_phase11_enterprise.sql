-- Phase 11: Enterprise & Institutional Scaling

-- 1. Cities & Regional Clusters
create table if not exists public.cities (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  state text not null,
  country text not null default 'India',
  region_cluster text, -- e.g., "North India", "NCR", "South"
  is_active boolean default true,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.cities enable row level security;
create policy "anyone can view active cities" on public.cities for select using (is_active = true);
create policy "admins can manage cities" on public.cities for all to authenticated
  using (exists (select 1 from public.admin_users where user_id = auth.uid()));

-- Add foreign key to colleges if not already matching
-- (Assuming we just keep city names as text for now but reference this table for config)

-- 2. University API Keys (for ERP/LMS integration)
create table if not exists public.university_api_keys (
  id uuid primary key default gen_random_uuid(),
  college_id uuid not null references public.colleges(id) on delete cascade,
  api_key_hash text not null unique,
  label text not null, -- e.g., "Main ERP Integration"
  scopes text[] default '{"read:events", "read:attendance"}'::text[],
  last_used_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.university_api_keys enable row level security;
create policy "admins can manage university keys" on public.university_api_keys for all to authenticated
  using (exists (select 1 from public.admin_users where user_id = auth.uid()));

-- 3. Webhooks for Enterprise Integration
create table if not exists public.webhooks (
  id uuid primary key default gen_random_uuid(),
  college_id uuid not null references public.colleges(id) on delete cascade,
  url text not null,
  events text[] not null, -- e.g., ["ticket.purchased", "event.created"]
  secret text not null,
  is_active boolean default true,
  created_at timestamptz not null default now()
);

alter table public.webhooks enable row level security;
create policy "admins can manage webhooks" on public.webhooks for all to authenticated
  using (exists (select 1 from public.admin_users where user_id = auth.uid()));

-- 4. Organizer Payouts & Ledger
create table if not exists public.payouts (
  id uuid primary key default gen_random_uuid(),
  organizer_user_id uuid not null references auth.users(id) on delete cascade,
  amount int not null,
  currency text not null default 'INR',
  status text not null default 'pending', -- pending, processed, failed
  bank_reference text,
  metadata jsonb default '{}'::jsonb,
  processed_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.payouts enable row level security;
create policy "organizers can view own payouts" on public.payouts for select to authenticated
  using (auth.uid() = organizer_user_id);
create policy "admins can manage payouts" on public.payouts for all to authenticated
  using (exists (select 1 from public.admin_users where user_id = auth.uid()));

-- 5. Institutional Analytics View
create or replace view public.institutional_analytics as
select 
  c.id as college_id,
  c.name as college_name,
  count(distinct e.id) as total_events,
  sum(e.attendees) as total_footfall,
  sum(t.amount) filter (where t.status = 'completed') as total_revenue,
  count(distinct s.user_id) as active_subscriptions
from public.colleges c
left join public.events e on e.college_id = c.id
left join public.transactions t on (t.metadata->>'event_id')::uuid = e.id
left join public.subscriptions s on s.user_id = e.organizer_user_id
group by c.id, c.name;

-- Seed some cities
insert into public.cities (name, state, region_cluster)
values 
('Mumbai', 'Maharashtra', 'West'),
('Delhi', 'Delhi', 'North'),
('Bangalore', 'Karnataka', 'South'),
('Pune', 'Maharashtra', 'West'),
('Chennai', 'Tamil Nadu', 'South'),
('Hyderabad', 'Telangana', 'South'),
('Kolkata', 'West Bengal', 'East')
on conflict (name) do update set region_cluster = excluded.region_cluster;
