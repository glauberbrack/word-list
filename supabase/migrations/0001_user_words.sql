create table public.favorites (
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  word text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null,
  deleted boolean not null default false,
  primary key (user_id, word)
);

create table public.history (
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  word text not null,
  viewed_at timestamptz not null,
  primary key (user_id, word)
);

alter table public.favorites enable row level security;
alter table public.history enable row level security;

create policy "favorites are private to their owner"
  on public.favorites for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "history is private to its owner"
  on public.history for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
