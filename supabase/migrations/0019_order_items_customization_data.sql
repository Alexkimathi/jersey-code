-- Add customization_data JSONB column to order_items to persist badges, font, edition, etc.
alter table order_items
  add column if not exists customization_data jsonb default null;
