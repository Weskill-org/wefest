-- Add status field to events
alter table public.events add column if not exists status text not null default 'draft' check (status in ('draft', 'published', 'archived', 'cancelled'));

-- Add venue and time to events (date already exists)
alter table public.events add column if not exists venue text;
alter table public.events add column if not exists time text;

-- Add tags to events
alter table public.events add column if not exists tags text[] default '{}';

-- Add team members (as jsonb for flexibility)
alter table public.events add column if not exists team_members jsonb default '[]';

-- Add pass feature settings
-- Structure: { "vip": { "price": 0, "days": 0, "single_day_price": 0, "multi_day_price": 0, "enabled": boolean }, "normal": { ... } }
alter table public.events add column if not exists pass_settings jsonb default '{
  "vip": {"enabled": false, "price": 0, "days": 1, "single_day_price": 0, "multi_day_price": 0},
  "normal": {"enabled": true, "price": 0, "days": 1, "single_day_price": 0, "multi_day_price": 0}
}'::jsonb;

-- Update existing events to 'published' for continuity
update public.events set status = 'published' where status = 'draft';
