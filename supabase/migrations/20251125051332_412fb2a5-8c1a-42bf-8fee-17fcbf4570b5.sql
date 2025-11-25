-- Critical Security Fix: Prevent privilege escalation on user_roles table
-- No one should be able to insert, update, or delete roles directly
-- Roles are only assigned through the handle_new_user() trigger

create policy "No one can insert roles"
  on public.user_roles for insert
  with check (false);

create policy "No one can update roles"
  on public.user_roles for update
  using (false);

create policy "No one can delete roles"
  on public.user_roles for delete
  using (false);

-- Add defense-in-depth for profiles table
create policy "Block anonymous profile access"
  on public.profiles for select
  to anon
  using (false);

create policy "Admins can view all profiles"
  on public.profiles for select
  using (public.has_role(auth.uid(), 'admin'));