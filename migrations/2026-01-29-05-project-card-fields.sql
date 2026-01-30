-- Add card metadata fields to projects

alter table public.projects
  add column if not exists ref_code text not null default '',
  add column if not exists category text not null default '',
  add column if not exists short_desc text not null default '',
  add column if not exists card_date text not null default '',
  add column if not exists status text not null default '',
  add column if not exists tech text[] not null default '{}';
