# TH COMPANY ERP

ERP SaaS da TH COMPANY para bares, distribuidoras de bebidas e restaurantes.

## Status atual

**Etapa 2 — fundação de autenticação e empresas.** O frontend inclui telas de cadastro, login e recuperação de senha, cliente Supabase configurável e uma migração SQL inicial para empresas e vínculos de usuários. O dashboard ainda é demonstrativo: vendas, estoque, caixa, financeiro, relatórios e indicadores não executam operações reais.

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
3. No painel do Supabase, abra **SQL Editor** e execute o arquivo `supabase/migrations/001_auth_multitenancy.sql`.
4. Em **Authentication → URL Configuration**, configure a URL local `http://localhost:5173` e as URLs de produção autorizadas.
5. Inicie a aplicação:

   ```bash
   npm run dev
   ```

6. Para validar a compilação:

   ```bash
   npm run build
   ```

## O que foi preparado na Etapa 2

- Cadastro de conta com nome do responsável e nome da empresa.
- Login com e-mail e senha.
- Solicitação de recuperação de senha por e-mail.
- Criação da empresa e do vínculo inicial como proprietário por um trigger no banco.
- Tabelas `companies` e `company_memberships`, com RLS habilitada.
- Políticas iniciais para leitura da própria empresa e do próprio vínculo.
- Configuração local por variáveis de ambiente; nenhuma chave real está incluída no repositório.

## Limites importantes

- A autenticação só funcionará depois de criar e configurar um projeto Supabase e aplicar a migração SQL.
- Se a confirmação de e-mail estiver habilitada, a pessoa precisará confirmar o e-mail antes de entrar.
- A migração cria o papel inicial `owner`; gestão de convites, administração de funcionários e telas de permissões ainda não foram implementadas.
- O isolamento está preparado para as tabelas de empresas e vínculos. Cada nova tabela de negócio deverá ter `company_id`, RLS e testes próprios antes de guardar dados reais.
- Os números do dashboard são demonstrativos, não dados de vendas reais.
- Não inclua a chave `service_role`, senhas, tokens ou outros segredos no frontend ou no GitHub.

## Próximas etapas propostas

1. Configurar o projeto Supabase e testar cadastro, confirmação de e-mail, login e recuperação de senha.
2. Implementar administração de usuários e permissões por empresa.
3. Criar produtos e estoque com políticas RLS e testes de isolamento.
4. Implementar vendas, caixa e financeiro com testes.

## Estrutura relevante

- `src/App.tsx` — telas de autenticação e dashboard demonstrativo
- `src/lib/supabase.ts` — cliente Supabase
- `src/auth.css` — estilos de autenticação e configuração
- `src/styles.css` — identidade visual e layout responsivo
- `supabase/migrations/001_auth_multitenancy.sql` — esquema inicial e políticas RLS
- `.env.example` — modelo de configuração local sem segredos reais
