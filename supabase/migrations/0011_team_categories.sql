-- Team lists table — replaces the hard-coded EPL_TEAMS and NATIONAL_TEAMS arrays.
-- Admins can manage these via the /admin/categories page.

create table if not exists team_lists (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  list_type text not null check (list_type in ('epl', 'national', 'other')),
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  unique (name, list_type)
);

alter table team_lists enable row level security;

-- Public read (product listing pages filter by team list)
drop policy if exists "public reads team lists" on team_lists;
create policy "public reads team lists" on team_lists
  for select using (true);

-- Any admin can manage
drop policy if exists "admins manage team lists" on team_lists;
create policy "admins manage team lists" on team_lists
  for all using (is_admin()) with check (is_admin());

-- Seed with existing data from categories.ts and epl/page.tsx
insert into team_lists (name, list_type, sort_order) values
  ('Manchester United',        'epl', 1),
  ('Arsenal',                  'epl', 2),
  ('Liverpool',                'epl', 3),
  ('Chelsea',                  'epl', 4),
  ('Manchester City',          'epl', 5),
  ('Tottenham Hotspur',        'epl', 6),
  ('Newcastle United',         'epl', 7),
  ('West Ham United',          'epl', 8),
  ('Aston Villa',              'epl', 9),
  ('Brighton & Hove Albion',   'epl', 10),
  ('Fulham',                   'epl', 11),
  ('Brentford',                'epl', 12),
  ('Crystal Palace',           'epl', 13),
  ('Wolverhampton Wanderers',  'epl', 14),
  ('Nottingham Forest',        'epl', 15),
  ('Bournemouth',              'epl', 16),
  ('Everton',                  'epl', 17),
  ('Leicester City',           'epl', 18),
  ('Ipswich Town',             'epl', 19),
  ('Southampton',              'epl', 20),
  ('Argentina',                'national', 1),
  ('Brazil',                   'national', 2),
  ('Harambee Stars',           'national', 3)
on conflict (name, list_type) do nothing;
