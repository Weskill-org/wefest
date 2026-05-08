-- Update events table for Phase 11 scaling
alter table public.events add column if not exists is_government_partnered boolean default false;
alter table public.events add column if not exists external_id text; -- For ERP linking

-- Add a comment to mark it as part of Phase 11
comment on column public.events.is_government_partnered is 'Flags events that are part of government youth fest digitization initiatives.';
