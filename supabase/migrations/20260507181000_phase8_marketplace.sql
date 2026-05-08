-- Phase 8: Marketplace & Ecosystem Expansion

-- 1. Merchandise Products
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  event_id uuid references public.events(id) on delete cascade,
  name text not null,
  description text,
  price int not null, -- in cents (or paise for INR)
  image_url text,
  stock int not null default 0,
  created_at timestamptz not null default now()
);

alter table public.products enable row level security;
create policy "anyone can view products" on public.products for select using (true);
create policy "organizers can manage their products" on public.products for all to authenticated
  using (exists (select 1 from public.events e where e.id = event_id and e.organizer_user_id = auth.uid()));

-- 2. Merchandise Orders
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  quantity int not null default 1,
  total_amount int not null,
  status text not null default 'pending', -- pending, completed, cancelled
  shipping_address text,
  created_at timestamptz not null default now()
);

alter table public.orders enable row level security;
create policy "users can view own orders" on public.orders for select to authenticated
  using (auth.uid() = user_id);
create policy "organizers can view orders for their products" on public.orders for select to authenticated
  using (exists (
    select 1 from public.products p 
    join public.events e on e.id = p.event_id 
    where p.id = product_id and e.organizer_user_id = auth.uid()
  ));
create policy "users can create orders" on public.orders for insert to authenticated
  with check (auth.uid() = user_id);

-- 3. Campus Ambassador Programs
create table if not exists public.ambassador_programs (
  id uuid primary key default gen_random_uuid(),
  event_id uuid references public.events(id) on delete cascade,
  title text not null,
  description text,
  perks text[],
  requirements text,
  status text not null default 'active',
  created_at timestamptz not null default now()
);

alter table public.ambassador_programs enable row level security;
create policy "anyone can view programs" on public.ambassador_programs for select using (true);
create policy "organizers can manage programs" on public.ambassador_programs for all to authenticated
  using (exists (select 1 from public.events e where e.id = event_id and e.organizer_user_id = auth.uid()));

-- 4. Ambassador Applications
create table if not exists public.ambassador_applications (
  id uuid primary key default gen_random_uuid(),
  program_id uuid references public.ambassador_programs(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  social_handle text,
  motivation text,
  status text not null default 'pending', -- pending, approved, rejected
  created_at timestamptz not null default now(),
  unique(program_id, user_id)
);

alter table public.ambassador_applications enable row level security;
create policy "users can view own applications" on public.ambassador_applications for select to authenticated
  using (auth.uid() = user_id);
create policy "organizers can view applications for their programs" on public.ambassador_applications for select to authenticated
  using (exists (
    select 1 from public.ambassador_programs p 
    join public.events e on e.id = p.event_id 
    where p.id = program_id and e.organizer_user_id = auth.uid()
  ));
create policy "users can apply" on public.ambassador_applications for insert to authenticated
  with check (auth.uid() = user_id);

-- 5. Artist Profiles
create table if not exists public.artist_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade unique,
  name text not null,
  genre text,
  bio text,
  portfolio_url text,
  base_price int,
  rating decimal default 0.0,
  created_at timestamptz not null default now()
);

alter table public.artist_profiles enable row level security;
create policy "anyone can view artists" on public.artist_profiles for select using (true);
create policy "artists can manage own profile" on public.artist_profiles for all to authenticated
  using (auth.uid() = user_id);

-- 6. Artist Bookings
create table if not exists public.artist_bookings (
  id uuid primary key default gen_random_uuid(),
  artist_id uuid references public.artist_profiles(id) on delete cascade,
  event_id uuid references public.events(id) on delete cascade,
  status text not null default 'requested', -- requested, accepted, rejected, completed
  offered_amount int,
  created_at timestamptz not null default now()
);

alter table public.artist_bookings enable row level security;
create policy "involved parties can view bookings" on public.artist_bookings for select to authenticated
  using (
    exists (select 1 from public.artist_profiles p where p.id = artist_id and p.user_id = auth.uid()) or
    exists (select 1 from public.events e where e.id = event_id and e.organizer_user_id = auth.uid())
  );
create policy "organizers can request bookings" on public.artist_bookings for insert to authenticated
  with check (exists (select 1 from public.events e where e.id = event_id and e.organizer_user_id = auth.uid()));
create policy "artists can update booking status" on public.artist_bookings for update to authenticated
  using (exists (select 1 from public.artist_profiles p where p.id = artist_id and p.user_id = auth.uid()));
