-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create enum types
create type pet_status as enum ('LOST', 'FOUND', 'REUNITED');
create type user_role as enum ('USER', 'PETSHOP');
create type pet_type as enum ('DOG', 'CAT', 'BIRD', 'OTHER');

-- Profiles table (extends auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  name text not null,
  phone text,
  role user_role not null default 'USER',
  avatar_url text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Pets table
create table if not exists public.pets (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  type pet_type not null,
  breed text,
  color text,
  age integer,
  description text,
  photo_url text,
  status pet_status not null default 'LOST',
  latitude decimal(10, 8) not null,
  longitude decimal(11, 8) not null,
  location_description text,
  contact_name text not null,
  contact_phone text not null,
  contact_email text,
  last_seen_date timestamp with time zone,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Advertisements table
create table if not exists public.advertisements (
  id uuid primary key default uuid_generate_v4(),
  petshop_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  description text,
  image_url text not null,
  link_url text,
  is_active boolean default true,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Comments table (for pet posts)
create table if not exists public.comments (
  id uuid primary key default uuid_generate_v4(),
  pet_id uuid not null references public.pets(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  content text not null,
  created_at timestamp with time zone default now()
);

-- Create indexes for better performance
create index if not exists idx_pets_status on public.pets(status);
create index if not exists idx_pets_user_id on public.pets(user_id);
create index if not exists idx_pets_location on public.pets(latitude, longitude);
create index if not exists idx_advertisements_petshop_id on public.advertisements(petshop_id);
create index if not exists idx_advertisements_is_active on public.advertisements(is_active);
create index if not exists idx_comments_pet_id on public.comments(pet_id);
