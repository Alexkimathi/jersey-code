-- Fix broken and wrong product image URLs
-- 1. Rugby Match Jersey: Unsplash photo is now 404
-- 2. Supporter Flags: all three had a wrong Unsplash photo (fitness/gym woman)

alter table products disable trigger trg_enforce_product_update;

-- Rugby Match Jersey — replace 404 Unsplash URL with a working rugby action photo
update products
set image_url = 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=600&h=600&fit=crop'
where name ilike '%rugby match jersey%';

-- Arsenal FC Supporter Flag — official Arsenal badge from TheSportsDB
update products
set image_url = 'https://r2.thesportsdb.com/images/media/team/badge/uyhbfe1612467038.png'
where name ilike '%arsenal%' and name ilike '%flag%';

-- Manchester United Supporter Flag — official Man Utd badge from TheSportsDB
update products
set image_url = 'https://r2.thesportsdb.com/images/media/team/badge/xzqdr11517660252.png'
where name ilike '%manchester united%' and name ilike '%flag%';

-- Kenya Simbas Rugby Flag — sports fan/stadium atmosphere photo
update products
set image_url = 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&h=600&fit=crop'
where name ilike '%kenya%' and name ilike '%flag%';

alter table products enable trigger trg_enforce_product_update;
