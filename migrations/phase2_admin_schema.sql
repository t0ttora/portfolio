-- Phase 2: Admin Dashboard & Visual CMS
-- Run in Supabase SQL editor.

create extension if not exists "pgcrypto";

-- Projects shown on the homepage "desk" canvas.
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),

  title text not null,
  slug text not null unique,
  description text not null default '',

  github_url text,
  demo_url text,
  image_url text,

  repo_stats jsonb not null default '{}'::jsonb,

  position_x integer not null default 0,
  position_y integer not null default 0,
  rotation integer not null default 0,
  z_index integer not null default 0,

  is_visible boolean not null default true
);

create index if not exists projects_is_visible_idx on public.projects (is_visible);
create index if not exists projects_z_index_idx on public.projects (z_index);

-- Arbitrary site settings (maintenance mode, SEO defaults, etc.)
create table if not exists public.site_settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb
);

-- Optional seed: maintenance mode disabled by default
insert into public.site_settings (key, value)
values ('maintenance', jsonb_build_object('enabled', false))
on conflict (key) do nothing;
