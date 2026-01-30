-- Align clients.payment_status with enum

do $$
begin
  if not exists (select 1 from pg_type where typname = 'payment_status') then
    create type payment_status as enum ('Paid', 'Pending', 'Overdue');
  end if;
end
$$;

alter table public.clients
  drop constraint if exists clients_payment_status_check,
  alter column payment_status drop default;

update public.clients
set payment_status = case lower(payment_status)
  when 'pending' then 'Pending'
  when 'paid' then 'Paid'
  when 'overdue' then 'Overdue'
  else 'Pending'
end
where payment_status is not null;

alter table public.clients
  alter column payment_status type payment_status
  using (case lower(payment_status)
    when 'pending' then 'Pending'
    when 'paid' then 'Paid'
    when 'overdue' then 'Overdue'
    else 'Pending'
  end)::payment_status,
  alter column payment_status set default 'Pending',
  alter column payment_status set not null;
