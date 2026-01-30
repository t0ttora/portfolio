-- Client Documents table for portal file sharing

create table if not exists client_documents (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  client_id uuid not null references clients(id) on delete cascade,
  project_id uuid references projects(id) on delete set null,
  
  title text not null,
  description text,
  file_url text not null,
  file_type text not null default 'document', -- document, image, video, contract, invoice
  file_size bigint,
  
  uploaded_by text not null default 'admin', -- admin or developer
  is_visible boolean not null default true
);

create index if not exists client_documents_client_id_idx on client_documents(client_id);
create index if not exists client_documents_project_id_idx on client_documents(project_id);

-- Project milestones/timeline
create table if not exists project_milestones (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  project_id uuid not null references projects(id) on delete cascade,
  
  title text not null,
  description text,
  due_date date,
  completed_at timestamptz,
  status text not null default 'pending' check (status in ('pending', 'in_progress', 'completed', 'delayed'))
);

create index if not exists project_milestones_project_id_idx on project_milestones(project_id);
