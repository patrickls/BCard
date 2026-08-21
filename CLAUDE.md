

> Contexto operacional do projeto para o Claude Code. Este arquivo é o contrato de trabalho entre o time e a IA: define stack, arquitetura e convenções. Tudo que não estiver aqui, a IA deve perguntar antes de assumir.

## 0. Diretriz de Pesquisa

- Sempre que precisar pesquisar algo no projeto (código, arquitetura, relação entre arquivos), olhe para o **graphify** antes de outras formas de busca.

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
- Row Level Security (RLS) do Supabase **fica ativado, sem nenhuma policy**, em todas as tabelas de negócio (`users`, `verbs`). Isso bloqueia por padrão o acesso via PostgREST (roles `anon`/`authenticated` — inclusive alguém que extraia a `SUPABASE_ANON_KEY` pública do bundle do frontend). O backend não é afetado: o TypeORM conecta via `DATABASE_URL` usando o role `postgres` do Supabase, que tem `BYPASSRLS`, então a autorização continua sendo feita inteiramente na camada Service — ver seção 14 (2026-08-19). **Nunca** criar policies nessas tabelas nem desativar o RLS sem atualizar esta seção — qualquer uma das duas reabre o acesso direto e duplica a autorização entre Postgres e Service.

## 8. Autenticação e Autorização

- **Autenticação:** Supabase Auth (login, refresh token e recuperação de senha ficam a cargo do Supabase — não reimplementar).
- **Frontend:** Angular usa `@supabase/supabase-js` **somente** para o fluxo de login/sessão. Todo o resto (CRUD de negócio) chama a API do Express normalmente, nunca o Supabase direto.
- **Backend:** middleware de auth no Express valida o JWT emitido pelo Supabase via JWKS (`jwks-rsa`, chave pública buscada em `${SUPABASE_URL}/auth/v1/.well-known/jwks.json`, algoritmo ES256) — este projeto usa o sistema novo de signing keys assimétricas do Supabase, não o `SUPABASE_JWT_SECRET` (HS256) legado. A partir daí, segue o fluxo MCS normal — a autorização (o que o usuário pode fazer) é regra de negócio e vive no Service, não no Supabase.
- Guard equivalente no Angular (`AuthGuard` + `HttpInterceptor` para anexar o token nas chamadas ao backend Express).

## 9. Testes

(a validar — não informado)

Sugestão:

- Backend: Jest, testando Services isoladamente (mockando Repository) + testes de integração de rota com supertest.
- Frontend: Jest ou o padrão Jasmine/Karma do Angular CLI, conforme a versão do Angular.

## 10. Git e Commits

(a validar: convenção de branch e commit)

Sugestão: Conventional Commits (`feat:`, `fix:`, `chore:`, `refactor:`) + branches `feature/`, `fix/`, `chore/`.

**Regra dura — push:** nenhum `git push` (nem `--force`) deve ser executado sem o Patrick pedir isso explicitamente naquela interação. Autorização dada no passado não vale para o próximo push — cada push precisa de pedido novo e específico.

## 11. Variáveis de Ambiente

`.env` fora do controle de versão, com `.env.example` versionado. Mínimo esperado:

```
DATABASE_URL=
PORT=
NODE_ENV=
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

- `SUPABASE_SERVICE_ROLE_KEY` está listada no `.env.example` mas o backend **não a lê no código** — a conexão real é via `DATABASE_URL` (role `postgres`, que já tem `BYPASSRLS`, ver seção 7). Mesmo assim, **nunca** expor essa chave no frontend nem em código versionado, caso passe a ser usada.
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
- Desativar RLS ou criar policies numa tabela de negócio sem atualizar a seção 7 — reabre o acesso público via PostgREST ou gera autorização duplicada entre Postgres e Service.
- Expor `SUPABASE_SERVICE_ROLE_KEY` no frontend ou em código versionado.

## 14. Histórico — o que já foi tentado e deu errado

(a preencher conforme o projeto avança — este é o campo mais valioso do arquivo: toda vez que um output sair ruim, a causa raiz vira uma linha aqui.)

- **2026-08-11 — JWT do Supabase não usa `SUPABASE_JWT_SECRET`:** o projeto Supabase (`lsyyjvqbdgucblsiyzer`) já nasceu no sistema novo de API keys (`sb_publishable_...` / `sb_secret_...`) e de signing keys assimétricas (ES256). Não existe um "JWT Secret" HS256 tradicional pra copiar em Settings → API → JWT Settings — só o Key ID (formato UUID) das signing keys. A validação do JWT no backend usa JWKS (`jwks-rsa`, endpoint `${SUPABASE_URL}/auth/v1/.well-known/jwks.json`) — ver seção 8. Se um projeto Supabase mais antigo (chaves legacy `anon`/`service_role`) for usado no futuro, essa lógica pode precisar voltar a um secret estático.
- **2026-08-11 — Pooler do Supabase não aparecia em Settings → Database:** nesse projeto a connection string do pooler só apareceu depois de acessar diretamente `/settings/database` e trocar o seletor de modo (Direct/Transaction/Session). Por padrão a tela mostrava só a conexão direta. A porta **6543** é a transaction pooler (usada em `DATABASE_URL`); porta **5432** no mesmo host `aws-0-<região>.pooler.supabase.com` é a session pooler — mesmo host, porta diferente.
- **2026-08-19 — RLS desativado expunha `users`/`verbs` via PostgREST com a anon key pública:** a decisão original da seção 7 ("RLS fica desativado, autorização é do Service") partia da premissa de que ninguém acessa o Postgres fora do Express. Só que a `SUPABASE_ANON_KEY`/`sb_publishable_...` embutida no bundle do Angular (`frontend/src/environments/environment.ts`) é pública por definição — qualquer um consegue copiá-la do DevTools. Com RLS desligado, essa chave dava acesso de leitura/escrita/delete direto via PostgREST (`{SUPABASE_URL}/rest/v1/users`), contornando o Express e a autorização do Service inteiramente. O Supabase sinalizou isso automaticamente ("Table publicly accessible"). Correção aplicada: `ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;` e o mesmo para `verbs`, **sem criar nenhuma policy** (deny-all para `anon`/`authenticated`). Confirmado via query direta em `pg_class` (`relrowsecurity = true`, `pg_policies` vazio) que o fix pegou e que o backend não quebrou — o TypeORM conecta com o role `postgres`, que tem `BYPASSRLS`, então o Express nunca passou pelo PostgREST. Lição: RLS desativado só é seguro se a anon key nunca for exposta a um client público — num app com frontend, ela sempre é, então a regra da seção 7 estava incompleta desde o início.