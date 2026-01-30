-- Add detailed text field to projects

alter table public.projects
  add column if not exists details text not null default '';
