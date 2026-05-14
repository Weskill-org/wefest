-- Drop old restrictive policies
drop policy if exists "organizer view event proposals" on public.sponsorship_proposals;
drop policy if exists "organizer update proposal status" on public.sponsorship_proposals;
drop policy if exists "organizer update own events" on public.events;
drop policy if exists "organizer delete own events" on public.events;
drop policy if exists "organizers can view event proposals" on public.sponsorship_proposals;
drop policy if exists "organizers can update proposal status" on public.sponsorship_proposals;
drop policy if exists "organizers can update college events" on public.events;
drop policy if exists "organizers can delete college events" on public.events;

-- New more inclusive policies for events
create policy "organizers can update college events" on public.events
  for update to authenticated
  using (
    auth.uid() = organizer_user_id or 
    exists (
      select 1 from public.college_members cm 
      where cm.user_id = auth.uid() 
      and cm.college_id = public.events.college_id 
      and cm.is_approved = true
    )
  );

create policy "organizers can delete college events" on public.events
  for delete to authenticated
  using (
    auth.uid() = organizer_user_id or 
    exists (
      select 1 from public.college_members cm 
      where cm.user_id = auth.uid() 
      and cm.college_id = public.events.college_id 
      and cm.is_approved = true
    )
  );

-- New cleaner policies using IN clause for sponsorship_proposals
create policy "organizers can view event proposals" on public.sponsorship_proposals
  for select to authenticated
  using (
    event_id in (
      select id from public.events
      where organizer_user_id = auth.uid()
      or college_id in (
        select college_id from public.college_members
        where user_id = auth.uid() and is_approved = true
      )
    )
  );

create policy "organizers can update proposal status" on public.sponsorship_proposals
  for update to authenticated
  using (
    event_id in (
      select id from public.events
      where organizer_user_id = auth.uid()
      or college_id in (
        select college_id from public.college_members
        where user_id = auth.uid() and is_approved = true
      )
    )
  );
