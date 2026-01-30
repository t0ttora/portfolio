-- Phase 3: Client Portal & Management System

do $$
begin
  if not exists (select 1 from pg_type where typname = 'client_status') then
    create type client_status as enum ('Active', 'Completed', 'Archived');
  end if;
  if not exists (select 1 from pg_type where typname = 'payment_status') then
    create type payment_status as enum ('Paid', 'Pending', 'Overdue');
  end if;
  if not exists (select 1 from pg_type where typname = 'feedback_type') then
    create type feedback_type as enum ('Bug', 'Feature');
  end if;
end
$$;

create table if not exists clients (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  email text,
  project_ref uuid references projects(id) on delete set null,
  access_code text not null unique,
  magic_link_token text,
  status client_status not null default 'Active',
  payment_status payment_status not null default 'Pending'
);

alter table clients
  add column if not exists email text,
  add column if not exists project_ref uuid references projects(id) on delete set null,
  add column if not exists access_code text,
  add column if not exists magic_link_token text,
  add column if not exists status client_status default 'Active',
  add column if not exists payment_status payment_status default 'Pending';

create unique index if not exists clients_access_code_idx on clients(access_code);

create index if not exists clients_project_ref_idx on clients(project_ref);

create table if not exists feedback (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  client_id uuid not null references clients(id) on delete cascade,
  message text not null,
  type feedback_type not null
);

create index if not exists feedback_client_id_idx on feedback(client_id);
