-- Create storage bucket for music sheets
insert into storage.buckets (id, name, public)
values ('music-sheets', 'music-sheets', true);

-- Storage policies for music sheets bucket
create policy "Anyone can view music sheets"
  on storage.objects for select
  using (bucket_id = 'music-sheets');

create policy "Admins can upload music sheets"
  on storage.objects for insert
  with check (
    bucket_id = 'music-sheets' 
    and public.has_role(auth.uid(), 'admin')
  );

create policy "Admins can update music sheets"
  on storage.objects for update
  using (
    bucket_id = 'music-sheets' 
    and public.has_role(auth.uid(), 'admin')
  );

create policy "Admins can delete music sheets"
  on storage.objects for delete
  using (
    bucket_id = 'music-sheets' 
    and public.has_role(auth.uid(), 'admin')
  );