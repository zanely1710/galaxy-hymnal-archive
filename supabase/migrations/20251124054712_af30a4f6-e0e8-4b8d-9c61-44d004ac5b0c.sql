-- Create app_role enum for user roles
create type public.app_role as enum ('admin', 'user');

-- Create profiles table
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  name text,
  email text unique not null,
  created_at timestamp with time zone default now() not null,
  last_login timestamp with time zone default now()
);

alter table public.profiles enable row level security;

-- Profiles policies
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Create user_roles table
create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  role app_role not null,
  unique (user_id, role)
);

alter table public.user_roles enable row level security;

-- Function to check user role
create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.user_roles
    where user_id = _user_id
      and role = _role
  )
$$;

-- User roles policies
create policy "Users can view own roles"
  on public.user_roles for select
  using (auth.uid() = user_id);

-- Create categories table
create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  created_at timestamp with time zone default now() not null
);

alter table public.categories enable row level security;

-- Categories policies (public read)
create policy "Categories are viewable by everyone"
  on public.categories for select
  using (true);

create policy "Only admins can insert categories"
  on public.categories for insert
  with check (public.has_role(auth.uid(), 'admin'));

create policy "Only admins can update categories"
  on public.categories for update
  using (public.has_role(auth.uid(), 'admin'));

create policy "Only admins can delete categories"
  on public.categories for delete
  using (public.has_role(auth.uid(), 'admin'));

-- Create music_sheets table
create table public.music_sheets (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  composer text,
  category_id uuid references public.categories(id) on delete set null,
  description text,
  file_url text,
  thumbnail_url text,
  created_at timestamp with time zone default now() not null
);

alter table public.music_sheets enable row level security;

-- Music sheets policies (public read, admin write)
create policy "Music sheets are viewable by everyone"
  on public.music_sheets for select
  using (true);

create policy "Only admins can insert music sheets"
  on public.music_sheets for insert
  with check (public.has_role(auth.uid(), 'admin'));

create policy "Only admins can update music sheets"
  on public.music_sheets for update
  using (public.has_role(auth.uid(), 'admin'));

create policy "Only admins can delete music sheets"
  on public.music_sheets for delete
  using (public.has_role(auth.uid(), 'admin'));

-- Create song_requests table
create table public.song_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  message text,
  completed boolean default false not null,
  created_at timestamp with time zone default now() not null
);

alter table public.song_requests enable row level security;

-- Song requests policies
create policy "Users can view own requests"
  on public.song_requests for select
  using (auth.uid() = user_id);

create policy "Users can create own requests"
  on public.song_requests for insert
  with check (auth.uid() = user_id);

create policy "Admins can view all requests"
  on public.song_requests for select
  using (public.has_role(auth.uid(), 'admin'));

create policy "Admins can update requests"
  on public.song_requests for update
  using (public.has_role(auth.uid(), 'admin'));

create policy "Admins can delete requests"
  on public.song_requests for delete
  using (public.has_role(auth.uid(), 'admin'));

-- Create notifications table
create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  message text not null,
  read boolean default false not null,
  created_at timestamp with time zone default now() not null
);

alter table public.notifications enable row level security;

-- Notifications policies
create policy "Users can view own notifications"
  on public.notifications for select
  using (auth.uid() = user_id);

create policy "Users can update own notifications"
  on public.notifications for update
  using (auth.uid() = user_id);

create policy "Admins can create notifications"
  on public.notifications for insert
  with check (public.has_role(auth.uid(), 'admin'));

-- Function to handle new user signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, name, email)
  values (new.id, new.raw_user_meta_data->>'name', new.email);
  
  -- Assign role based on email
  if new.email = 'ejdelrosario.jhs@assumptaseminary.ph.education' or 
     new.email = 'eleandrejohn503@gmail.com' then
    insert into public.user_roles (user_id, role)
    values (new.id, 'admin');
  else
    insert into public.user_roles (user_id, role)
    values (new.id, 'user');
  end if;
  
  return new;
end;
$$;

-- Trigger for new user signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Insert default categories
insert into public.categories (name) values
  ('Mass Settings'),
  ('Hymns'),
  ('Psalms'),
  ('Latin Chants'),
  ('Contemporary'),
  ('Traditional');