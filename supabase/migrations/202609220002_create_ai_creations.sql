create table if not exists public.ai_creations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  prompt text not null,
  type text not null check (type in ('script', 'image', 'video')),
  url text not null,
  created_at timestamptz not null default now()
);

alter table public.ai_creations enable row level security;

drop policy if exists "Users read own AI creations" on public.ai_creations;
create policy "Users read own AI creations" on public.ai_creations
  for select using (auth.uid() = user_id);

drop policy if exists "Users save own AI creations" on public.ai_creations;
create policy "Users save own AI creations" on public.ai_creations
  for insert with check (auth.uid() = user_id);

drop policy if exists "Users delete own AI creations" on public.ai_creations;
create policy "Users delete own AI creations" on public.ai_creations
  for delete using (auth.uid() = user_id);

drop policy if exists "Users upload generated videos" on storage.objects;
create policy "Users upload generated videos" on storage.objects
  for insert with check (
    bucket_id = 'media'
    and (storage.foldername(name))[1] = 'generated'
    and (storage.foldername(name))[2] = auth.uid()::text
  );

drop policy if exists "Users read generated videos" on storage.objects;
create policy "Users read generated videos" on storage.objects
  for select using (
    bucket_id = 'media'
    and (storage.foldername(name))[1] = 'generated'
    and (storage.foldername(name))[2] = auth.uid()::text
  );
