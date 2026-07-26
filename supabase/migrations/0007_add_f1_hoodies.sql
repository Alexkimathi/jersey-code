-- F1 team hoodies for the "Hoodies & Polos" tab
-- Identified by 'Hoodie' in the product name

do $$
declare
  p_id uuid;
begin

  insert into products (name, sport, team, description, price, image_url, is_featured, is_hidden)
  values (
    'Red Bull Racing 2025 Team Hoodie', 'formula_one', 'Red Bull Racing',
    'Official Red Bull Racing 2025 pullover hoodie — navy blue team colourway.', 3500,
    'https://www.fuelforfans.com/dw/image/v2/BDWJ_PRD/on/demandware.static/-/Sites-master-catalog/default/dw24f6f81f/images/large/701235648001_pp_01_redbull.jpg?sw=800&sh=800&sm=fit',
    false, false
  ) returning id into p_id;
  insert into product_variants (product_id, size, stock_quantity) values
    (p_id,'S',10),(p_id,'M',10),(p_id,'L',10),(p_id,'XL',10),(p_id,'XXL',10);

  insert into products (name, sport, team, description, price, image_url, is_featured, is_hidden)
  values (
    'Scuderia Ferrari PUMA 2025 Team Hoodie', 'formula_one', 'Scuderia Ferrari',
    'Official Scuderia Ferrari PUMA 2025 team hoodie — iconic red with Scuderia branding.', 3500,
    'https://www.fuelforfans.com/dw/image/v2/BDWJ_PRD/on/demandware.static/-/Sites-master-catalog/default/dw3e428080/images/large/701232805001_mp_01_pumaferrari.jpg?sw=800&sh=800&sm=fit',
    false, false
  ) returning id into p_id;
  insert into product_variants (product_id, size, stock_quantity) values
    (p_id,'S',10),(p_id,'M',10),(p_id,'L',10),(p_id,'XL',10),(p_id,'XXL',10);

  insert into products (name, sport, team, description, price, image_url, is_featured, is_hidden)
  values (
    'Mercedes-AMG Petronas Adidas 2025 Team Hoodie', 'formula_one', 'Mercedes-AMG Petronas',
    'Official Mercedes-AMG Petronas Adidas 2025 team hoodie — sleek black with teal accents.', 3500,
    'https://www.fuelforfans.com/dw/image/v2/BDWJ_PRD/on/demandware.static/-/Sites-master-catalog/default/dwce9bd31e/images/large/701237793001_mp_01_mercedes.jpg?sw=800&sh=800&sm=fit',
    false, false
  ) returning id into p_id;
  insert into product_variants (product_id, size, stock_quantity) values
    (p_id,'S',10),(p_id,'M',10),(p_id,'L',10),(p_id,'XL',10),(p_id,'XXL',10);

  insert into products (name, sport, team, description, price, image_url, is_featured, is_hidden)
  values (
    'McLaren F1 Team 2025 Team Hoodie', 'formula_one', 'McLaren F1 Team',
    'Official McLaren F1 2025 team hoodie — papaya orange, Norris and Piastri edition.', 3500,
    'https://www.fuelforfans.com/dw/image/v2/BDWJ_PRD/on/demandware.static/-/Sites-master-catalog/default/dw2f20339d/images/large/701235129001_pp_01_mclaren.jpg?sw=800&sh=800&sm=fit',
    true, false
  ) returning id into p_id;
  insert into product_variants (product_id, size, stock_quantity) values
    (p_id,'S',10),(p_id,'M',10),(p_id,'L',10),(p_id,'XL',10),(p_id,'XXL',10);

  insert into products (name, sport, team, description, price, image_url, is_featured, is_hidden)
  values (
    'Aston Martin F1 Team 2025 Team Hoodie', 'formula_one', 'Aston Martin F1',
    'Official Aston Martin F1 2025 team hoodie — British racing green with AMF1 branding.', 3500,
    'https://www.fuelforfans.com/dw/image/v2/BDWJ_PRD/on/demandware.static/-/Sites-master-catalog/default/dw5a6582d9/images/large/701233042001_mp_01_astonmartinf1.jpg?sw=800&sh=800&sm=fit',
    false, false
  ) returning id into p_id;
  insert into product_variants (product_id, size, stock_quantity) values
    (p_id,'S',10),(p_id,'M',10),(p_id,'L',10),(p_id,'XL',10),(p_id,'XXL',10);

  insert into products (name, sport, team, description, price, image_url, is_featured, is_hidden)
  values (
    'Alpine F1 Team 2025 Team Hoodie', 'formula_one', 'Alpine F1 Team',
    'Official Alpine F1 2025 team hoodie — navy blue with Alpine signature styling.', 3200,
    'https://www.fuelforfans.com/dw/image/v2/BDWJ_PRD/on/demandware.static/-/Sites-master-catalog/default/dw933b36f9/images/large/701235126001_pp_01_alpine.jpg?sw=800&sh=800&sm=fit',
    false, false
  ) returning id into p_id;
  insert into product_variants (product_id, size, stock_quantity) values
    (p_id,'S',10),(p_id,'M',10),(p_id,'L',10),(p_id,'XL',10),(p_id,'XXL',10);

  insert into products (name, sport, team, description, price, image_url, is_featured, is_hidden)
  values (
    'Williams Racing 2026 Team Hoodie', 'formula_one', 'Williams Racing',
    'Official Williams Racing 2026 team hoodie — navy blue with Williams Racing branding.', 3200,
    'https://www.fuelforfans.com/dw/image/v2/BDWJ_PRD/on/demandware.static/-/Sites-master-catalog/default/dw8299da68/images/large/701243873001_mp_01_williams.jpg?sw=800&sh=800&sm=fit',
    false, false
  ) returning id into p_id;
  insert into product_variants (product_id, size, stock_quantity) values
    (p_id,'S',10),(p_id,'M',10),(p_id,'L',10),(p_id,'XL',10),(p_id,'XXL',10);

  insert into products (name, sport, team, description, price, image_url, is_featured, is_hidden)
  values (
    'Haas F1 Team 2025 Pullover Hoodie', 'formula_one', 'Haas F1 Team',
    'Official Haas F1 Team 2025 pullover hoodie — grey marl with full front logo graphic.', 3200,
    'https://www.haasf1.shop/cdn/shop/files/TU15507-120-MNQ-1_508x508.jpg',
    false, false
  ) returning id into p_id;
  insert into product_variants (product_id, size, stock_quantity) values
    (p_id,'S',10),(p_id,'M',10),(p_id,'L',10),(p_id,'XL',10),(p_id,'XXL',10);

end $$;
