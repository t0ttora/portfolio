-- Client projects (pre-portfolio)

do $$
begin
  if not exists (select 1 from pg_type where typname = 'client_project_status') then
    create type client_project_status as enum ('Discovery', 'Design', 'Build', 'QA', 'Done');
  end if;
end
$$;

create table if not exists client_projects (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  client_id uuid not null references clients(id) on delete cascade,
  title text not null,
  summary text,
  status client_project_status not null default 'Discovery',
  budget text,
  deadline text,
  notes text,
  portfolio_project_id uuid references projects(id) on delete set null
);

create index if not exists client_projects_client_id_idx on client_projects(client_id);
create index if not exists client_projects_portfolio_project_id_idx on client_projects(portfolio_project_id);
