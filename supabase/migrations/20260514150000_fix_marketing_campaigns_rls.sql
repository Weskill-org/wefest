-- Drop old restrictive policy
drop policy if exists "admins and college owners can manage marketing" on public.marketing_campaigns;

-- New more inclusive policy for marketing campaigns
create policy "admins and college staff can manage marketing" on public.marketing_campaigns
  for all to authenticated
  using (
    exists (select 1 from public.admin_users where user_id = auth.uid()) 
    or exists (select 1 from public.colleges where id = college_id and (metadata->>'owner_id')::uuid = auth.uid())
    or exists (
      select 1 from public.college_members cm 
      where cm.user_id = auth.uid() 
      and cm.college_id = public.marketing_campaigns.college_id 
      and cm.is_approved = true
      and cm.role in ('admin', 'coordinator', 'ticket_poc')
    )
  );
