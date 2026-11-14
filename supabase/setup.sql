-- KDPlus prototype schema and demo data.
-- Run once in Supabase Dashboard > SQL Editor > New query.
-- Email-only access is not identity verification. Do not use for production data.

create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name text not null,
  email text not null,
  phone text not null default '',
  address text not null default '',
  role text not null check (role in ('Admin', 'User')),
  status text not null default 'Active' check (status in ('Active', 'Suspended')),
  account_id text not null unique,
  balance numeric(12, 2) not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles
  add column if not exists phone text not null default '',
  add column if not exists address text not null default '';

create unique index if not exists profiles_email_lower_unique
  on public.profiles (lower(email));

create table if not exists public.books (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  author_name text not null,
  status text not null default 'Draft' check (status in ('Draft', 'Active', 'Published')),
  royalty_rate numeric(5, 4) not null default 0 check (royalty_rate between 0 and 1),
  current_balance numeric(12, 2) not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint books_profile_title_unique unique (profile_id, title)
);

create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  reference text not null unique,
  type text not null check (type in ('Credit', 'Debit', 'Adjustment')),
  amount numeric(12, 2) not null,
  description text not null default '',
  transaction_date date not null default current_date,
  created_at timestamptz not null default now()
);

alter table public.transactions
  add column if not exists transaction_date date;
update public.transactions
set transaction_date = created_at::date
where transaction_date is null;
alter table public.transactions
  alter column transaction_date set default current_date,
  alter column transaction_date set not null;

create table if not exists public.book_assignments (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  book_id uuid not null references public.books(id) on delete cascade,
  assigned_at timestamptz not null default now(),
  constraint book_assignments_profile_book_unique unique (profile_id, book_id)
);

create index if not exists profiles_role_status_idx
  on public.profiles (role, status);
create index if not exists books_profile_id_idx
  on public.books (profile_id);
create index if not exists transactions_profile_created_idx
  on public.transactions (profile_id, created_at desc);
create index if not exists transactions_profile_date_idx
  on public.transactions (profile_id, transaction_date desc);
create index if not exists book_assignments_profile_id_idx
  on public.book_assignments (profile_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists books_set_updated_at on public.books;
create trigger books_set_updated_at
before update on public.books
for each row execute function public.set_updated_at();

-- Keep the tables inaccessible to browser/API roles by default.
-- A trusted server-side integration must be configured before the app can use them.
alter table public.profiles enable row level security;
alter table public.books enable row level security;
alter table public.transactions enable row level security;
alter table public.book_assignments enable row level security;

revoke all on table public.profiles, public.books, public.transactions, public.book_assignments
  from anon, authenticated;

grant usage on schema public to service_role;
grant select, insert, update, delete
  on table public.profiles, public.books, public.transactions, public.book_assignments
  to service_role;

-- Demo accounts. Replace the admin email if desired before running this script.
insert into public.profiles (
  first_name, last_name, email, role, status, account_id, balance
)
values
  ('Alicia', 'Stone', 'admin@kdplus.demo', 'Admin', 'Active', 'ACC-ADM-001', 125000.00),
  ('Marcus', 'Bell', 'marcus.bell@kdplus.demo', 'User', 'Active', 'ACC-USR-101', 2840.50),
  ('Sofia', 'Nguyen', 'sofia.nguyen@kdplus.demo', 'User', 'Suspended', 'ACC-USR-102', 580.00)
on conflict (account_id) do nothing;

insert into public.books (
  profile_id, title, author_name, status, royalty_rate, current_balance
)
select
  p.id, sample.title, p.first_name || ' ' || p.last_name,
  sample.status, sample.royalty_rate, sample.current_balance
from public.profiles as p
cross join (
  values
    ('The Quiet Atlas', 'Published', 0.7000::numeric, 1640.50::numeric),
    ('Northbound Stories', 'Active', 0.7200::numeric, 980.25::numeric),
    ('City in Layers', 'Draft', 0.6800::numeric, 0.00::numeric)
) as sample(title, status, royalty_rate, current_balance)
where lower(p.email) = lower('marcus.bell@kdplus.demo')
on conflict (profile_id, title) do nothing;

insert into public.book_assignments (profile_id, book_id)
select p.id, b.id
from public.profiles as p
join public.books as b on b.profile_id = p.id
where lower(p.email) = lower('marcus.bell@kdplus.demo')
on conflict (profile_id, book_id) do nothing;

insert into public.transactions (profile_id, reference, type, amount, description)
select p.id, sample.reference, sample.type, sample.amount, sample.description
from public.profiles as p
cross join (
  values
    ('ROYALTY-4401', 'Credit', 1250.75::numeric, 'Monthly royalty payout'),
    ('ADVANCE-2201', 'Credit', 450.00::numeric, 'Advance against royalties'),
    ('ADJUST-1104', 'Adjustment', -60.25::numeric, 'Platform fee adjustment'),
    ('PAYOUT-7740', 'Debit', -1200.00::numeric, 'Transfer to bank account')
) as sample(reference, type, amount, description)
where lower(p.email) = lower('marcus.bell@kdplus.demo')
on conflict (reference) do nothing;
