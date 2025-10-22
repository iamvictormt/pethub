-- Enable Row Level Security on all tables
alter table public.profiles enable row level security;
alter table public.pets enable row level security;
alter table public.advertisements enable row level security;
alter table public.comments enable row level security;

-- Profiles policies
create policy "Public profiles are viewable by everyone"
  on public.profiles for select
  using (true);

create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Pets policies
create policy "Pets are viewable by everyone"
  on public.pets for select
  using (true);

create policy "Users can insert their own pets"
  on public.pets for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own pets"
  on public.pets for update
  using (auth.uid() = user_id);

create policy "Users can delete their own pets"
  on public.pets for delete
  using (auth.uid() = user_id);

-- Advertisements policies
create policy "Active advertisements are viewable by everyone"
  on public.advertisements for select
  using (is_active = true);

create policy "Petshops can insert their own advertisements"
  on public.advertisements for insert
  with check (auth.uid() = petshop_id);

create policy "Petshops can update their own advertisements"
  on public.advertisements for update
  using (auth.uid() = petshop_id);

create policy "Petshops can delete their own advertisements"
  on public.advertisements for delete
  using (auth.uid() = petshop_id);

-- Comments policies
create policy "Comments are viewable by everyone"
  on public.comments for select
  using (true);

create policy "Authenticated users can insert comments"
  on public.comments for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own comments"
  on public.comments for update
  using (auth.uid() = user_id);

create policy "Users can delete their own comments"
  on public.comments for delete
  using (auth.uid() = user_id);
