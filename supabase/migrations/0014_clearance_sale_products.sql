-- Clearance Sale products for World Football section
insert into products (name, sport, team, description, price, image_url, is_featured, is_hidden, is_clearance)
values
  -- Barcelona
  ('Barcelona Home Jersey 2023/24', 'football', 'Barcelona', 'Previous season home kit — classic Blaugrana stripes with moisture-wicking fabric.', 2900, null, false, false, true),
  ('Barcelona Away Jersey 2023/24', 'football', 'Barcelona', 'Previous season away kit in all-gold colourway with premium performance fit.', 2700, null, false, false, true),

  -- Real Madrid
  ('Real Madrid Home Jersey 2023/24', 'football', 'Real Madrid', 'Previous season all-white home jersey — iconic Los Blancos design.', 2900, null, false, false, true),
  ('Real Madrid Away Jersey 2023/24', 'football', 'Real Madrid', 'Previous season purple away kit with champion-grade breathable fabric.', 2700, null, false, false, true),

  -- Bayern Munich
  ('Bayern Munich Home Jersey 2022/23', 'football', 'Bayern Munich', 'Classic red and white home jersey from the 2022/23 campaign — reduced to clear.', 2800, null, false, false, true),

  -- Juventus
  ('Juventus Away Jersey 2022/23', 'football', 'Juventus', 'Light blue away kit from the 2022/23 season — limited stock remaining.', 2600, null, false, false, true),

  -- AC Milan
  ('AC Milan Away Jersey 2022/23', 'football', 'AC Milan', 'White and red away kit from the 2022/23 Serie A season — clearance price.', 2700, null, false, false, true),

  -- Inter Milan
  ('Inter Milan Third Jersey 2022/23', 'football', 'Inter Milan', 'Green third-kit from the 2022/23 season — now at clearance price.', 2600, null, false, false, true),

  -- Borussia Dortmund
  ('Borussia Dortmund Away Jersey 2022/23', 'football', 'Borussia Dortmund', 'Previous season grey away jersey — reduced to clear.', 2500, null, false, false, true),

  -- Napoli
  ('Napoli Third Jersey 2022/23', 'football', 'Napoli', 'Champions-era third kit from Napoli''s historic title season — limited stock.', 2800, null, false, false, true);

-- Add sizes for all new clearance products
insert into product_variants (product_id, size, stock_quantity)
select id, 'S',   5 from products where name = 'Barcelona Home Jersey 2023/24'
union all select id, 'M',   8 from products where name = 'Barcelona Home Jersey 2023/24'
union all select id, 'L',   6 from products where name = 'Barcelona Home Jersey 2023/24'
union all select id, 'XL',  4 from products where name = 'Barcelona Home Jersey 2023/24'

union all select id, 'S',   4 from products where name = 'Barcelona Away Jersey 2023/24'
union all select id, 'M',   7 from products where name = 'Barcelona Away Jersey 2023/24'
union all select id, 'L',   5 from products where name = 'Barcelona Away Jersey 2023/24'
union all select id, 'XL',  3 from products where name = 'Barcelona Away Jersey 2023/24'

union all select id, 'S',   5 from products where name = 'Real Madrid Home Jersey 2023/24'
union all select id, 'M',   9 from products where name = 'Real Madrid Home Jersey 2023/24'
union all select id, 'L',   7 from products where name = 'Real Madrid Home Jersey 2023/24'
union all select id, 'XL',  4 from products where name = 'Real Madrid Home Jersey 2023/24'

union all select id, 'S',   4 from products where name = 'Real Madrid Away Jersey 2023/24'
union all select id, 'M',   6 from products where name = 'Real Madrid Away Jersey 2023/24'
union all select id, 'L',   5 from products where name = 'Real Madrid Away Jersey 2023/24'
union all select id, 'XL',  3 from products where name = 'Real Madrid Away Jersey 2023/24'

union all select id, 'S',   3 from products where name = 'Bayern Munich Home Jersey 2022/23'
union all select id, 'M',   6 from products where name = 'Bayern Munich Home Jersey 2022/23'
union all select id, 'L',   5 from products where name = 'Bayern Munich Home Jersey 2022/23'
union all select id, 'XL',  3 from products where name = 'Bayern Munich Home Jersey 2022/23'

union all select id, 'S',   3 from products where name = 'Juventus Away Jersey 2022/23'
union all select id, 'M',   5 from products where name = 'Juventus Away Jersey 2022/23'
union all select id, 'L',   4 from products where name = 'Juventus Away Jersey 2022/23'
union all select id, 'XL',  2 from products where name = 'Juventus Away Jersey 2022/23'

union all select id, 'S',   3 from products where name = 'AC Milan Away Jersey 2022/23'
union all select id, 'M',   6 from products where name = 'AC Milan Away Jersey 2022/23'
union all select id, 'L',   5 from products where name = 'AC Milan Away Jersey 2022/23'
union all select id, 'XL',  3 from products where name = 'AC Milan Away Jersey 2022/23'

union all select id, 'S',   2 from products where name = 'Inter Milan Third Jersey 2022/23'
union all select id, 'M',   5 from products where name = 'Inter Milan Third Jersey 2022/23'
union all select id, 'L',   4 from products where name = 'Inter Milan Third Jersey 2022/23'
union all select id, 'XL',  2 from products where name = 'Inter Milan Third Jersey 2022/23'

union all select id, 'S',   4 from products where name = 'Borussia Dortmund Away Jersey 2022/23'
union all select id, 'M',   6 from products where name = 'Borussia Dortmund Away Jersey 2022/23'
union all select id, 'L',   5 from products where name = 'Borussia Dortmund Away Jersey 2022/23'
union all select id, 'XL',  3 from products where name = 'Borussia Dortmund Away Jersey 2022/23'

union all select id, 'S',   3 from products where name = 'Napoli Third Jersey 2022/23'
union all select id, 'M',   5 from products where name = 'Napoli Third Jersey 2022/23'
union all select id, 'L',   4 from products where name = 'Napoli Third Jersey 2022/23'
union all select id, 'XL',  2 from products where name = 'Napoli Third Jersey 2022/23';
