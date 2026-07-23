-- Seed data for jersey store
-- Run this in the Supabase SQL Editor after running schema.sql

insert into products (name, sport, team, description, price, image_url, is_featured, is_hidden)
values
  ('Harambee Stars Home Jersey', 'football', 'Harambee Stars', 'Official home kit with breathable mesh and authentic club styling', 4200, null, true, false),
  ('Harambee Stars Away Jersey', 'football', 'Harambee Stars', 'Away kit with bold contrast trim and premium performance fabric', 4300, null, false, false),
  ('Harambee Stars Training Jersey', 'football', 'Harambee Stars', 'Lightweight training tee with national team branding', 3900, null, false, false),
  ('Manchester United Home Jersey', 'football', 'Manchester United', 'Red home shirt with modern fit and iconic club crest', 4500, null, true, false),
  ('Arsenal Retro Jersey', 'football', 'Arsenal', 'Vintage inspired retro football jersey with classic details', 3800, null, false, false),
  ('Chelsea Home Jersey', 'football', 'Chelsea', 'Classic royal blue home jersey with club crest and modern stripes', 4400, null, false, false),
  ('Liverpool Home Jersey', 'football', 'Liverpool', 'Red home kit with breathable fabric and fan-ready comfort', 4500, null, false, false),
  ('Manchester City Home Jersey', 'football', 'Manchester City', 'Sky blue home jersey with premium performance fit', 4600, null, false, false),
  ('Bayern Munich Classic Jersey', 'football', 'Bayern Munich', 'Heritage-style home jersey with club signature stripes', 4700, null, false, false),
  ('Borussia Dortmund Black & Yellow Jersey', 'football', 'Borussia Dortmund', 'High-performance jersey with bold club colors', 4600, null, false, false),
  ('RB Leipzig Aero Jersey', 'football', 'RB Leipzig', 'Sleek aerodynamic jersey with dynamic club accents', 4450, null, false, false),
  ('Bayer Leverkusen Home Jersey', 'football', 'Bayer Leverkusen', 'Modern club jersey with striking black and red details', 4500, null, false, false),
  ('Juventus Striped Home Jersey', 'football', 'Juventus', 'Sleek black-and-white home jersey with lightweight performance fabric', 4800, null, false, false),
  ('AC Milan Legend Jersey', 'football', 'AC Milan', 'Premium jersey celebrating club legacy with breathable mesh', 4900, null, false, false),
  ('Inter Milan Iconic Jersey', 'football', 'Inter Milan', 'Navy and black home jersey with iconic club styling', 4850, null, false, false),
  ('Napoli Blue Breeze Jersey', 'football', 'Napoli', 'Lightweight blue home jersey built for Italian top-flight performance', 4700, null, false, false),
  ('Roma Heritage Jersey', 'football', 'Roma', 'Classic maroon home kit with premium modern fit', 4650, null, false, false),
  ('Kenya Simbas Rugby Jersey', 'rugby', 'Kenya Simbas', 'Rugby jersey with reinforced seams built for contact sport', 5500, null, true, false),
  ('South Africa Springboks Rugby Jersey', 'rugby', 'South Africa', 'Green and gold rugby jersey with performance stretch fabric', 5600, null, false, false),
  ('Los Angeles Lakers Swingman Jersey', 'basketball', 'Los Angeles Lakers', 'Official swingman basketball jersey with performance fit', 4000, null, true, false),
  ('Chicago Bulls Swingman Jersey', 'basketball', 'Chicago Bulls', 'Red swingman jersey with iconic NBA styling', 4200, null, false, false),
  ('Kenya Cricket Test Jersey', 'cricket', 'Kenya national team', 'Traditional cricket whites with modern comfort and durability', 5000, null, false, false),
  ('England Cricket ODI Jersey', 'cricket', 'England', 'Official white and blue cricket jersey for limited overs', 5200, null, false, false);

insert into product_variants (product_id, size, stock_quantity)
select id, 'S', 10 from products where name = 'Harambee Stars Home Jersey'
union all select id, 'M', 15 from products where name = 'Harambee Stars Home Jersey'
union all select id, 'L', 20 from products where name = 'Harambee Stars Home Jersey'
union all select id, 'XL', 12 from products where name = 'Harambee Stars Home Jersey'
union all select id, 'S', 8 from products where name = 'Harambee Stars Away Jersey'
union all select id, 'M', 12 from products where name = 'Harambee Stars Away Jersey'
union all select id, 'L', 16 from products where name = 'Harambee Stars Away Jersey'
union all select id, 'XL', 10 from products where name = 'Harambee Stars Away Jersey'
union all select id, 'S', 10 from products where name = 'Harambee Stars Training Jersey'
union all select id, 'M', 12 from products where name = 'Harambee Stars Training Jersey'
union all select id, 'L', 15 from products where name = 'Harambee Stars Training Jersey'
union all select id, 'XL', 8 from products where name = 'Harambee Stars Training Jersey'
union all select id, 'S', 10 from products where name = 'Manchester United Home Jersey'
union all select id, 'M', 15 from products where name = 'Manchester United Home Jersey'
union all select id, 'L', 20 from products where name = 'Manchester United Home Jersey'
union all select id, 'XL', 12 from products where name = 'Manchester United Home Jersey'
union all select id, 'S', 10 from products where name = 'Arsenal Retro Jersey'
union all select id, 'M', 15 from products where name = 'Arsenal Retro Jersey'
union all select id, 'L', 20 from products where name = 'Arsenal Retro Jersey'
union all select id, 'XL', 12 from products where name = 'Arsenal Retro Jersey'
union all select id, 'S', 10 from products where name = 'Chelsea Home Jersey'
union all select id, 'M', 15 from products where name = 'Chelsea Home Jersey'
union all select id, 'L', 20 from products where name = 'Chelsea Home Jersey'
union all select id, 'XL', 12 from products where name = 'Chelsea Home Jersey'
union all select id, 'S', 10 from products where name = 'Liverpool Home Jersey'
union all select id, 'M', 15 from products where name = 'Liverpool Home Jersey'
union all select id, 'L', 20 from products where name = 'Liverpool Home Jersey'
union all select id, 'XL', 12 from products where name = 'Liverpool Home Jersey'
union all select id, 'S', 10 from products where name = 'Manchester City Home Jersey'
union all select id, 'M', 15 from products where name = 'Manchester City Home Jersey'
union all select id, 'L', 20 from products where name = 'Manchester City Home Jersey'
union all select id, 'XL', 12 from products where name = 'Manchester City Home Jersey'
union all select id, 'S', 10 from products where name = 'Bayern Munich Classic Jersey'
union all select id, 'M', 15 from products where name = 'Bayern Munich Classic Jersey'
union all select id, 'L', 20 from products where name = 'Bayern Munich Classic Jersey'
union all select id, 'XL', 12 from products where name = 'Bayern Munich Classic Jersey'
union all select id, 'S', 10 from products where name = 'Borussia Dortmund Black & Yellow Jersey'
union all select id, 'M', 15 from products where name = 'Borussia Dortmund Black & Yellow Jersey'
union all select id, 'L', 20 from products where name = 'Borussia Dortmund Black & Yellow Jersey'
union all select id, 'XL', 12 from products where name = 'Borussia Dortmund Black & Yellow Jersey'
union all select id, 'S', 10 from products where name = 'RB Leipzig Aero Jersey'
union all select id, 'M', 15 from products where name = 'RB Leipzig Aero Jersey'
union all select id, 'L', 20 from products where name = 'RB Leipzig Aero Jersey'
union all select id, 'XL', 12 from products where name = 'RB Leipzig Aero Jersey'
union all select id, 'S', 10 from products where name = 'Bayer Leverkusen Home Jersey'
union all select id, 'M', 15 from products where name = 'Bayer Leverkusen Home Jersey'
union all select id, 'L', 20 from products where name = 'Bayer Leverkusen Home Jersey'
union all select id, 'XL', 12 from products where name = 'Bayer Leverkusen Home Jersey'
union all select id, 'S', 10 from products where name = 'Juventus Striped Home Jersey'
union all select id, 'M', 15 from products where name = 'Juventus Striped Home Jersey'
union all select id, 'L', 20 from products where name = 'Juventus Striped Home Jersey'
union all select id, 'XL', 12 from products where name = 'Juventus Striped Home Jersey'
union all select id, 'S', 10 from products where name = 'AC Milan Legend Jersey'
union all select id, 'M', 15 from products where name = 'AC Milan Legend Jersey'
union all select id, 'L', 20 from products where name = 'AC Milan Legend Jersey'
union all select id, 'XL', 12 from products where name = 'AC Milan Legend Jersey'
union all select id, 'S', 10 from products where name = 'Inter Milan Iconic Jersey'
union all select id, 'M', 15 from products where name = 'Inter Milan Iconic Jersey'
union all select id, 'L', 20 from products where name = 'Inter Milan Iconic Jersey'
union all select id, 'XL', 12 from products where name = 'Inter Milan Iconic Jersey'
union all select id, 'S', 10 from products where name = 'Napoli Blue Breeze Jersey'
union all select id, 'M', 15 from products where name = 'Napoli Blue Breeze Jersey'
union all select id, 'L', 20 from products where name = 'Napoli Blue Breeze Jersey'
union all select id, 'XL', 12 from products where name = 'Napoli Blue Breeze Jersey'
union all select id, 'S', 10 from products where name = 'Roma Heritage Jersey'
union all select id, 'M', 15 from products where name = 'Roma Heritage Jersey'
union all select id, 'L', 20 from products where name = 'Roma Heritage Jersey'
union all select id, 'XL', 12 from products where name = 'Roma Heritage Jersey'
union all select id, 'S', 10 from products where name = 'Kenya Simbas Rugby Jersey'
union all select id, 'M', 15 from products where name = 'Kenya Simbas Rugby Jersey'
union all select id, 'L', 20 from products where name = 'Kenya Simbas Rugby Jersey'
union all select id, 'XL', 12 from products where name = 'Kenya Simbas Rugby Jersey'
union all select id, 'S', 10 from products where name = 'South Africa Springboks Rugby Jersey'
union all select id, 'M', 15 from products where name = 'South Africa Springboks Rugby Jersey'
union all select id, 'L', 20 from products where name = 'South Africa Springboks Rugby Jersey'
union all select id, 'XL', 12 from products where name = 'South Africa Springboks Rugby Jersey'
union all select id, 'S', 10 from products where name = 'Los Angeles Lakers Swingman Jersey'
union all select id, 'M', 15 from products where name = 'Los Angeles Lakers Swingman Jersey'
union all select id, 'L', 20 from products where name = 'Los Angeles Lakers Swingman Jersey'
union all select id, 'XL', 12 from products where name = 'Los Angeles Lakers Swingman Jersey'
union all select id, 'S', 10 from products where name = 'Chicago Bulls Swingman Jersey'
union all select id, 'M', 15 from products where name = 'Chicago Bulls Swingman Jersey'
union all select id, 'L', 20 from products where name = 'Chicago Bulls Swingman Jersey'
union all select id, 'XL', 12 from products where name = 'Chicago Bulls Swingman Jersey'
union all select id, 'S', 10 from products where name = 'Kenya Cricket Test Jersey'
union all select id, 'M', 15 from products where name = 'Kenya Cricket Test Jersey'
union all select id, 'L', 20 from products where name = 'Kenya Cricket Test Jersey'
union all select id, 'XL', 12 from products where name = 'Kenya Cricket Test Jersey'
union all select id, 'S', 10 from products where name = 'England Cricket ODI Jersey'
union all select id, 'M', 15 from products where name = 'England Cricket ODI Jersey'
union all select id, 'L', 20 from products where name = 'England Cricket ODI Jersey'
union all select id, 'XL', 12 from products where name = 'England Cricket ODI Jersey';

insert into banners (title, subtitle, image_url, video_url, link_url, position, is_active, sort_order)
values
  ('Harambee Stars Collection', 'Shop the official Kenyan national team jersey', '/images/banners/hero-harambee.svg', '/video/hero.mp4', '/products/football', 'hero', true, 1),
  ('Football Fan Essentials', 'Premium Premier League, Bundesliga and Serie A jerseys', '/images/banners/hero-football.svg', null, '/products/football', 'hero', true, 2);
