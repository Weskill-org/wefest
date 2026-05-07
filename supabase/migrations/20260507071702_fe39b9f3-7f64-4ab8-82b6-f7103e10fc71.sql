
-- Role enum
create type public.app_role as enum ('student', 'college', 'company');

-- Profiles
create table public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  email text,
  full_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Profiles viewable by authenticated"
on public.profiles for select to authenticated using (true);

create policy "Users update own profile"
on public.profiles for update to authenticated
using (auth.uid() = user_id);

create policy "Users insert own profile"
on public.profiles for insert to authenticated
with check (auth.uid() = user_id);

-- User roles
create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);

alter table public.user_roles enable row level security;

create policy "Users view own roles"
on public.user_roles for select to authenticated
using (auth.uid() = user_id);

-- has_role helper
create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean
language sql stable security definer
set search_path = public
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = _user_id and role = _role
  )
$$;

-- updated_at trigger
create or replace function public.update_updated_at_column()
returns trigger language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger trg_profiles_updated_at
before update on public.profiles
for each row execute function public.update_updated_at_column();

-- Auto-create profile + role on signup using metadata
create or replace function public.handle_new_user()
returns trigger language plpgsql
security definer set search_path = public
as $$
declare
  _role public.app_role;
  _role_text text;
begin
  insert into public.profiles (user_id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', '')
  );

  _role_text := coalesce(new.raw_user_meta_data->>'role', 'student');
  if _role_text not in ('student','college','company') then
    _role_text := 'student';
  end if;
  _role := _role_text::public.app_role;

  insert into public.user_roles (user_id, role) values (new.id, _role)
  on conflict do nothing;

  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();
