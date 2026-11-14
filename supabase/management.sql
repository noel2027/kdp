-- Run in Supabase SQL Editor after setup.sql, including when upgrading an
-- existing project. It adds a selectable transaction date and an atomic
-- operation for inserting a transaction and updating the profile balance.

alter table public.transactions
  add column if not exists transaction_date date;
update public.transactions
set transaction_date = created_at::date
where transaction_date is null;
alter table public.transactions
  alter column transaction_date set default current_date,
  alter column transaction_date set not null;

create index if not exists transactions_profile_date_idx
  on public.transactions (profile_id, transaction_date desc);

drop function if exists public.record_profile_transaction(uuid, text, text, numeric, text);

create or replace function public.record_profile_transaction(
  p_profile_id uuid,
  p_reference text,
  p_type text,
  p_amount numeric,
  p_description text,
  p_transaction_date date
)
returns public.transactions
language plpgsql
set search_path = public, pg_temp
as $$
declare
  created_transaction public.transactions;
begin
  if p_amount = 0 then
    raise exception 'Transaction amount must not be zero';
  end if;

  insert into public.transactions (
    profile_id,
    reference,
    type,
    amount,
    description,
    transaction_date
  )
  values (
    p_profile_id,
    p_reference,
    p_type,
    p_amount,
    p_description,
    p_transaction_date
  )
  returning * into created_transaction;

  update public.profiles
  set balance = balance + p_amount
  where id = p_profile_id;

  return created_transaction;
end;
$$;

revoke all on function public.record_profile_transaction(uuid, text, text, numeric, text, date)
  from public, anon, authenticated;
grant execute on function public.record_profile_transaction(uuid, text, text, numeric, text, date)
  to service_role;

notify pgrst, 'reload schema';
