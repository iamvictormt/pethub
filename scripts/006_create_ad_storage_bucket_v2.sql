-- Create storage bucket for advertisement images
insert into storage.buckets (id, name, public)
values ('ad-images', 'ad-images', true)
on conflict (id) do nothing;

-- Set up storage policies for ad images
drop policy if exists "Anyone can view ad images" on storage.objects;
drop policy if exists "Petshops can upload ad images" on storage.objects;
drop policy if exists "Petshops can update their own ad images" on storage.objects;
drop policy if exists "Petshops can delete their own ad images" on storage.objects;

create policy "Anyone can view ad images"
on storage.objects for select
using (bucket_id = 'ad-images');

create policy "Authenticated users can upload ad images"
on storage.objects for insert
with check (
  bucket_id = 'ad-images' 
  and auth.role() = 'authenticated'
);

create policy "Users can update their own ad images"
on storage.objects for update
using (
  bucket_id = 'ad-images' 
  and auth.uid() is not null
);

create policy "Users can delete their own ad images"
on storage.objects for delete
using (
  bucket_id = 'ad-images' 
  and auth.uid() is not null
);
