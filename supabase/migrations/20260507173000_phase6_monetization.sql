-- Phase 6: Monetization & Advanced Analytics

-- 1. Subscriptions Table
create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  plan_type text not null, -- 'basic', 'pro', 'enterprise'
  status text not null default 'active',
  current_period_end timestamptz,
  created_at timestamptz not null default now()
);

alter table public.subscriptions enable row level security;
create policy "users can view own subscription" on public.subscriptions for select to authenticated
  using (auth.uid() = user_id);

-- 2. Transactions Table
create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  amount int not null,
  currency text not null default 'INR',
  status text not null, -- 'completed', 'pending', 'failed'
  description text,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.transactions enable row level security;
create policy "users can view own transactions" on public.transactions for select to authenticated
  using (auth.uid() = user_id);

-- 3. Certificates Table
create table if not exists public.certificates (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  event_id uuid not null references public.events(id) on delete cascade,
  issue_date timestamptz not null default now(),
  certificate_url text,
  metadata jsonb default '{}'::jsonb,
  unique(user_id, event_id)
);

alter table public.certificates enable row level security;
create policy "users can view own certificates" on public.certificates for select to authenticated
  using (auth.uid() = user_id);

-- 4. Extend Events Table
alter table public.events add column if not exists is_featured boolean not null default false;
alter table public.events add column if not exists is_promoted boolean not null default false;

-- 5. Extend Sponsor Booth Visits for Heatmap
-- Add booth position (x, y) or booth_id
alter table public.sponsor_booth_visits add column if not exists booth_id text;
alter table public.sponsor_booth_visits add column if not exists booth_coords_x int;
alter table public.sponsor_booth_visits add column if not exists booth_coords_y int;

-- 6. Global Config for Admin (e.g., Commission Rates)
create table if not exists public.platform_config (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

insert into public.platform_config (key, value)
values ('monetization', '{"ticket_commission": 0.10, "sponsor_commission": 0.05}'::jsonb)
on conflict (key) do nothing;

alter table public.platform_config enable row level security;
create policy "anyone can read config" on public.platform_config for select using (true);
create policy "admins can update config" on public.platform_config for update to authenticated
  using (exists (select 1 from public.admin_users where user_id = auth.uid()));
