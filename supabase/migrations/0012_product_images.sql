-- Add back, side, and badge image columns to products.
-- These replace the hard-coded TEAM_IMAGES mapping in teamImages.ts
-- so each product can have its own per-product images.

alter table products
  add column if not exists back_image_url  text,
  add column if not exists side_image_url  text,
  add column if not exists badge_url       text;
