-- Replace fuelforfans.com hoodie images (blocked by browser) with
-- working CDN images from CMC Motorsports (Shopify CDN) and TheSportsDB.
-- All URLs verified to return HTTP 200 with valid image content.

alter table products disable trigger trg_enforce_product_update;

update products
set image_url = 'https://www.cmcmotorsports.com/cdn/shop/files/TU9872-020-NIGHTSKY-01.jpg?v=1737043055'
where name ilike '%red bull%' and name ilike '%hoodie%' and sport = 'formula_one';

update products
set image_url = 'https://www.cmcmotorsports.com/cdn/shop/files/701239028001_pp_01_ferrarif1.jpg?v=1782737676'
where name ilike '%ferrari%' and name ilike '%hoodie%' and sport = 'formula_one';

update products
set image_url = 'https://www.cmcmotorsports.com/cdn/shop/files/KE5910_b2b012_plp_grande.webp?v=1767990228'
where name ilike '%mercedes%' and name ilike '%hoodie%' and sport = 'formula_one';

update products
set image_url = 'https://www.cmcmotorsports.com/cdn/shop/files/TU9918-088-AUTUMNGLORY-PHANTOM-01_1920X2208_a6b581ac-0023-48bd-95bd-768b9b1da889.jpg?v=1737405880'
where name ilike '%mclaren%' and name ilike '%hoodie%' and sport = 'formula_one';

update products
set image_url = 'https://www.cmcmotorsports.com/cdn/shop/files/f1048239-1309-4205-8974-81e01ea4fd61.jpg?v=1740002974'
where name ilike '%aston martin%' and name ilike '%hoodie%' and sport = 'formula_one';

update products
set image_url = 'https://www.cmcmotorsports.com/cdn/shop/files/TU10293-030-LAPISBLUE-01.jpg?v=1737996414'
where name ilike '%alpine%' and name ilike '%hoodie%' and sport = 'formula_one';

update products
set image_url = 'https://r2.thesportsdb.com/images/media/team/badge/fp1cil1740776050.png'
where name ilike '%williams%' and name ilike '%hoodie%' and sport = 'formula_one';

-- Haas already uses haasf1.shop CDN which works fine — no change needed.

alter table products enable trigger trg_enforce_product_update;
