-- Migration 0018: Back-fill sub_category for all products so team field
-- is no longer needed for storefront routing.

alter table products disable trigger trg_enforce_product_update;

-- ── Football: National teams (appear on both EPL and World Football pages) ──
update products
set sub_category = 'national'
where sport = 'football'
  and team in ('Argentina', 'Brazil', 'Harambee Stars');

-- ── Football: EPL teams ─────────────────────────────────────────────────────
update products
set sub_category = case
  when lower(name) like '%kids%'
    or lower(name) like '%youth%'
    or lower(name) like '%junior%'    then 'epl_kids'
  when lower(name) like '%vintage%'   then 'epl_vintage'
  when lower(name) like '%special%'
    or lower(name) like '%limited%'
    or lower(name) like '%edition%'   then 'epl_special'
  else                                     'epl_club'
end
where sport = 'football'
  and sub_category is distinct from 'national'
  and team in (
    'Manchester United','Arsenal','Liverpool','Chelsea','Manchester City',
    'Tottenham Hotspur','Newcastle United','West Ham United','Aston Villa',
    'Brighton & Hove Albion','Fulham','Brentford','Crystal Palace',
    'Wolverhampton Wanderers','Nottingham Forest','Bournemouth',
    'Everton','Leicester City','Ipswich Town','Southampton'
  );

-- ── Football: World Football club teams ────────────────────────────────────
update products
set sub_category = case
  when lower(name) like '%kids%'
    or lower(name) like '%youth%'
    or lower(name) like '%junior%'    then 'world_kids'
  when lower(name) like '%vintage%'   then 'world_vintage'
  when lower(name) like '%tracksuit%' then 'world_tracksuit'
  when lower(name) like '%special%'
    or lower(name) like '%limited%'
    or lower(name) like '%edition%'   then 'world_special'
  when is_clearance = true            then 'world_clearance'
  else                                     'world_club'
end
where sport = 'football'
  and sub_category is distinct from 'national'
  and team in (
    'Barcelona','Real Madrid','Bayern Munich','Borussia Dortmund',
    'RB Leipzig','Bayer Leverkusen','Juventus','AC Milan','Inter Milan','Napoli'
  );

-- ── Football: anything else not yet categorised → world_club ───────────────
update products
set sub_category = 'world_club'
where sport = 'football'
  and (sub_category is null or sub_category = '');

-- ── Accessories: migrate team field value → sub_category ───────────────────
update products
set sub_category = team
where sport = 'accessories'
  and team in ('Balls', 'Flags', 'Socks')
  and (sub_category is null or sub_category = '');

-- ── Formula One: hoodies ───────────────────────────────────────────────────
update products
set sub_category = 'hoodie_polo'
where sport = 'formula_one'
  and lower(name) like '%hoodie%'
  and (sub_category is null or sub_category = '');

alter table products enable trigger trg_enforce_product_update;
