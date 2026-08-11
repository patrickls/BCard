# BCards

POC com backend Node.js/Express/TypeORM (padrão MCS) e frontend Angular, banco Postgres gerenciado pelo Supabase.

Contrato de arquitetura, convenções e decisões pendentes: ver [CLAUDE.md](./CLAUDE.md).

## Estrutura

```
backend/    API Express + TypeORM (Model / Controller / Service)
frontend/   Angular (core / shared / features)
```

## Rodando localmente

### Backend

```
cd backend
cp .env.example .env   # preencher com as credenciais do Supabase
npm install
npm run dev             # http://localhost:3000/health
```

### Frontend

```
cd frontend
npm install
npm start                # http://localhost:4200
```

## Pendências (ver CLAUDE.md, itens "a validar")

- Nome do produto, objetivo de negócio, público-alvo
- Versão do Angular e do Node em produção
- Estratégia de injeção de dependência no backend
- Soft delete vs. delete físico
- Convenção de branches/commits
