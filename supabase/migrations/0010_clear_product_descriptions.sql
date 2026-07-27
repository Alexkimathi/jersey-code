-- Clear all existing short product descriptions so the
-- auto-generated multi-paragraph descriptions take effect.
-- Admins can add custom descriptions per product via the admin panel.
UPDATE products SET description = NULL WHERE description IS NOT NULL;
