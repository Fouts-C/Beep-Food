-- Create active_drivers table
create table public.active_drivers (
  driver_id uuid references public.profiles(id) on delete cascade primary key,
  car text not null,
  capacity integer not null default 1,
  singles_rate numeric not null default 0,
  group_rate numeric not null default 0,
  is_active boolean not null default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table public.active_drivers enable row level security;

-- Create policies

-- 1. Anyone can view active drivers
create policy "Anyone can view active drivers" 
  on public.active_drivers for select 
  using (true);

-- 2. Users can insert their own active driver status
create policy "Users can insert their own driver status" 
  on public.active_drivers for insert 
  with check (auth.uid() = driver_id);

-- 3. Users can update their own active driver status
create policy "Users can update their own driver status" 
  on public.active_drivers for update 
  using (auth.uid() = driver_id);

-- Add to real-time publication
begin;
  -- remove the publication if you want to drop it, but typically we just add the table
  -- supabase_realtime is a built-in publication that supabase uses for realtime updates
  drop publication if exists supabase_realtime;
  create publication supabase_realtime;
commit;

-- add table to realtime
alter publication supabase_realtime add table public.active_drivers;
