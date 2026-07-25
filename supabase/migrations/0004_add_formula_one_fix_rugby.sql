-- 1. Update sport check constraint to include formula_one
alter table products drop constraint if exists products_sport_check;
alter table products add constraint products_sport_check
  check (sport in ('football', 'rugby', 'basketball', 'cricket', 'formula_one'));

-- 2. Fix rugby products with null image_url
--    Bypass the update trigger temporarily (it guards auth users, not migrations)
alter table products disable trigger trg_enforce_product_update;

update products
set image_url = 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=600&h=600&fit=crop'
where sport = 'rugby' and (name ilike '%kenya%' or name ilike '%simbas%') and image_url is null;

update products
set image_url = 'https://r2.thesportsdb.com/images/media/team/equipment/41bbtw1762939872.png'
where sport = 'rugby' and image_url is null;

alter table products enable trigger trg_enforce_product_update;

-- 3. Seed Formula One products
do $$
declare
  p_id uuid;
begin

  insert into products (name, sport, team, description, price, image_url, is_featured, is_hidden)
  values ('Red Bull Racing Team Jersey 2024', 'formula_one', 'Red Bull Racing',
    'Official Red Bull Racing team jersey — Verstappen and Perez 2024 season.', 3200,
    'https://r2.thesportsdb.com/images/media/team/equipment/jtf07x1773231960.png', true, false)
  returning id into p_id;
  insert into product_variants (product_id, size, stock_quantity) values
    (p_id,'S',10),(p_id,'M',10),(p_id,'L',10),(p_id,'XL',10),(p_id,'XXL',10);

  insert into products (name, sport, team, description, price, image_url, is_featured, is_hidden)
  values ('Scuderia Ferrari Team Jersey 2024', 'formula_one', 'Scuderia Ferrari',
    'Official Scuderia Ferrari team jersey — iconic red, Leclerc and Sainz 2024.', 3200,
    'https://r2.thesportsdb.com/images/media/team/equipment/e2764s1773232017.png', true, false)
  returning id into p_id;
  insert into product_variants (product_id, size, stock_quantity) values
    (p_id,'S',10),(p_id,'M',10),(p_id,'L',10),(p_id,'XL',10),(p_id,'XXL',10);

  insert into products (name, sport, team, description, price, image_url, is_featured, is_hidden)
  values ('Mercedes-AMG Petronas Team Jersey 2024', 'formula_one', 'Mercedes-AMG Petronas',
    'Official Mercedes-AMG Petronas team jersey — Hamilton and Russell 2024.', 3200,
    'https://r2.thesportsdb.com/images/media/team/equipment/1x45781773231834.png', true, false)
  returning id into p_id;
  insert into product_variants (product_id, size, stock_quantity) values
    (p_id,'S',10),(p_id,'M',10),(p_id,'L',10),(p_id,'XL',10),(p_id,'XXL',10);

  insert into products (name, sport, team, description, price, image_url, is_featured, is_hidden)
  values ('McLaren F1 Team Jersey 2024', 'formula_one', 'McLaren F1 Team',
    'Official McLaren F1 team jersey — papaya orange, Norris and Piastri 2024.', 3000,
    'https://r2.thesportsdb.com/images/media/team/equipment/hq4x5r1773231742.png', true, false)
  returning id into p_id;
  insert into product_variants (product_id, size, stock_quantity) values
    (p_id,'S',10),(p_id,'M',10),(p_id,'L',10),(p_id,'XL',10),(p_id,'XXL',10);

  insert into products (name, sport, team, description, price, image_url, is_featured, is_hidden)
  values ('Aston Martin F1 Team Jersey 2024', 'formula_one', 'Aston Martin F1',
    'Official Aston Martin F1 team jersey — British racing green, Alonso and Stroll 2024.', 3000,
    'https://r2.thesportsdb.com/images/media/team/equipment/sxulqm1770065120.png', false, false)
  returning id into p_id;
  insert into product_variants (product_id, size, stock_quantity) values
    (p_id,'S',10),(p_id,'M',10),(p_id,'L',10),(p_id,'XL',10),(p_id,'XXL',10);

  insert into products (name, sport, team, description, price, image_url, is_featured, is_hidden)
  values ('Alpine F1 Team Jersey 2024', 'formula_one', 'Alpine F1 Team',
    'Official Alpine F1 team jersey — Gasly and Ocon 2024 season.', 2800,
    'https://r2.thesportsdb.com/images/media/team/equipment/udfzkv1773231604.png', false, false)
  returning id into p_id;
  insert into product_variants (product_id, size, stock_quantity) values
    (p_id,'S',10),(p_id,'M',10),(p_id,'L',10),(p_id,'XL',10),(p_id,'XXL',10);

  insert into products (name, sport, team, description, price, image_url, is_featured, is_hidden)
  values ('Williams Racing Team Jersey 2024', 'formula_one', 'Williams Racing',
    'Official Williams Racing team jersey — Albon and Sargeant 2024 season.', 2800,
    'https://r2.thesportsdb.com/images/media/team/equipment/kzudse1773232145.png', false, false)
  returning id into p_id;
  insert into product_variants (product_id, size, stock_quantity) values
    (p_id,'S',10),(p_id,'M',10),(p_id,'L',10),(p_id,'XL',10),(p_id,'XXL',10);

  insert into products (name, sport, team, description, price, image_url, is_featured, is_hidden)
  values ('Haas F1 Team Jersey 2024', 'formula_one', 'Haas F1 Team',
    'Official Haas F1 team jersey — Hulkenberg and Magnussen 2024 season.', 2800,
    'https://r2.thesportsdb.com/images/media/team/equipment/0pt0z71772461085.png', false, false)
  returning id into p_id;
  insert into product_variants (product_id, size, stock_quantity) values
    (p_id,'S',10),(p_id,'M',10),(p_id,'L',10),(p_id,'XL',10),(p_id,'XXL',10);

  insert into products (name, sport, team, description, price, image_url, is_featured, is_hidden)
  values ('Visa Cash App RB Team Jersey 2024', 'formula_one', 'Visa Cash App RB',
    'Official Visa Cash App RB (VCARB) team jersey — Ricciardo and Tsunoda 2024.', 2800,
    'https://r2.thesportsdb.com/images/media/team/equipment/xhh9mc1773232085.png', false, false)
  returning id into p_id;
  insert into product_variants (product_id, size, stock_quantity) values
    (p_id,'S',10),(p_id,'M',10),(p_id,'L',10),(p_id,'XL',10),(p_id,'XXL',10);

  insert into products (name, sport, team, description, price, image_url, is_featured, is_hidden)
  values ('Kick Sauber Team Jersey 2024', 'formula_one', 'Kick Sauber',
    'Official Kick Sauber team jersey — Bottas and Zhou 2024 season.', 2800,
    'https://r2.thesportsdb.com/images/media/team/equipment/ckb4zs1773231544.png', false, false)
  returning id into p_id;
  insert into product_variants (product_id, size, stock_quantity) values
    (p_id,'S',10),(p_id,'M',10),(p_id,'L',10),(p_id,'XL',10),(p_id,'XXL',10);

end $$;
