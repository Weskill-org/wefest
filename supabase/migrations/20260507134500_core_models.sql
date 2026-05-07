create table public.colleges (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  domain text not null,
  city text not null,
  fests int not null default 0,
  created_at timestamptz not null default now()
);
alter table public.colleges enable row level security;
create policy "colleges public read" on public.colleges for select using (true);

create table public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  college_id uuid references public.colleges(id) on delete set null,
  college_name text not null,
  organizer_user_id uuid references auth.users(id) on delete set null,
  organizer text not null default '',
  date date not null,
  city text not null,
  category text not null,
  cover text not null default 'from-fuchsia-500 via-purple-600 to-indigo-700',
  attendees int not null default 0,
  price_from int not null default 0,
  description text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.events enable row level security;
create policy "events public read" on public.events for select using (true);
create policy "organizer insert events" on public.events for insert to authenticated
  with check (auth.uid() = organizer_user_id);
create policy "organizer update own events" on public.events for update to authenticated
  using (auth.uid() = organizer_user_id);
create policy "organizer delete own events" on public.events for delete to authenticated
  using (auth.uid() = organizer_user_id);

create trigger trg_events_updated_at
before update on public.events
for each row execute function public.update_updated_at_column();

create table public.tickets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  event_id uuid not null references public.events(id) on delete cascade,
  tier text not null default 'General',
  code text not null unique,
  created_at timestamptz not null default now()
);
alter table public.tickets enable row level security;
create policy "user view own tickets" on public.tickets for select to authenticated
  using (auth.uid() = user_id);
create policy "user create own tickets" on public.tickets for insert to authenticated
  with check (auth.uid() = user_id);

create table public.sponsorship_proposals (
  id uuid primary key default gen_random_uuid(),
  company_user_id uuid not null references auth.users(id) on delete cascade,
  event_id uuid not null references public.events(id) on delete cascade,
  tier text not null,
  amount int not null default 0,
  message text not null default '',
  status text not null default 'pending',
  created_at timestamptz not null default now()
);
alter table public.sponsorship_proposals enable row level security;
create policy "company view own proposals" on public.sponsorship_proposals for select to authenticated
  using (auth.uid() = company_user_id);
create policy "organizer view event proposals" on public.sponsorship_proposals for select to authenticated
  using (exists (select 1 from public.events e where e.id = event_id and e.organizer_user_id = auth.uid()));
create policy "company create proposals" on public.sponsorship_proposals for insert to authenticated
  with check (auth.uid() = company_user_id);
create policy "organizer update proposal status" on public.sponsorship_proposals for update to authenticated
  using (exists (select 1 from public.events e where e.id = event_id and e.organizer_user_id = auth.uid()));

-- Seed colleges
insert into public.colleges (slug, name, domain, city, fests) values
  ('iitb','IIT Bombay','iitb.ac.in','Mumbai',4),
  ('iitd','IIT Delhi','iitd.ac.in','Delhi',3),
  ('bits','BITS Pilani','pilani.bits-pilani.ac.in','Pilani',5),
  ('nitt','NIT Trichy','nitt.edu','Trichy',3),
  ('vit','VIT Vellore','vit.ac.in','Vellore',4),
  ('du','Delhi University','du.ac.in','Delhi',6),
  ('srcc','SRCC','srcc.du.ac.in','Delhi',2),
  ('manipal','Manipal Institute','manipal.edu','Manipal',4);
