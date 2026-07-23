-- Add missing tables: stock_reservations and email_logs

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
