# Graph Report - .  (2026-08-17)

## Corpus Check
- 35 files · ~93,502 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 411 nodes · 468 edges · 45 communities (21 shown, 24 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 16 edges (avg confidence: 0.76)
- Token cost: 272,003 input · 0 output

## Community Hubs (Navigation)
- Backend User/Verb Controllers
- Frontend Auth & Users Feature
- Frontend Flashcard Study UI
- Backend App Core & Services
- Angular Build Configuration
- Frontend Build Tooling Deps
- Backend Express Dependencies
- Backend TypeScript Config
- Flashcard PRD-to-UI Mapping
- Angular Framework Dependencies
- Backend Package Scripts
- Backend Dev Dependencies
- Angular CLI Workspace Config
- Verb Entity & Service
- Vercel Serverless Handler
- Migration: Create Verbs Table
- Migration: Create Users Table
- Migration: Add List Column
- Migration: Fix Verb Labels
- Migration: Set List By Infinitive
- Project Architecture Notes
- MCS Layer Rules
- PRD Scope & Trade-offs
- Backend Vercel Config
- Supabase Auth History Notes
- Bronze/Gold Medal Badges
- PRD Active Recall Rationale
- Silver Medal Badge
- Trophy Badge
- Frontend Prod Environment
- Frontend Vercel Config
- Verb Entity Column Decorator
- Verb Entity CreateDate Decorator
- Verb Entity Decorator
- Verb Entity PrimaryKey Decorator
- Verb Entity UpdateDate Decorator
- API Response Format Convention
- Env Vars Convention
- Git Push Authorization Rule
- Pills Stock Image
- Frontend Vitest Testing Note
- App Root Template
- Verb Service Injectable
- Users List Template
- README Project Overview

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 16 edges
2. `VerbEntity` - 13 edges
3. `FlashcardsComponent` - 12 edges
4. `FlashcardItemComponent` - 11 edges
5. `VerbService` - 10 edges
6. `scripts` - 9 edges
7. `AuthService` - 8 edges
8. `UsersService` - 8 edges
9. `UserService` - 8 edges
10. `FlashcardsComponent Template Root` - 8 edges

## Surprising Connections (you probably didn't know these)
- `Seletor de Escopo (Lista 1 / Lista 2 / Todos)` --conceptually_related_to--> `selectList() scope selector handler`  [INFERRED]
  Documentacao/PRD — Painel de Flashcards de Verbos Irregulares.md → frontend/src/app/features/flashcards/flashcards.component.html
- `Regra de Não Repetição de Verbos por Escopo` --conceptually_related_to--> `selectList() scope selector handler`  [INFERRED]
  Documentacao/PRD — Painel de Flashcards de Verbos Irregulares.md → frontend/src/app/features/flashcards/flashcards.component.html
- `Normalização de Resposta (case/espaços/prefixo 'to')` --conceptually_related_to--> `onInputChange() input handler`  [INFERRED]
  Documentacao/PRD — Painel de Flashcards de Verbos Irregulares.md → frontend/src/app/features/flashcards/components/flashcard-item/flashcard-item.component.html
- `Placar da Rodada (X/9)` --conceptually_related_to--> `roundScore() score binding`  [INFERRED]
  Documentacao/PRD — Painel de Flashcards de Verbos Irregulares.md → frontend/src/app/features/flashcards/flashcards.component.html
- `RF03/RF04: Virar Card e Correção Automática` --conceptually_related_to--> `Gabarito Result Display (translationCorrect/pastSimpleCorrect/pastParticipleCorrect)`  [INFERRED]
  Documentacao/PRD — Painel de Flashcards de Verbos Irregulares.md → frontend/src/app/features/flashcards/components/flashcard-item/flashcard-item.component.html

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **MCS Architecture (Controller-Service-Model)** — claude_controller_layer, claude_service_layer, claude_model_layer [EXTRACTED 1.00]
- **Card Flip & Auto-Correction Flow** — documentacao_prd_painel_de_flashcards_de_verbos_irregulares_rf_flip_and_correction, frontend_src_app_features_flashcards_components_flashcard_item_flashcard_item_component_toggleflip, frontend_src_app_features_flashcards_components_flashcard_item_flashcard_item_component_result_display, frontend_src_app_features_flashcards_components_flashcard_item_flashcard_item_component_oninputchange [INFERRED 0.85]
- **List Scope Selection & No-Repeat Cycle** — documentacao_prd_painel_de_flashcards_de_verbos_irregulares_escopo_selecao_lista, documentacao_prd_painel_de_flashcards_de_verbos_irregulares_regra_nao_repeticao, frontend_src_app_features_flashcards_flashcards_component_selectlist [INFERRED 0.85]
- **Angular Component Composition Flow (index.html → app-root → flashcards dashboard → flashcard-item)** — frontend_src_app_app_html_approot [INFERRED 0.85]

## Communities (45 total, 24 thin omitted)

### Community 0 - "Backend User/Verb Controllers"
Cohesion: 0.07
Nodes (21): UserController, validateDto(), VerbController, CreateUserDto, IsEmail, IsString, Length, IsEmail (+13 more)

### Community 1 - "Frontend Auth & Users Feature"
Cohesion: 0.09
Nodes (15): App, appConfig, routes, Component, authGuard(), authInterceptor(), AuthService, Injectable (+7 more)

### Community 2 - "Frontend Flashcard Study UI"
Cohesion: 0.10
Nodes (12): VerbService, FlashcardItemComponent, Component, FlashcardsComponent, Component, CardAnswers, FieldResult, FlashcardState (+4 more)

### Community 3 - "Backend App Core & Services"
Cohesion: 0.10
Nodes (14): allowedOrigins, app, AppDataSource, isMigrationRun, errorHandler(), HttpError, Column, CreateDateColumn (+6 more)

### Community 4 - "Angular Build Configuration"
Cohesion: 0.08
Nodes (28): build, serve, test, builder, configurations, defaultConfiguration, options, development (+20 more)

### Community 5 - "Frontend Build Tooling Deps"
Cohesion: 0.07
Nodes (26): @angular/build, @angular/cli, @angular/compiler-cli, typescript, devDependencies, @angular/build, @angular/cli, @angular/compiler-cli (+18 more)

### Community 6 - "Backend Express Dependencies"
Cohesion: 0.09
Nodes (23): dependencies, class-transformer, class-validator, cors, dotenv, express, helmet, jsonwebtoken (+15 more)

### Community 7 - "Backend TypeScript Config"
Cohesion: 0.09
Nodes (22): compilerOptions, emitDecoratorMetadata, esModuleInterop, experimentalDecorators, forceConsistentCasingInFileNames, lib, module, moduleResolution (+14 more)

### Community 8 - "Flashcard PRD-to-UI Mapping"
Cohesion: 0.10
Nodes (23): Critérios de Aceite, Seletor de Escopo (Lista 1 / Lista 2 / Todos), Métricas de Sucesso, Normalização de Resposta (case/espaços/prefixo 'to'), Placar da Rodada (X/9), Regra de Não Repetição de Verbos por Escopo, RF03/RF04: Virar Card e Correção Automática, RF05: Nova Rodada (+15 more)

### Community 9 - "Angular Framework Dependencies"
Cohesion: 0.11
Nodes (19): @angular/common, @angular/compiler, @angular/core, @angular/forms, @angular/platform-browser, @angular/router, dependencies, @angular/common (+11 more)

### Community 10 - "Backend Package Scripts"
Cohesion: 0.12
Nodes (16): description, engines, node, main, name, private, scripts, build (+8 more)

### Community 11 - "Backend Dev Dependencies"
Cohesion: 0.13
Nodes (15): devDependencies, eslint, ts-node, tsx, @types/cors, @types/express, @types/jsonwebtoken, @types/node (+7 more)

### Community 12 - "Angular CLI Workspace Config"
Cohesion: 0.13
Nodes (14): cli, packageManager, prefix, projectType, root, schematics, sourceRoot, newProjectRoot (+6 more)

### Community 13 - "Verb Entity & Service"
Cohesion: 0.24
Nodes (7): VerbEntity, VerbService, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn

### Community 14 - "Vercel Serverless Handler"
Cohesion: 0.67
Nodes (3): { AppDataSource }, ensureDataSourceInitialized(), handler()

### Community 20 - "Project Architecture Notes"
Cohesion: 0.50
Nodes (4): Anti-patterns (Proibido), Supabase Pooler Connection String Discovery Issue, MCS Architecture (Model-Controller-Service), Supabase-hosted PostgreSQL

### Community 21 - "MCS Layer Rules"
Cohesion: 0.50
Nodes (4): Controller Layer, Model Layer (TypeORM Entities), RLS Disabled on Business Tables (rationale), Service Layer

### Community 22 - "PRD Scope & Trade-offs"
Cohesion: 0.50
Nodes (4): Escopo Negativo (O que NÃO fazemos), Riscos e Mitigações, Timeline e Fases (MVP, Validação, Instrumentação, Expansão), Trade-offs: Simplicidade do MVP vs Personalização/Persistência

### Community 24 - "Supabase Auth History Notes"
Cohesion: 0.67
Nodes (3): Supabase New Asymmetric Signing Keys (No Legacy JWT Secret), JWT Validation via JWKS (ES256), Supabase Auth

### Community 25 - "Bronze/Gold Medal Badges"
Cohesion: 0.67
Nodes (3): Sistema de Níveis de Sessão de Estudos (Badges), Medalha Bronze (session-levels), Medalha Ouro (Gold Medal Image)

### Community 26 - "PRD Active Recall Rationale"
Cohesion: 0.67
Nodes (3): Active Recall / Testing Effect, JTBD: Testar Conjugação de Verbo Irregular, Persona: Estudante de Inglês Básico/Intermediário

## Knowledge Gaps
- **142 isolated node(s):** `router`, `controller`, `controller`, `target`, `module` (+137 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **24 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `devDependencies` connect `Backend Dev Dependencies` to `Backend Package Scripts`, `Frontend Build Tooling Deps`?**
  _High betweenness centrality (0.037) - this node is a cross-community bridge._
- **Why does `typescript` connect `Frontend Build Tooling Deps` to `Backend Dev Dependencies`?**
  _High betweenness centrality (0.030) - this node is a cross-community bridge._
- **What connects `router`, `controller`, `controller` to the rest of the system?**
  _142 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Backend User/Verb Controllers` be split into smaller, more focused modules?**
  _Cohesion score 0.07207207207207207 - nodes in this community are weakly interconnected._
- **Should `Frontend Auth & Users Feature` be split into smaller, more focused modules?**
  _Cohesion score 0.08558558558558559 - nodes in this community are weakly interconnected._
- **Should `Frontend Flashcard Study UI` be split into smaller, more focused modules?**
  _Cohesion score 0.09803921568627451 - nodes in this community are weakly interconnected._
- **Should `Backend App Core & Services` be split into smaller, more focused modules?**
  _Cohesion score 0.09852216748768473 - nodes in this community are weakly interconnected._