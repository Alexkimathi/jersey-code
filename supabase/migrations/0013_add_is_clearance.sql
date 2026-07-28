alter table products
  add column if not exists is_clearance boolean not null default false;
