-- Add sub_category column to products
-- Values: null (club jersey), 'kids', 'vintage', 'special_edition', 'tracksuit', 'national', 'clearance'

alter table products
  add column if not exists sub_category text default null;

-- Back-fill existing products based on current name-pattern detection
alter table products disable trigger trg_enforce_product_update;

update products set sub_category = 'kids'
where (name ilike '%kids%' or name ilike '%youth%' or name ilike '%junior%')
  and sub_category is null;

update products set sub_category = 'vintage'
where name ilike '%vintage%'
  and sub_category is null;

update products set sub_category = 'special_edition'
where (name ilike '%special%' or name ilike '%limited%' or name ilike '%edition%')
  and sub_category is null;

update products set sub_category = 'tracksuit'
where name ilike '%tracksuit%'
  and sub_category is null;

update products set sub_category = 'clearance'
where is_clearance = true
  and sub_category is null;

alter table products enable trigger trg_enforce_product_update;
