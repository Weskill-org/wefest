-- Phase 10: Go-To-Market & Ecosystem Finalization

-- 1. Testimonials Table
create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text not null, -- e.g., "Cultural Secretary", "Brand Manager"
  organization text not null, -- College name or Brand name
  content text not null,
  avatar_url text,
  rating int default 5,
  is_featured boolean default true,
  created_at timestamptz not null default now()
);

alter table public.testimonials enable row level security;
create policy "anyone can view featured testimonials" on public.testimonials for select using (is_featured = true);
create policy "admins can manage testimonials" on public.testimonials for all to authenticated
  using (exists (select 1 from public.admin_users where user_id = auth.uid()));

-- 2. Partner Brands Table (for "Target sponsor brands" task)
create table if not exists public.partner_brands (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  logo_url text,
  website_url text,
  industry text,
  is_active boolean default true,
  created_at timestamptz not null default now()
);

alter table public.partner_brands enable row level security;
create policy "anyone can view partner brands" on public.partner_brands for select using (is_active = true);
create policy "admins can manage partner brands" on public.partner_brands for all to authenticated
  using (exists (select 1 from public.admin_users where user_id = auth.uid()));

-- Insert some sample data for Phase 10 GTM showcase
insert into public.testimonials (name, role, organization, content, rating)
values 
('Arjun Mehta', 'Fest Coordinator', 'IIT Bombay', 'WeFest transformed Mood Indigo. Handling 100k+ registrations without a single server hiccup was a dream come true.', 5),
('Sara Khan', 'Marketing Head', 'Red Bull India', 'The real-time ROI tracking and verified student leads make WeFest our go-to for campus activations.', 5),
('Dr. Ramesh Iyer', 'Dean of Student Affairs', 'BITS Pilani', 'Digital transparency in budgeting and sponsorship is exactly what college administrations needed.', 5);

insert into public.partner_brands (name, industry)
values 
('Red Bull', 'Beverages'),
('Adobe', 'Software'),
('Reliance Jio', 'Telecommunications'),
('Zomato', 'FoodTech'),
('OnePlus', 'Electronics');
