-- TraceMap 원격 저장소 스키마
-- Supabase 대시보드 → SQL Editor 에 붙여 넣고 한 번 실행한다.

-- ─── 여행 기록 ───────────────────────────────────────────────
create table if not exists public.trips (
  user_id        uuid        not null default auth.uid() references auth.users on delete cascade,
  id             text        not null,
  title          text        not null,
  country_code   text        not null,
  city           text,
  start_date     date        not null,
  end_date       date,
  places         jsonb       not null default '[]',
  photo_ids      text[]      not null default '{}',
  cover_photo_id text,
  story          text        not null default '',
  companions     text[]      not null default '{}',
  tags           text[]      not null default '{}',
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  -- id는 브라우저에서 만들기 때문에 사용자별로만 유일하다
  primary key (user_id, id)
);

alter table public.trips enable row level security;

drop policy if exists "본인 기록만" on public.trips;
create policy "본인 기록만" on public.trips
  for all to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- ─── 사진 (Storage) ─────────────────────────────────────────
-- 경로: {user_id}/{photo_id}.jpg
insert into storage.buckets (id, name, public)
values ('photos', 'photos', false)
on conflict (id) do nothing;

drop policy if exists "본인 사진만" on storage.objects;
create policy "본인 사진만" on storage.objects
  for all to authenticated
  using (bucket_id = 'photos' and (storage.foldername(name))[1] = auth.uid()::text)
  with check (bucket_id = 'photos' and (storage.foldername(name))[1] = auth.uid()::text);
