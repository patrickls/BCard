

> Contexto operacional do projeto para o Claude Code. Este arquivo é o contrato de trabalho entre o time e a IA: define stack, arquitetura e convenções. Tudo que não estiver aqui, a IA deve perguntar antes de assumir.

## 1. Visão Geral

- **Tipo de projeto:** POC — escopo pequeno/simples, sem necessidade de escala.
- **Backend:** Node.js + Express + TypeORM
- **Frontend:** Angular
- **Banco de dados:** PostgreSQL, hospedado no Supabase
- **Padrão arquitetural (backend):** MCS — Model / Controller / Service (mantido integralmente; Supabase é usado só como Postgres gerenciado + serviço de Auth, não como BaaS substituindo o backend)

(a validar: nome do produto, objetivo de negócio, público-alvo)

## 2. Stack Tecnológica

|Camada|Tecnologia|Observação|
|---|---|---|
|Runtime|Node.js|versão LTS — (a validar: qual major, ex. 20.x ou 22.x)|
|Framework backend|Express||
|ORM|TypeORM||
|Banco de dados|PostgreSQL (via Supabase)|instância gerenciada — ver seção 7|
|Autenticação|Supabase Auth|ver seção 8|
|Frontend|Angular|(a validar: qual versão)|
|Linguagem|TypeScript|assumido em ambos os lados — (a validar)|
|Gerenciador de pacotes|npm||

## 3. Arquitetura — Backend (MCS)

Fluxo de responsabilidade em uma via só, sem pular camadas:

```
Request → Controller → Service → Model (TypeORM Repository) → PostgreSQL (Supabase)
```

- **Model:** entidades TypeORM (`@Entity`). Só define shape de dados, relacionamentos e constraints. Sem lógica de negócio.
- **Controller:** recebe o request, valida input (formato), chama o Service, formata o response. Não acessa o repository diretamente e não contém regra de negócio.
- **Service:** contém toda a regra de negócio. Único ponto que fala com o repository (Model). Agnóstico de HTTP — não conhece `req`/`res`.

**Regra dura:** Controller nunca chama Repository/Model diretamente. Se isso acontecer, é violação de camada — corrigir, não normalizar.

## 4. Estrutura de Pastas

```
backend/
  src/
    controllers/
      user.controller.ts
    services/
      user.service.ts
    models/
      user.entity.ts
    routes/
      user.routes.ts
    migrations/
    config/
      database.ts
    middlewares/
    utils/
    app.ts
    server.ts

frontend/
  src/
    app/
      core/            # serviços singleton, guards, interceptors
      shared/           # componentes/pipes/diretivas reutilizáveis
      features/         # um módulo por feature (ex: users/, orders/)
        users/
          users.component.ts
          users.service.ts
          users.model.ts
```

Monorepo único: `backend/` e `frontend/` como pastas irmãs neste repositório.

## 5. Convenções de Código

- **Nomenclatura de arquivos:** `kebab-case`, sufixo por papel (`user.controller.ts`, `user.service.ts`, `user.entity.ts`).
- **Nomenclatura de classes:** `PascalCase` (`UserController`, `UserService`).
- **TypeScript:** `strict: true` no `tsconfig.json`. Sem `any` — se inevitável, justificar com comentário.
- **Um Controller/Service por recurso.** Não criar "God services".
- **Injeção de dependência:** (a validar — usar container de DI como `typedi`/`tsyringe`, ou instanciação manual simples dado que o projeto é pequeno?)

## 6. Padrões de API

- REST convencional: `GET /users`, `GET /users/:id`, `POST /users`, `PUT /users/:id`, `DELETE /users/:id`.
- Formato de resposta padronizado — sugestão:

```json
{ "data": {}, "error": null }
```

- Erros tratados em middleware central (`error-handler.middleware.ts`), nunca `try/catch` espalhado retornando formatos diferentes.
- Validação de payload na entrada do Controller — sugestão: `class-validator` (integra bem com TypeORM, já que ambos usam decorators) ou `zod`.
- Códigos HTTP semânticos (400 validação, 401/403 auth, 404 não encontrado, 409 conflito, 500 erro interno).

## 7. Banco de Dados

- Postgres gerenciado pelo Supabase. `DataSource` do TypeORM aponta para a connection string do Supabase (pooler na porta 6543 com pgbouncer para runtime; conexão direta na 5432 para rodar migrations).
- SSL obrigatório na conexão (`ssl: { rejectUnauthorized: false }`, ou o certificado fornecido pelo Supabase).
- Migrations do TypeORM continuam sendo a única forma de alterar schema — versionadas no repositório, **nunca** `synchronize: true` fora de ambiente local.
- Convenção de nomes de tabela: `snake_case`, plural (`users`, `order_items`).
- Toda entidade tem `id`, `created_at`, `updated_at`.
- (a validar: soft delete — coluna `deleted_at` — ou delete físico?)
- Row Level Security (RLS) do Supabase **fica desativado** nas tabelas de negócio: a autorização é responsabilidade da camada Service, não do Postgres. Ativar RLS sem alinhar com essa regra gera autorização duplicada e divergente.

## 8. Autenticação e Autorização

- **Autenticação:** Supabase Auth (login, refresh token e recuperação de senha ficam a cargo do Supabase — não reimplementar).
- **Frontend:** Angular usa `@supabase/supabase-js` **somente** para o fluxo de login/sessão. Todo o resto (CRUD de negócio) chama a API do Express normalmente, nunca o Supabase direto.
- **Backend:** middleware de auth no Express valida o JWT emitido pelo Supabase (via `SUPABASE_JWT_SECRET` ou verificação com a chave pública do projeto). A partir daí, segue o fluxo MCS normal — a autorização (o que o usuário pode fazer) é regra de negócio e vive no Service, não no Supabase.
- Guard equivalente no Angular (`AuthGuard` + `HttpInterceptor` para anexar o token nas chamadas ao backend Express).

## 9. Testes

(a validar — não informado)

Sugestão:

- Backend: Jest, testando Services isoladamente (mockando Repository) + testes de integração de rota com supertest.
- Frontend: Jest ou o padrão Jasmine/Karma do Angular CLI, conforme a versão do Angular.

## 10. Git e Commits

(a validar: convenção de branch e commit)

Sugestão: Conventional Commits (`feat:`, `fix:`, `chore:`, `refactor:`) + branches `feature/`, `fix/`, `chore/`.

## 11. Variáveis de Ambiente

`.env` fora do controle de versão, com `.env.example` versionado. Mínimo esperado:

```
DATABASE_URL=
PORT=
NODE_ENV=
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_JWT_SECRET=
```

- `SUPABASE_SERVICE_ROLE_KEY` é usada pelo backend (ignora RLS — aceitável aqui porque autorização já é feita no Service, ver seção 7). **Nunca** expor essa chave no frontend.
- `SUPABASE_ANON_KEY` é a única chave que o Angular deve conhecer, usada exclusivamente no client de Auth.

## 12. Comandos Úteis

(a validar — preencher depois de definir os scripts do `package.json`)

## 13. Anti-padrões — Proibido

- Controller acessando Repository/Model diretamente (pular a camada Service).
- Lógica de negócio dentro de Controller.
- `synchronize: true` do TypeORM em produção.
- `any` em TypeScript sem justificativa.
- Migrations não versionadas / alteração manual de schema em produção.
- Response de erro em formato inconsistente entre endpoints.
- Angular chamando a API REST automática do Supabase (PostgREST) ou o client `supabase-js` para CRUD de negócio — toda regra de negócio passa pelo Express/Service.
- Ativar RLS numa tabela de negócio sem atualizar esta seção — gera autorização duplicada entre Postgres e Service.
- Expor `SUPABASE_SERVICE_ROLE_KEY` no frontend ou em código versionado.

## 14. Histórico — o que já foi tentado e deu errado

(a preencher conforme o projeto avança — este é o campo mais valioso do arquivo: toda vez que um output sair ruim, a causa raiz vira uma linha aqui.)