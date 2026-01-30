-- Portal access helper (bypass RLS safely)

create or replace function public.get_client_by_access_code(p_code text)
returns table (
  id uuid,
  name text,
  email text,
  project_ref uuid,
  status client_status,
  payment_status payment_status
)
language sql
security definer
set search_path = public
as $$
  select c.id, c.name, c.email, c.project_ref, c.status, c.payment_status
  from public.clients c
  where c.access_code ilike p_code
  limit 1;
$$;

grant execute on function public.get_client_by_access_code(text) to anon, authenticated;
