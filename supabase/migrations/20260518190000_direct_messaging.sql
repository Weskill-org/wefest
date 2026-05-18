create table public.direct_messages (
  id uuid primary key default gen_random_uuid(),
  sender_id uuid not null references auth.users(id) on delete cascade,
  receiver_id uuid not null references auth.users(id) on delete cascade,
  event_id uuid references public.events(id) on delete set null,
  message text not null,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.direct_messages enable row level security;

create policy "Users can view their own messages" on public.direct_messages for select to authenticated
  using (auth.uid() = sender_id or auth.uid() = receiver_id);

create policy "Users can insert messages" on public.direct_messages for insert to authenticated
  with check (auth.uid() = sender_id);

create policy "Receivers can update message read status" on public.direct_messages for update to authenticated
  using (auth.uid() = receiver_id)
  with check (auth.uid() = receiver_id);

DO $$ 
BEGIN
  -- Remove the table from publication if it exists to avoid errors
  alter publication supabase_realtime drop table public.direct_messages;
EXCEPTION WHEN OTHERS THEN
  -- Ignore error if not in publication
END $$;

alter publication supabase_realtime add table public.direct_messages;

