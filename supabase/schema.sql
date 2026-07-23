-- ============================================================
-- Jersey store: complete database schema
-- Run this in the Supabase SQL editor
-- ============================================================

create extension if not exists "pgcrypto";

-- ============================================================
-- 1. ADMIN ACCOUNTS & PERMISSIONS
-- ============================================================

create table if not exists admin_users (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('super_admin', 'admin')),
  full_name text,
  created_by uuid references admin_users(id),
  created_at timestamptz not null default now()
);

create table if not exists admin_permissions (
  admin_id uuid primary key references admin_users(id) on delete cascade,
  can_create boolean not null default false,
  can_edit   boolean not null default false,
  can_hide   boolean not null default false
);

-- ============================================================
-- 2. PRODUCTS & STOCK
-- ============================================================

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  sport text not null check (sport in ('football', 'rugby', 'basketball', 'cricket')),
  team text,
  description text,
  price numeric(10,2) not null check (price >= 0),
  image_url text,
  is_hidden boolean not null default false,
  is_featured boolean not null default false,
  created_by uuid references admin_users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  size text not null,
  stock_quantity int not null default 0 check (stock_quantity >= 0),
  sku text unique,
  unique (product_id, size)
);

-- ============================================================
-- 3. PROMOTIONS
-- ============================================================


-- ============================================================
-- 4. BANNERS
-- ============================================================

create table if not exists banners (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  subtitle text,
  image_url text not null,
  video_url text,
  link_url text,
  position text not null check (position in ('hero', 'category_football', 'category_rugby', 'category_basketball', 'category_cricket')),
  starts_at timestamptz,
  ends_at timestamptz,
  is_active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- ============================================================
-- 5. ORDERS
-- ============================================================

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  customer_name text,
  customer_phone text not null,
  customer_email text,
  fulfillment_method text not null check (fulfillment_method in ('delivery', 'pickup')),
  payment_method text not null check (payment_method in ('mpesa', 'pay_on_pickup', 'cash_on_delivery')),
  payment_status text not null default 'pending' check (payment_status in ('pending', 'paid', 'failed', 'cancelled')),
  order_status text not null default 'processing' check (order_status in ('processing', 'ready', 'out_for_delivery', 'completed', 'cancelled')),
  total_amount numeric(10,2) not null,
  mpesa_checkout_request_id text,
  mpesa_merchant_request_id text,
  delivery_address jsonb,
  created_at timestamptz not null default now()
);

create table if not exists order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  product_id uuid references products(id),
  variant_id uuid references product_variants(id),
  quantity int not null check (quantity > 0),
  unit_price numeric(10,2) not null,
  custom_name text,
  custom_number text
);

-- ============================================================
-- 6. AUDIT LOG
-- ============================================================

create table if not exists audit_log (
  id uuid primary key default gen_random_uuid(),
  admin_id uuid references admin_users(id),
  action text not null,
  table_name text not null,
  record_id uuid,
  details jsonb,
  created_at timestamptz not null default now()
);

-- ============================================================
-- 7. HELPER FUNCTIONS
-- ============================================================

create or replace function is_super_admin() returns boolean as $$
  select exists (
    select 1 from admin_users where id = auth.uid() and role = 'super_admin'
  );
$$ language sql security definer stable;

create or replace function is_admin() returns boolean as $$
  select exists (
    select 1 from admin_users where id = auth.uid()
  );
$$ language sql security definer stable;

create or replace function admin_perm(perm text) returns boolean as $$
  select coalesce(
    (select case perm
      when 'can_create' then can_create
      when 'can_edit'   then can_edit
      when 'can_hide'   then can_hide
     end
     from admin_permissions where admin_id = auth.uid()),
    false
  );
$$ language sql security definer stable;

-- ============================================================
-- 8. TRIGGERS
-- ============================================================

create or replace function enforce_product_update_permissions() returns trigger as $$
begin
  if is_super_admin() or admin_perm('can_edit') then
    return new;
  end if;

  if admin_perm('can_hide') then
    if new.name is distinct from old.name
       or new.sport is distinct from old.sport
       or new.team is distinct from old.team
       or new.description is distinct from old.description
       or new.price is distinct from old.price
       or new.image_url is distinct from old.image_url then
      raise exception 'You only have permission to hide or unhide this product';
    end if;
    return new;
  end if;

  raise exception 'You do not have permission to update products';
end;
$$ language plpgsql security definer;

drop trigger if exists trg_enforce_product_update on products;
create trigger trg_enforce_product_update
before update on products
for each row execute function enforce_product_update_permissions();

create or replace function log_audit() returns trigger as $$
declare
  act text;
begin
  if tg_op = 'INSERT' then act := 'create';
  elsif tg_op = 'UPDATE' then act := 'update';
  elsif tg_op = 'DELETE' then act := 'delete';
  end if;

  insert into audit_log (admin_id, action, table_name, record_id, details)
  values (
    auth.uid(),
    act,
    tg_table_name,
    coalesce(new.id, old.id),
    case when tg_op = 'DELETE' then to_jsonb(old) else to_jsonb(new) end
  );

  if tg_op = 'DELETE' then
    return old;
  end if;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists trg_audit_products on products;
create trigger trg_audit_products
after insert or update or delete on products
for each row execute function log_audit();

drop trigger if exists trg_audit_orders on orders;
create trigger trg_audit_orders
after update on orders
for each row execute function log_audit();

-- ============================================================
-- 9. ENABLE ROW LEVEL SECURITY
-- ============================================================

alter table admin_users enable row level security;
alter table admin_permissions enable row level security;
alter table products enable row level security;
alter table product_variants enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;
alter table audit_log enable row level security;
alter table banners enable row level security;

-- ============================================================
-- 10. POLICIES -- admin_users & admin_permissions
-- ============================================================

drop policy if exists "read own account or all if super admin" on admin_users;
create policy "read own account or all if super admin" on admin_users
  for select using (id = auth.uid() or is_super_admin());

drop policy if exists "super admin creates admins" on admin_users;
create policy "super admin creates admins" on admin_users
  for insert with check (is_super_admin());

drop policy if exists "super admin updates admins" on admin_users;
create policy "super admin updates admins" on admin_users
  for update using (is_super_admin()) with check (is_super_admin());

drop policy if exists "super admin deletes admins" on admin_users;
create policy "super admin deletes admins" on admin_users
  for delete using (is_super_admin());

drop policy if exists "read own permissions or all if super admin" on admin_permissions;
create policy "read own permissions or all if super admin" on admin_permissions
  for select using (admin_id = auth.uid() or is_super_admin());

drop policy if exists "super admin manages permissions" on admin_permissions;
create policy "super admin manages permissions" on admin_permissions
  for all using (is_super_admin()) with check (is_super_admin());

-- ============================================================
-- 11. POLICIES -- products & variants
-- ============================================================

drop policy if exists "public reads visible products" on products;
create policy "public reads visible products" on products
  for select using (is_hidden = false or is_admin());

drop policy if exists "create products" on products;
create policy "create products" on products
  for insert with check (is_super_admin() or admin_perm('can_create'));

drop policy if exists "admins attempt product updates" on products;
create policy "admins attempt product updates" on products
  for update using (is_admin()) with check (is_admin());

drop policy if exists "only super admin deletes products" on products;
create policy "only super admin deletes products" on products
  for delete using (is_super_admin());

drop policy if exists "public reads variants" on product_variants;
create policy "public reads variants" on product_variants
  for select using (true);

drop policy if exists "super admin or can_edit manages variants" on product_variants;
create policy "super admin or can_edit manages variants" on product_variants
  for all using (is_super_admin() or admin_perm('can_edit'))
  with check (is_super_admin() or admin_perm('can_edit'));

-- ============================================================
-- 12. POLICIES -- orders & order_items
-- ============================================================

drop policy if exists "any admin views orders" on orders;
create policy "any admin views orders" on orders
  for select using (is_admin());

drop policy if exists "only super admin updates orders" on orders;
create policy "only super admin updates orders" on orders
  for update using (is_super_admin()) with check (is_super_admin());

drop policy if exists "only super admin deletes orders" on orders;
create policy "only super admin deletes orders" on orders
  for delete using (is_super_admin());

drop policy if exists "any admin views order items" on order_items;
create policy "any admin views order items" on order_items
  for select using (is_admin());

-- ============================================================
-- 13. POLICIES -- promotions & promotion_products
-- ============================================================


-- ============================================================
-- 14. POLICIES -- banners
-- ============================================================

drop policy if exists "public reads active banners" on banners;
create policy "public reads active banners" on banners
  for select using (is_active = true or is_admin());

drop policy if exists "super admin manages banners" on banners;
create policy "super admin manages banners" on banners
  for all using (is_super_admin()) with check (is_super_admin());

-- ============================================================
-- 15. POLICIES -- audit log
-- ============================================================

drop policy if exists "super admin reads all audit entries" on audit_log;
create policy "super admin reads all audit entries" on audit_log
  for select using (is_super_admin());

drop policy if exists "admin reads own audit entries" on audit_log;
create policy "admin reads own audit entries" on audit_log
  for select using (admin_id = auth.uid());
