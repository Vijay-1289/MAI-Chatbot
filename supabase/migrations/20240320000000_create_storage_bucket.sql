
-- Create a new storage bucket for file uploads
insert into storage.buckets (id, name, public)
values ('uploads', 'uploads', true);

-- Create very permissive policies for the uploads bucket
create policy "Allow public uploads"
on storage.objects for insert
with check (bucket_id = 'uploads');

create policy "Allow public downloads"
on storage.objects for select
using (bucket_id = 'uploads');
