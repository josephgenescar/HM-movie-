create table if not exists public.media_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  type text not null check (type in ('movie', 'series')),
  description text not null default '',
  genre text not null default '',
  year integer,
  duration text not null default '',
  poster_url text,
  video_url text,
  trailer_url text,
  premium boolean not null default false,
  status text not null default 'draft' check (status in ('draft', 'published')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists media_items_type_status_idx on public.media_items(type, status);

alter table public.media_items enable row level security;

drop policy if exists "Published media is public" on public.media_items;
create policy "Published media is public"
  on public.media_items for select
  using (status = 'published');

drop policy if exists "Admins manage media" on public.media_items;
create policy "Admins manage media"
  on public.media_items for all
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do update set public = true;

drop policy if exists "Public media files are readable" on storage.objects;
create policy "Public media files are readable"
  on storage.objects for select
  using (bucket_id = 'media');

drop policy if exists "Admins upload media files" on storage.objects;
create policy "Admins upload media files"
  on storage.objects for insert
  with check (bucket_id = 'media' and (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

drop policy if exists "Admins update media files" on storage.objects;
create policy "Admins update media files"
  on storage.objects for update
  using (bucket_id = 'media' and (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

drop policy if exists "Admins delete media files" on storage.objects;
create policy "Admins delete media files"
  on storage.objects for delete
  using (bucket_id = 'media' and (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
