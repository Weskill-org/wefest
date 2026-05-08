create table public.volunteers (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'general',
  status text not null default 'pending',
  created_at timestamptz not null default now()
);
alter table public.volunteers enable row level security;
create policy "users can view own volunteer status" on public.volunteers for select to authenticated
  using (auth.uid() = user_id);
create policy "organizers can view volunteers for their events" on public.volunteers for select to authenticated
  using (exists (select 1 from public.events e where e.id = event_id and e.organizer_user_id = auth.uid()));
create policy "users can apply to volunteer" on public.volunteers for insert to authenticated
  with check (auth.uid() = user_id);
create policy "organizers can update volunteer status" on public.volunteers for update to authenticated
  using (exists (select 1 from public.events e where e.id = event_id and e.organizer_user_id = auth.uid()));

create table public.sponsor_booth_visits (
  id uuid primary key default gen_random_uuid(),
  sponsor_user_id uuid not null references auth.users(id) on delete cascade,
  event_id uuid not null references public.events(id) on delete cascade,
  student_user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table public.sponsor_booth_visits enable row level security;
create policy "sponsors can view their own visits" on public.sponsor_booth_visits for select to authenticated
  using (auth.uid() = sponsor_user_id);
create policy "organizers can view visits for their events" on public.sponsor_booth_visits for select to authenticated
  using (exists (select 1 from public.events e where e.id = event_id and e.organizer_user_id = auth.uid()));
create policy "students can insert booth visits" on public.sponsor_booth_visits for insert to authenticated
  with check (auth.uid() = student_user_id);
