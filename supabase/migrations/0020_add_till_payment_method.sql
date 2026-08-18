-- Add 'till' as a valid payment method
alter table orders
  drop constraint if exists orders_payment_method_check;

alter table orders
  add constraint orders_payment_method_check
  check (payment_method in ('mpesa', 'till', 'pay_on_pickup', 'cash_on_delivery'));
