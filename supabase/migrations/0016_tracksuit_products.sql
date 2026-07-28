-- Tracksuit products for World Football section

do $$
declare
  p_id uuid;
begin

  -- Barcelona Tracksuit
  insert into products (name, sport, team, description, price, image_url, is_featured, is_hidden)
  values (
    'Barcelona Training Tracksuit 2024/25', 'football', 'Barcelona',
    'Nike Dri-FIT Strike full-zip training tracksuit in signature Blaugrana black — breathable fabric built for pre-match warmups and training sessions.',
    5500,
    'https://cdn.kickitshirts.com/2024/10/Barcelona-Black-Tracksuit-202425-Full-Sleeves-Full-Zip-2.webp',
    false, false
  ) returning id into p_id;
  insert into product_variants (product_id, size, stock_quantity) values
    (p_id,'S',8),(p_id,'M',12),(p_id,'L',10),(p_id,'XL',8),(p_id,'XXL',5);

  -- Real Madrid Tracksuit
  insert into products (name, sport, team, description, price, image_url, is_featured, is_hidden)
  values (
    'Real Madrid Presentation Tracksuit 2024/25', 'football', 'Real Madrid',
    'Adidas presentation tracksuit worn by Los Blancos — sleek all-white design with club crest embroidery and performance stretch fabric.',
    5800,
    'https://cdn.kickitshirts.com/2025/03/Real-Madrid-Tracksuit-202425-1.webp',
    false, false
  ) returning id into p_id;
  insert into product_variants (product_id, size, stock_quantity) values
    (p_id,'S',8),(p_id,'M',12),(p_id,'L',10),(p_id,'XL',8),(p_id,'XXL',5);

  -- Bayern Munich Tracksuit
  insert into products (name, sport, team, description, price, image_url, is_featured, is_hidden)
  values (
    'Bayern Munich Training Tracksuit 2024/25', 'football', 'Bayern Munich',
    'Adidas technical training tracksuit in white — full-zip jacket and tapered pants with Bayern Munich badge and moisture-wicking Climalite fabric.',
    5600,
    'https://cdn.kickitshirts.com/2024/10/Bayern-Munich-White-Tracksuit-202425-Full-Sleeves-1.webp',
    false, false
  ) returning id into p_id;
  insert into product_variants (product_id, size, stock_quantity) values
    (p_id,'S',8),(p_id,'M',12),(p_id,'L',10),(p_id,'XL',8),(p_id,'XXL',5);

  -- Borussia Dortmund Tracksuit
  insert into products (name, sport, team, description, price, image_url, is_featured, is_hidden)
  values (
    'Borussia Dortmund Casual Tracksuit 2024/25', 'football', 'Borussia Dortmund',
    'Puma casual presentation sweat tracksuit — iconic black and yellow colourway with embroidered BVB crest and comfortable cotton-blend fabric.',
    5400,
    'https://www.sportingplus.net/17142/borussia-dortmund-casual-presentation-sweat-tracksuit-202425-puma.jpg',
    false, false
  ) returning id into p_id;
  insert into product_variants (product_id, size, stock_quantity) values
    (p_id,'S',8),(p_id,'M',12),(p_id,'L',10),(p_id,'XL',8),(p_id,'XXL',5);

  -- Juventus Tracksuit
  insert into products (name, sport, team, description, price, image_url, is_featured, is_hidden)
  values (
    'Juventus Training Tracksuit 2024/25', 'football', 'Juventus',
    'Adidas Bench Warm training tracksuit in all-white with black Juventus club crest — full-zip design with slim-fit tapered pants.',
    5600,
    'https://cdn.kickitshirts.com/2024/10/Juventus-White-Tracksuit-202425-Full-Sleeves-Full-Zip.webp',
    false, false
  ) returning id into p_id;
  insert into product_variants (product_id, size, stock_quantity) values
    (p_id,'S',8),(p_id,'M',12),(p_id,'L',10),(p_id,'XL',8),(p_id,'XXL',5);

  -- AC Milan Tracksuit
  insert into products (name, sport, team, description, price, image_url, is_featured, is_hidden)
  values (
    'AC Milan Poly Tracksuit 2024/25', 'football', 'AC Milan',
    'Puma all-black poly tracksuit with AC Milan badge — lightweight performance fabric ideal for training and travel.',
    5500,
    'https://calcioitalia.com/media/image/1c/62/6d1452ff6bccfaa088a906414b76.jpeg',
    false, false
  ) returning id into p_id;
  insert into product_variants (product_id, size, stock_quantity) values
    (p_id,'S',8),(p_id,'M',12),(p_id,'L',10),(p_id,'XL',8),(p_id,'XXL',5);

  -- Inter Milan Tracksuit
  insert into products (name, sport, team, description, price, image_url, is_featured, is_hidden)
  values (
    'Inter Milan Training Tracksuit 2024/25', 'football', 'Inter Milan',
    'Nike grey full-zip training tracksuit — Dri-FIT fabric with Inter Milan badge, worn by the squad during warmup and travel.',
    5700,
    'https://cdn.kickitshirts.com/2024/10/Inter-Milan-Gray-Tracksuit-202425-Full-Sleeves-Full-Zip-2.webp',
    false, false
  ) returning id into p_id;
  insert into product_variants (product_id, size, stock_quantity) values
    (p_id,'S',8),(p_id,'M',12),(p_id,'L',10),(p_id,'XL',8),(p_id,'XXL',5);

  -- Napoli Tracksuit
  insert into products (name, sport, team, description, price, image_url, is_featured, is_hidden)
  values (
    'Napoli Training Tracksuit 2024/25', 'football', 'Napoli',
    'EA7 Emporio Armani navy blue full-zip tracksuit — premium cotton-blend with Napoli badge, the official club training and travel suit.',
    5800,
    'https://cdn.kickitshirts.com/2025/05/Napoli-Navy-Blue-Tracksuit-202425-Full-Sleeves-2.webp',
    false, false
  ) returning id into p_id;
  insert into product_variants (product_id, size, stock_quantity) values
    (p_id,'S',8),(p_id,'M',12),(p_id,'L',10),(p_id,'XL',8),(p_id,'XXL',5);

end $$;
