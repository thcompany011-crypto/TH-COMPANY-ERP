-- TH COMPANY ERP — auth, empresas e isolamento multiempresa
-- Execute no SQL Editor do projeto Supabase antes de habilitar cadastro/login.

create extension if not exists pgcrypto;

create table if not exists public.companies (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(trim(name)) between 2 and 120),
  slug text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists public.company_memberships (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  full_name text not null default '',
  role text not null default 'owner' check (role in ('owner', 'admin', 'employee')),
  created_at timestamptz not null default now(),
  unique (company_id, user_id)
);

create index if not exists company_memberships_user_id_idx
  on public.company_memberships(user_id);
create index if not exists company_memberships_company_id_idx
  on public.company_memberships(company_id);

alter table public.companies enable row level security;
alter table public.company_memberships enable row level security;

-- Usuários só podem consultar empresas das quais são membros.
drop policy if exists "members can read their company" on public.companies;
create policy "members can read their company"
  on public.companies for select to authenticated
  using (
    exists (
      select 1 from public.company_memberships m
      where m.company_id = companies.id and m.user_id = (select auth.uid())
    )
  );

-- A política inicial expõe somente o próprio vínculo do usuário.
drop policy if exists "users can read their own membership" on public.company_memberships;
create policy "users can read their own membership"
  on public.company_memberships for select to authenticated
  using (user_id = (select auth.uid()));

-- Empresa e vínculo inicial são criados no servidor quando o usuário se cadastra.
-- O cliente não recebe permissão para inserir/alterar empresas ou atribuir funções.
create or replace function public.handle_new_user_company()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  company_name text;
  clean_slug text;
  new_company_id uuid;
begin
  company_name := trim(coalesce(new.raw_user_meta_data ->> 'company_name', ''));
  if char_length(company_name) < 2 then
    return new;
  end if;

  clean_slug := trim(both '-' from regexp_replace(lower(company_name), '[^a-z0-9]+', '-', 'g'));
  if clean_slug = '' then
    clean_slug := 'empresa';
  end if;

  insert into public.companies (name, slug)
  values (company_name, clean_slug || '-' || substr(replace(new.id::text, '-', ''), 1, 8))
  returning id into new_company_id;

  insert into public.company_memberships (company_id, user_id, full_name, role)
  values (
    new_company_id,
    new.id,
    trim(coalesce(new.raw_user_meta_data ->> 'full_name', '')),
    'owner'
  );

  return new;
end;
$$;

drop trigger if exists on_auth_user_created_company on auth.users;
create trigger on_auth_user_created_company
after insert on auth.users
for each row execute procedure public.handle_new_user_company();

-- Não conceder permissões de escrita direta ao cliente.
revoke insert, update, delete on public.companies from anon, authenticated;
revoke insert, update, delete on public.company_memberships from anon, authenticated;
grant select on public.companies to authenticated;
grant select on public.company_memberships to authenticated;
