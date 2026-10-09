# TH COMPANY ERP

ERP SaaS da TH COMPANY para bares, distribuidoras de bebidas e restaurantes.

## Status atual

**Etapa 3.1 preparada no GitHub — ainda não aplicada no Supabase.** O frontend inclui cadastro, login e recuperação de senha. A migração inicial cria empresas e vínculos de usuários; a migração complementar 002 reforça as permissões diretas das tabelas. O dashboard ainda é demonstrativo: vendas, estoque, caixa, financeiro, relatórios e indicadores não executam operações reais.

## Tecnologias

- React + TypeScript + Vite
- Supabase Auth e PostgreSQL com Row Level Security (RLS)
- CSS responsivo com identidade visual preto, dourado e cinza
- GitHub para versionamento

## Requisitos

- Node.js 20 ou superior
- npm
- Projeto Supabase criado pelo responsável pela implantação

## Configuração local

1. Instale as dependências:

   ```bash
   npm install
   ```

2. Copie `.env.example` para `.env` e preencha `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` com os dados públicos do seu projeto Supabase.
3. No painel do Supabase, abra **SQL Editor** e confira primeiro se as migrações já foram aplicadas. Em uma instalação nova, execute `supabase/migrations/001_auth_multitenancy.sql` e, em seguida, `supabase/migrations/002_security_hardening.sql`.
4. **Se o projeto já estiver em uso**, não execute novamente o cadastro inicial como se fosse uma instalação nova. A migração 002 é complementar e não apaga empresas, usuários ou vínculos, mas revise-a antes de executá-la no projeto real.
5. Em **Authentication → URL Configuration**, configure a URL local `http://localhost:5173` e as URLs de produção autorizadas.
6. Inicie a aplicação:

   ```bash
   npm run dev
   ```

7. Para validar a compilação:

   ```bash
   npm run build
   ```

## O que foi preparado

- Cadastro de conta com nome do responsável e nome da empresa.
- Login com e-mail e solicitação de recuperação de senha.
- Criação da empresa e do vínculo inicial como proprietário por um trigger no banco.
- Tabelas `companies` e `company_memberships`, com RLS habilitada.
- Migração complementar `002_security_hardening.sql`, que remove privilégios diretos de escrita dos papéis `PUBLIC`, `anon` e `authenticated` nas tabelas de empresas e vínculos, concede leitura ao papel autenticado e revoga a execução direta da função de trigger para esses papéis.
- A migração complementar não apaga nem recria dados existentes. Ela **não foi aplicada automaticamente** no Supabase.
- Configuração local por variáveis de ambiente.

## Limites e segurança

- A chave pública/publishable do Supabase pode estar no frontend; nunca inclua a chave `service_role` ou qualquer chave secreta no frontend ou no GitHub.
- A migração 002 não substitui as políticas RLS existentes. Ela reforça privilégios de tabela, mas não representa por si só um teste de isolamento de ponta a ponta.
- O carregamento atual do painel depende da leitura do vínculo e da empresa pela sessão autenticada.
- A migração cria o papel inicial `owner`; convites, administração de funcionários e telas de permissões ainda não foram implementados.
- Antes de guardar dados reais, cada tabela operacional deve ter `company_id`, RLS e testes que comprovem que uma empresa não lê nem altera dados de outra.
- Os números do dashboard são demonstrativos, não dados de vendas reais.

## Próximas etapas propostas

1. Aplicar e validar a migração complementar 002 no projeto Supabase, após revisão e conferência do estado atual.
2. Testar login, carregamento da empresa TH COMPANY e isolamento entre duas empresas de teste sem mexer nos dados reais.
3. Implementar administração de usuários e permissões por empresa.
4. Criar produtos e estoque com políticas RLS e testes de isolamento.
5. Implementar vendas, caixa e financeiro com testes.

## Estrutura relevante

- `src/App.tsx` — telas de autenticação e dashboard demonstrativo
- `src/lib/supabase.ts` — cliente Supabase
- `src/auth.css` — estilos de autenticação e configuração
- `src/styles.css` — identidade visual e layout responsivo
- `supabase/migrations/001_auth_multitenancy.sql` — esquema inicial e políticas RLS
- `supabase/migrations/002_security_hardening.sql` — reforço não destrutivo de permissões
- `.env.example` — modelo de configuração local
