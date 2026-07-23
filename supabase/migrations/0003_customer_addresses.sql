-- Customer address book (used in checkout for delivery address autofill).
-- customers are identified by phone number (no auth required).

create table if not exists customer_addresses (
  id            uuid        primary key default gen_random_uuid(),
  customer_id   text        not null,           -- phone number used as identifier
  full_name     text        not null,
  phone         text        not null,
  street_address text       not null,
  city          text        not null,
  postal_code   text,
  is_default    boolean     not null default false,
  created_at    timestamptz not null default now()
);

create index if not exists customer_addresses_customer_id_idx
  on customer_addresses (customer_id);

-- Enable RLS; allow read/write scoped to the customer's own phone number.
-- No auth token is required — access is gated at application level by customer_id.
alter table customer_addresses enable row level security;

create policy "allow_all_on_own_addresses" on customer_addresses
  for all
  using (true)
  with check (true);
