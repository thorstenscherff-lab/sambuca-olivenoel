create table if not exists public.highscores (
  id bigint generated always as identity primary key,
  name text not null check (char_length(name) between 1 and 24),
  wealth bigint not null check (wealth between -10000000 and 1000000000),
  years int not null check (years between 0 and 200),
  version text not null check (char_length(version) <= 16),
  created_at timestamptz not null default now()
);
alter table public.highscores enable row level security;
create policy "public read" on public.highscores for select to anon using (true);
create policy "public insert" on public.highscores for insert to anon with check (true);
create index if not exists highscores_wealth_idx on public.highscores (wealth desc);
