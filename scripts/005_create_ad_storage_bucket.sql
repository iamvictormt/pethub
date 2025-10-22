-- Create storage bucket for advertisement images
insert into storage.buckets (id, name, public)
values ('ad-images', 'ad-images', true)
on conflict (id) do nothing;

-- Set up storage policies
create policy "Anyone can view ad images"
on storage.objects for select
using (bucket_id = 'ad-images');

create policy "Petshops can upload ad images"
on storage.objects for insert
with check (
  bucket_id = 'ad-images' 
  and auth.role() = 'authenticated'
);

create policy "Petshops can update their own ad images"
on storage.objects for update
using (
  bucket_id = 'ad-images' 
  and auth.uid()::text = (storage.foldername(name))[1]
);

create policy "Petshops can delete their own ad images"
on storage.objects for delete
using (
  bucket_id = 'ad-images' 
  and auth.uid()::text = (storage.foldername(name))[1]
);
