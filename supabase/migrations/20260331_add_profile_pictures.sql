-- Create avatars bucket if it doesn't exist
insert into storage.buckets (id, name, public) 
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

-- Add INSERT policy for profiles so users can recover missing rows
create policy "Users can insert their own profile" 
on public.profiles for insert 
with check ( auth.uid() = id );



-- Storage Policies for 'avatars' Bucket

-- 1. Public Select: Anyone can view avatar images
create policy "Avatar images are publicly accessible"
on storage.objects for select
using ( bucket_id = 'avatars' );

-- 2. Public Insert: Anyone can upload (needed for users who are signing up and not yet authenticated)
create policy "Anyone can upload an avatar"
on storage.objects for insert
with check ( bucket_id = 'avatars' );

-- 3. Authenticated Update: Users can update their own avatars
create policy "Users can update their own avatars"
on storage.objects for update
using ( auth.uid() = owner )
with check ( bucket_id = 'avatars' );

-- 4. Authenticated Delete: Users can delete their own avatars
create policy "Users can delete their own avatars"
on storage.objects for delete
using ( auth.uid() = owner );

-- Recreate trigger function to capture all incoming user meta data (including phone, venmo, username, and profile picture url)
create or replace function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.profiles (
    id, 
    email, 
    first_name, 
    last_name,
    phone,
    venmo_username,
    username,
    profile_picture_url
  )
  values (
    new.id, 
    new.email, 
    new.raw_user_meta_data->>'first_name', 
    new.raw_user_meta_data->>'last_name',
    new.raw_user_meta_data->>'phone',
    new.raw_user_meta_data->>'venmo_username',
    new.raw_user_meta_data->>'username',
    new.raw_user_meta_data->>'profile_picture_url'
  );
  return new;
end;
$$ language plpgsql security definer;
