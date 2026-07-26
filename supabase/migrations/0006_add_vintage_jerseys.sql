-- Vintage football jerseys
-- Identified by 'Vintage' in the product name

do $$
declare
  p_id uuid;
begin

  -- ── VINTAGE JERSEYS (EPL clubs) ──────────────────────────────

  insert into products (name, sport, team, description, price, image_url, is_featured, is_hidden)
  values (
    'Manchester United 1992-94 Home Shirt (Vintage)', 'football', 'Manchester United',
    'Iconic Sharp-sponsored Umbro home shirt from the 1992–94 era — the classic lace-up collar.', 2800,
    'https://casualfootballshirts.co.uk/cdn/shop/files/4D901B80-A5CE-4BCE-8B32-B8741D1270C2.jpg?v=1738852199',
    false, false
  ) returning id into p_id;
  insert into product_variants (product_id, size, stock_quantity) values
    (p_id,'S',10),(p_id,'M',10),(p_id,'L',10),(p_id,'XL',10),(p_id,'XXL',10);

  insert into products (name, sport, team, description, price, image_url, is_featured, is_hidden)
  values (
    'Arsenal 1991-93 Away Bruised Banana (Vintage)', 'football', 'Arsenal',
    'The legendary Adidas yellow-and-black "Bruised Banana" away shirt from the 1991–93 season.', 2800,
    'https://www.kickoffshopper.com/wp-content/uploads/2023/09/1991-1993-Arsenal-Away-Yellow-Retro-Jersey-Shirt.jpg',
    false, false
  ) returning id into p_id;
  insert into product_variants (product_id, size, stock_quantity) values
    (p_id,'S',10),(p_id,'M',10),(p_id,'L',10),(p_id,'XL',10),(p_id,'XXL',10);

  insert into products (name, sport, team, description, price, image_url, is_featured, is_hidden)
  values (
    'Liverpool 1989-91 Home Candy Shirt (Vintage)', 'football', 'Liverpool',
    'Classic Umbro red home shirt with the iconic Candy sponsor from the 1989–91 season.', 2800,
    'https://www.kickoffshopper.com/wp-content/uploads/2023/09/1989-1991-Liverpool-Home-Candy-Retro-Jersey.jpg',
    false, false
  ) returning id into p_id;
  insert into product_variants (product_id, size, stock_quantity) values
    (p_id,'S',10),(p_id,'M',10),(p_id,'L',10),(p_id,'XL',10),(p_id,'XXL',10);

  insert into products (name, sport, team, description, price, image_url, is_featured, is_hidden)
  values (
    'Chelsea 1995-97 Away Yellow (Vintage)', 'football', 'Chelsea',
    'The striking Umbro yellow away shirt with Coors sponsor from Chelsea''s 1995–97 kit.', 2500,
    'https://www.myretrojersey.com/wp-content/uploads/2022/09/chelsea-1995-97-1-1000x1000-1.jpg',
    false, false
  ) returning id into p_id;
  insert into product_variants (product_id, size, stock_quantity) values
    (p_id,'S',10),(p_id,'M',10),(p_id,'L',10),(p_id,'XL',10),(p_id,'XXL',10);

  -- ── VINTAGE JERSEYS (Other clubs) ────────────────────────────

  insert into products (name, sport, team, description, price, image_url, is_featured, is_hidden)
  values (
    'Barcelona 1992-95 Dream Team Home Shirt (Vintage)', 'football', 'Barcelona',
    'Kappa home shirt from Barça''s Dream Team era — Romario, Stoichkov, Guardiola.', 2800,
    'https://www.myretrojersey.com/wp-content/uploads/2022/09/a_19_e4c3fc22-30fe-4277-8017-af7327b33adc.jpg',
    false, false
  ) returning id into p_id;
  insert into product_variants (product_id, size, stock_quantity) values
    (p_id,'S',10),(p_id,'M',10),(p_id,'L',10),(p_id,'XL',10),(p_id,'XXL',10);

  insert into products (name, sport, team, description, price, image_url, is_featured, is_hidden)
  values (
    'Real Madrid 1993-94 Home Classic (Vintage)', 'football', 'Real Madrid',
    'Adidas all-white classic with Teka sponsor — the iconic 1993–94 Real Madrid kit.', 2800,
    'https://fiveofcupsofficial.com/cdn/shop/files/7edcfcc1-9a9ba4_dafae670164b4da897d74495d1f1ca2e_mv2.jpg?v=1745984721',
    false, false
  ) returning id into p_id;
  insert into product_variants (product_id, size, stock_quantity) values
    (p_id,'S',10),(p_id,'M',10),(p_id,'L',10),(p_id,'XL',10),(p_id,'XXL',10);

end $$;
