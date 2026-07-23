-- Initial Supabase migration for Jersey Store

create extension if not exists "pgcrypto";

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
  can_edit boolean not null default false,
  can_hide boolean not null default false
);

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

create table if not exists audit_log (
  id uuid primary key default gen_random_uuid(),
  admin_id uuid references admin_users(id),
  action text not null,
  table_name text not null,
  record_id uuid,
  details jsonb,
  created_at timestamptz not null default now()
);

create table if not exists customer_profiles (
  id uuid primary key default gen_random_uuid(),
  phone text unique not null,
  full_name text,
  email text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists customer_addresses (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references customer_profiles(id) on delete cascade,
  full_name text not null,
  phone text not null,
  street_address text not null,
  city text not null,
  postal_code text,
  is_default boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (customer_id, street_address, city)
);

create table if not exists reviews (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  customer_id uuid references customer_profiles(id) on delete set null,
  rating int not null check (rating >= 1 and rating <= 5),
  title text,
  comment text,
  is_verified_purchase boolean not null default false,
  helpful_count int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists discount_coupons (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  discount_type text not null check (discount_type in ('percentage', 'fixed')),
  discount_value numeric(10,2) not null check (discount_value > 0),
  max_uses int,
  current_uses int not null default 0,
  min_order_amount numeric(10,2),
  is_active boolean not null default true,
  starts_at timestamptz,
  expires_at timestamptz,
  created_by uuid references admin_users(id),
  created_at timestamptz not null default now()
);

create table if not exists stock_reservations (
  id uuid primary key default gen_random_uuid(),
  product_variant_id uuid not null references product_variants(id) on delete cascade,
  order_id uuid references orders(id) on delete cascade,
  quantity int not null check (quantity > 0),
  reserved_at timestamptz not null default now(),
  expires_at timestamptz not null,
  status text not null default 'reserved' check (status in ('reserved', 'confirmed', 'released', 'expired'))
);

create table if not exists email_logs (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders(id) on delete cascade,
  customer_email text not null,
  email_type text not null check (email_type in ('order_confirmation', 'payment_received', 'order_shipped', 'order_delivered', 'order_cancelled', 'invoice')),
  status text not null default 'pending' check (status in ('pending', 'sent', 'failed', 'bounced')),
  error_message text,
  sent_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  subject text not null,
  message text not null,
  status text not null default 'new' check (status in ('new', 'read', 'responded', 'closed')),
  created_at timestamptz not null default now()
);

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
      when 'can_edit' then can_edit
      when 'can_hide' then can_hide
     end
     from admin_permissions where admin_id = auth.uid()),
    false
  );
$$ language sql security definer stable;

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

alter table admin_users enable row level security;
alter table admin_permissions enable row level security;
alter table products enable row level security;
alter table product_variants enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;
alter table audit_log enable row level security;
alter table banners enable row level security;
alter table customer_profiles enable row level security;
alter table customer_addresses enable row level security;
alter table reviews enable row level security;
alter table discount_coupons enable row level security;
alter table stock_reservations enable row level security;
alter table email_logs enable row level security;
alter table contact_messages enable row level security;

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

drop policy if exists "public reads active banners" on banners;
create policy "public reads active banners" on banners
  for select using (is_active = true or is_admin());

drop policy if exists "super admin manages banners" on banners;
create policy "super admin manages banners" on banners
  for all using (is_super_admin()) with check (is_super_admin());

drop policy if exists "public reads customer profiles by phone" on customer_profiles;
create policy "public reads customer profiles by phone" on customer_profiles
  for select using (true);

drop policy if exists "customers manage own addresses" on customer_addresses;
create policy "customers manage own addresses" on customer_addresses
  for all using (true);

drop policy if exists "public reads reviews" on reviews;
create policy "public reads reviews" on reviews
  for select using (true);

drop policy if exists "customers submit reviews" on reviews;
create policy "customers submit reviews" on reviews
  for insert with check (true);

drop policy if exists "public reads active coupons" on discount_coupons;
create policy "public reads active coupons" on discount_coupons
  for select using (is_active = true or is_admin());

drop policy if exists "super admin manages coupons" on discount_coupons;
create policy "super admin manages coupons" on discount_coupons
  for all using (is_super_admin()) with check (is_super_admin());

drop policy if exists "public manages reservations" on stock_reservations;
create policy "public manages reservations" on stock_reservations
  for all using (true);

drop policy if exists "admins view email logs" on email_logs;
create policy "admins view email logs" on email_logs
  for select using (is_admin());

drop policy if exists "public submits contact messages" on contact_messages;
create policy "public submits contact messages" on contact_messages
  for insert with check (true);

drop policy if exists "admins view contact messages" on contact_messages;
create policy "admins view contact messages" on contact_messages
  for select using (is_admin());

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
