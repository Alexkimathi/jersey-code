-- 1. Extend sport constraint to include accessories
alter table products drop constraint if exists products_sport_check;
alter table products add constraint products_sport_check
  check (sport in ('football', 'rugby', 'basketball', 'cricket', 'formula_one', 'accessories'));

-- 2. Seed accessories products
--    team field is used as subcategory: 'Balls' | 'Flags' | 'Socks'
do $$
declare
  p_id uuid;
begin

  -- Balls
  insert into products (name, sport, team, description, price, image_url, is_featured, is_hidden)
  values (
    'Official Premier League Match Football', 'accessories', 'Balls',
    'Official size 5 Premier League match football — professional grade, suitable for all surfaces.',
    2500,
    'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=600&h=600&fit=crop',
    true, false
  ) returning id into p_id;
  insert into product_variants (product_id, size, stock_quantity)
  values (p_id, 'Size 5', 20);

  insert into products (name, sport, team, description, price, image_url, is_featured, is_hidden)
  values (
    'Gilbert Rugby Union Match Ball', 'accessories', 'Balls',
    'Official Gilbert rugby union match ball — size 5, approved for club and international play.',
    2800,
    'https://images.unsplash.com/photo-1544919982-b61976f0ba43?w=600&h=600&fit=crop',
    false, false
  ) returning id into p_id;
  insert into product_variants (product_id, size, stock_quantity)
  values (p_id, 'Size 5', 20);

  -- Flags
  insert into products (name, sport, team, description, price, image_url, is_featured, is_hidden)
  values (
    'Arsenal FC Supporter Flag', 'accessories', 'Flags',
    'Official Arsenal FC supporter flag — 90cm × 60cm, vibrant colours, double-stitched edges.',
    800,
    'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&h=600&fit=crop',
    false, false
  ) returning id into p_id;

  insert into products (name, sport, team, description, price, image_url, is_featured, is_hidden)
  values (
    'Manchester United Supporter Flag', 'accessories', 'Flags',
    'Official Manchester United supporter flag — 90cm × 60cm, perfect for match days.',
    800,
    'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&h=600&fit=crop',
    false, false
  ) returning id into p_id;

  insert into products (name, sport, team, description, price, image_url, is_featured, is_hidden)
  values (
    'Kenya Simbas Rugby Flag', 'accessories', 'Flags',
    'Kenya Simbas rugby supporter flag — show your pride at every match.',
    800,
    'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&h=600&fit=crop',
    false, false
  ) returning id into p_id;

  -- Socks
  insert into products (name, sport, team, description, price, image_url, is_featured, is_hidden)
  values (
    'Nike Football Crew Socks', 'accessories', 'Socks',
    'Nike Dri-FIT football crew socks — moisture-wicking, cushioned sole, one size fits most.',
    500,
    'https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?w=600&h=600&fit=crop',
    false, false
  ) returning id into p_id;

  insert into products (name, sport, team, description, price, image_url, is_featured, is_hidden)
  values (
    'Adidas Rugby Grip Socks', 'accessories', 'Socks',
    'Adidas rugby grip socks with non-slip sole — designed for performance on the pitch.',
    550,
    'https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?w=600&h=600&fit=crop',
    false, false
  ) returning id into p_id;

end $$;
