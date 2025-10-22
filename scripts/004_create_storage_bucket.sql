-- Create storage bucket for pet photos
insert into storage.buckets (id, name, public)
values ('pet-photos', 'pet-photos', true)
on conflict (id) do nothing;

-- Set up storage policies
create policy "Anyone can view pet photos"
on storage.objects for select
using (bucket_id = 'pet-photos');

create policy "Authenticated users can upload pet photos"
on storage.objects for insert
with check (
  bucket_id = 'pet-photos' 
  and auth.role() = 'authenticated'
);

create policy "Users can update their own pet photos"
on storage.objects for update
using (
  bucket_id = 'pet-photos' 
  and auth.uid()::text = (storage.foldername(name))[1]
);

create policy "Users can delete their own pet photos"
on storage.objects for delete
using (
  bucket_id = 'pet-photos' 
  and auth.uid()::text = (storage.foldername(name))[1]
);
