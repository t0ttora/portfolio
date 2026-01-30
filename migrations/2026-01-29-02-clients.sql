-- Clients table for admin CRM

create extension if not exists "pgcrypto";

create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),

  name text not null,
  phase text not null default 'Discovery',
  payment_status text not null default 'pending' check (payment_status in ('pending', 'paid')),
  portal_url text,
  notes text not null default '',
  is_active boolean not null default true
);

create index if not exists clients_is_active_idx on public.clients (is_active);
create index if not exists clients_created_at_idx on public.clients (created_at desc);
