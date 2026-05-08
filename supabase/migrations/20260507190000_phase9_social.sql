-- Phase 9: Social & Community Expansion

-- 1. Student Social Profiles
create table if not exists public.student_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  bio text,
  interests text[],
  college_id uuid references public.colleges(id),
  is_public boolean default true,
  created_at timestamptz not null default now()
);

alter table public.student_profiles enable row level security;
create policy "anyone can view public profiles" on public.student_profiles for select using (true);
create policy "users can update own profile" on public.student_profiles for update to authenticated using (auth.uid() = id);
create policy "users can insert own profile" on public.student_profiles for insert to authenticated with check (auth.uid() = id);

-- 2. Follows (Networking)
create table if not exists public.follows (
  follower_id uuid references auth.users(id) on delete cascade,
  following_id uuid references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (follower_id, following_id)
);

alter table public.follows enable row level security;
create policy "anyone can view follows" on public.follows for select using (true);
create policy "users can follow others" on public.follows for insert to authenticated with check (auth.uid() = follower_id);
create policy "users can unfollow others" on public.follows for delete to authenticated using (auth.uid() = follower_id);

-- 3. Event Chat Messages
create table if not exists public.event_chat_messages (
  id uuid primary key default gen_random_uuid(),
  event_id uuid references public.events(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  message text not null,
  created_at timestamptz not null default now()
);

alter table public.event_chat_messages enable row level security;
create policy "participants can view event chat" on public.event_chat_messages for select to authenticated
  using (exists (select 1 from public.tickets t where t.event_id = event_id and t.user_id = auth.uid()));
create policy "participants can send messages" on public.event_chat_messages for insert to authenticated
  with check (exists (select 1 from public.tickets t where t.event_id = event_id and t.user_id = auth.uid()));

-- 4. Live Competition Voting
create table if not exists public.competition_votes (
  id uuid primary key default gen_random_uuid(),
  event_id uuid references public.events(id) on delete cascade,
  candidate_name text not null,
  voter_id uuid references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique(event_id, voter_id)
);

alter table public.competition_votes enable row level security;
create policy "anyone can view vote counts" on public.competition_votes for select using (true);
create policy "ticket holders can vote" on public.competition_votes for insert to authenticated
  with check (exists (select 1 from public.tickets t where t.event_id = event_id and t.user_id = auth.uid()));

-- 5. Digital Memories (NFT-style)
create table if not exists public.digital_memories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  event_id uuid references public.events(id) on delete cascade,
  metadata jsonb not null,
  minted_at timestamptz not null default now(),
  unique(user_id, event_id)
);

alter table public.digital_memories enable row level security;
create policy "users can view own memories" on public.digital_memories for select to authenticated using (auth.uid() = user_id);
create policy "anyone can view public memories" on public.digital_memories for select using (true);
create policy "users can mint memory" on public.digital_memories for insert to authenticated 
  with check (auth.uid() = user_id and exists (select 1 from public.tickets t where t.event_id = event_id and t.user_id = auth.uid()));
