-- Add required contact fields to existing KDPlus profiles.
alter table public.profiles
  add column if not exists phone text not null default '',
  add column if not exists address text not null default '';

notify pgrst, 'reload schema';
