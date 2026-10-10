-- TH COMPANY ERP — reforço não destrutivo das permissões multiempresa 
-- Etapa 3.1. Este arquivo complementa 001_auth_multitenancy.sql.
-- Revise antes de executar manualmente no SQL Editor do Supabase.
--
-- Não apaga tabelas, empresas, usuários, vínculos ou registros.
-- Não altera o proprietário atual nem recria a empresa TH COMPANY.
--
-- Objetivos:
-- 1) Garantir que clientes públicos/autenticados não escrevam diretamente
--    nas tabelas de empresas e vínculos.
-- 2) Manter leitura autenticada somente conforme as políticas RLS existentes.
-- 3) Impedir que a função de trigger seja chamada diretamente pelo cliente.
--
-- IMPORTANTE:
-- A função handle_new_user_company continua executando pelo trigger instalado
-- em auth.users. Revogar EXECUTE de usuários da aplicação não remove o trigger.
-- A função já usa SECURITY DEFINER e search_path vazio na migração 001.

begin;

-- RLS deve permanecer habilitada nas duas tabelas.
alter table public.companies enable row level security;
alter table public.company_memberships enable row level security;

-- Remover permissões diretas, inclusive privilégios herdados via PUBLIC,
-- e conceder somente SELECT ao papel autenticado. RLS continua filtrando linhas.
revoke all privileges on table public.companies
  from public, anon, authenticated;

revoke all privileges on table public.company_memberships
  from public, anon, authenticated;

grant select on table public.companies to authenticated;
grant select on table public.company_memberships to authenticated;

-- A criação automática deve ocorrer pelo trigger do banco, não por chamada
-- direta do navegador/cliente autenticado.
revoke all privileges on function public.handle_new_user_company()
  from public, anon, authenticated;

-- Confirmações pós-migração (somente leitura; não alteram dados):
-- select relname, relrowsecurity
-- from pg_class
-- where oid in ('public.companies'::regclass,
--               'public.company_memberships'::regclass);
--
-- select grantee, table_name, privilege_type
-- from information_schema.role_table_grants
-- where table_schema = 'public'
--   and table_name in ('companies', 'company_memberships')
--   and grantee in ('PUBLIC', 'anon', 'authenticated')
-- order by table_name, grantee, privilege_type;
--
-- Conferir também em Authentication/Users e nas tabelas do Table Editor
-- que a empresa e o vínculo existentes continuam presentes.

commit;
