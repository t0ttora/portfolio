-- Client portal project intake

create table if not exists client_intake (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  client_id uuid not null references clients(id) on delete cascade,
  project_title text not null,
  scope text,
  deadline text,
  budget text,
  notes text
);

create index if not exists client_intake_client_id_idx on client_intake(client_id);
