# Graph Report - .  (2026-08-11)

## Corpus Check
- Corpus is ~8,243 words - fits in a single context window. You may not need a graph.

## Summary
- 318 nodes · 396 edges · 19 communities (16 shown, 3 thin omitted)
- Extraction: 95% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 17 edges (avg confidence: 0.85)
- Token cost: 75,063 input · 0 output

## Community Hubs (Navigation)
- Backend API & Routing
- Flashcards Feature (Frontend)
- Angular Build Config
- Frontend Build Toolchain
- Backend TypeScript Config
- Frontend Auth & App Shell
- Backend Dependencies
- Frontend Dependencies
- Backend Package Scripts
- User Domain (Backend)
- Backend Dev Dependencies
- Angular Project Config
- Users Feature (Frontend)
- Verb Domain (Backend)
- Architecture Contract (CLAUDE.md)
- Product Spec & UI Templates
- Verbs Table Migration
- Testing Strategy
- PRD Metrics & Risks

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 16 edges
2. `UserEntity` - 12 edges
3. `VerbEntity` - 12 edges
4. `FlashcardItemComponent` - 10 edges
5. `scripts` - 9 edges
6. `UserService` - 9 edges
7. `VerbService` - 9 edges
8. `FlashcardsComponent` - 9 edges
9. `VerbService` - 8 edges
10. `AuthService` - 8 edges

## Surprising Connections (you probably didn't know these)
- `Frontend README — Angular CLI Setup & Vitest Test Runner` --semantically_similar_to--> `Testing Strategy Suggestion — Jest / Jasmine-Karma (a validar)`  [INFERRED] [semantically similar]
  frontend/README.md → CLAUDE.md
- `BCards Project README — Overview & Local Setup` --references--> `Environment Variables Contract (.env / .env.example)`  [INFERRED]
  README.md → CLAUDE.md
- `Monorepo Folder Structure (backend/ + frontend/, features/users example)` --conceptually_related_to--> `UsersComponent List Template`  [INFERRED]
  CLAUDE.md → frontend/src/app/features/users/users.component.html
- `FlashcardItemComponent Post-it Flip Card Template` --implements--> `Painel de Flashcards de Verbos Irregulares (Product Concept)`  [INFERRED]
  frontend/src/app/features/flashcards/components/flashcard-item/flashcard-item.component.html → Documentacao/PRD — Painel de Flashcards de Verbos Irregulares.md
- `FlashcardsComponent Dashboard Template` --implements--> `Painel de Flashcards de Verbos Irregulares (Product Concept)`  [INFERRED]
  frontend/src/app/features/flashcards/flashcards.component.html → Documentacao/PRD — Painel de Flashcards de Verbos Irregulares.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Angular Component Composition Flow (index.html → app-root → flashcards dashboard → flashcard-item)** — frontend_src_index_html_indexhtml, frontend_src_app_app_html_approot, frontend_src_app_features_flashcards_flashcards_component_html_dashboard, frontend_src_app_features_flashcards_components_flashcard_item_flashcard_item_component_html_card [INFERRED 0.85]
- **PRD Solution + Requirements Implemented by Flashcards Dashboard and Card Components** — documentacao_prd_painel_de_flashcards_de_verbos_irregulares_painel_de_flashcards, documentacao_prd_painel_de_flashcards_de_verbos_irregulares_functional_requirements, frontend_src_app_features_flashcards_flashcards_component_html_dashboard, frontend_src_app_features_flashcards_components_flashcard_item_flashcard_item_component_html_card [INFERRED 0.85]
- **Problem-to-Solution Rationale Chain (Persona/JTBD + Active Recall → Functional Requirements)** — documentacao_prd_painel_de_flashcards_de_verbos_irregulares_persona_jtbd, documentacao_prd_painel_de_flashcards_de_verbos_irregulares_active_recall, documentacao_prd_painel_de_flashcards_de_verbos_irregulares_functional_requirements [INFERRED 0.75]

## Communities (19 total, 3 thin omitted)

### Community 0 - "Backend API & Routing"
Cohesion: 0.08
Nodes (14): app, AppDataSource, isMigrationRun, UserController, VerbController, AuthenticatedRequest, authMiddleware(), errorHandler() (+6 more)

### Community 1 - "Flashcards Feature (Frontend)"
Cohesion: 0.12
Nodes (12): Injectable, VerbService, FlashcardItemComponent, Component, FlashcardsComponent, Component, CardAnswers, FieldResult (+4 more)

### Community 2 - "Angular Build Config"
Cohesion: 0.08
Nodes (27): build, serve, test, builder, configurations, defaultConfiguration, options, development (+19 more)

### Community 3 - "Frontend Build Toolchain"
Cohesion: 0.08
Nodes (25): @angular/build, @angular/cli, @angular/compiler-cli, devDependencies, @angular/build, @angular/cli, @angular/compiler-cli, jsdom (+17 more)

### Community 4 - "Backend TypeScript Config"
Cohesion: 0.09
Nodes (22): compilerOptions, emitDecoratorMetadata, esModuleInterop, experimentalDecorators, forceConsistentCasingInFileNames, lib, module, moduleResolution (+14 more)

### Community 5 - "Frontend Auth & App Shell"
Cohesion: 0.14
Nodes (9): App, appConfig, routes, Component, authGuard(), authInterceptor(), AuthService, Injectable (+1 more)

### Community 6 - "Backend Dependencies"
Cohesion: 0.10
Nodes (21): dependencies, class-transformer, class-validator, cors, dotenv, express, jsonwebtoken, jwks-rsa (+13 more)

### Community 7 - "Frontend Dependencies"
Cohesion: 0.11
Nodes (19): @angular/common, @angular/compiler, @angular/core, @angular/forms, @angular/platform-browser, @angular/router, dependencies, @angular/common (+11 more)

### Community 8 - "Backend Package Scripts"
Cohesion: 0.12
Nodes (16): description, engines, node, main, name, private, scripts, build (+8 more)

### Community 9 - "User Domain (Backend)"
Cohesion: 0.20
Nodes (7): Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn, UserEntity, UserService

### Community 10 - "Backend Dev Dependencies"
Cohesion: 0.13
Nodes (15): devDependencies, eslint, tsx, @types/cors, @types/express, @types/jsonwebtoken, @types/node, typescript (+7 more)

### Community 11 - "Angular Project Config"
Cohesion: 0.13
Nodes (14): cli, packageManager, prefix, projectType, root, schematics, sourceRoot, newProjectRoot (+6 more)

### Community 12 - "Users Feature (Frontend)"
Cohesion: 0.21
Nodes (6): Component, UsersComponent, User, ApiResponse, Injectable, UsersService

### Community 13 - "Verb Domain (Backend)"
Cohesion: 0.26
Nodes (7): Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn, VerbEntity, VerbService

### Community 14 - "Architecture Contract (CLAUDE.md)"
Cohesion: 0.24
Nodes (10): Anti-Patterns — Proibido (Section 13), CLAUDE.md — Contrato de Arquitetura do Projeto BCards, Environment Variables Contract (.env / .env.example), Monorepo Folder Structure (backend/ + frontend/, features/users example), Hard Rule — Controller Never Calls Repository/Model Directly, MCS (Model / Controller / Service) Backend Architecture, RLS Disabled on Business Tables — Authorization Lives in Service Layer, Not Postgres, Supabase Auth — Login/JWT Handling, Never Reimplemented (+2 more)

### Community 15 - "Product Spec & UI Templates"
Cohesion: 0.39
Nodes (8): Active Recall / Testing Effect — Rationale for Flip-to-Check Design, Requisitos Funcionais RF01–RF10, Painel de Flashcards de Verbos Irregulares (Product Concept), Persona — Estudante de Inglês Autônomo & JTBD, AppComponent Root Template (router-outlet), FlashcardItemComponent Post-it Flip Card Template, FlashcardsComponent Dashboard Template, index.html — Application Shell (app-root)

## Ambiguous Edges - Review These
- `AppComponent Root Template (router-outlet)` → `FlashcardsComponent Dashboard Template`  [AMBIGUOUS]
  frontend/src/app/app.html · relation: conceptually_related_to

## Knowledge Gaps
- **113 isolated node(s):** `name`, `version`, `private`, `description`, `main` (+108 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What is the exact relationship between `AppComponent Root Template (router-outlet)` and `FlashcardsComponent Dashboard Template`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **Why does `dependencies` connect `Backend Dependencies` to `Backend Package Scripts`?**
  _High betweenness centrality (0.016) - this node is a cross-community bridge._
- **Why does `devDependencies` connect `Backend Dev Dependencies` to `Backend Package Scripts`?**
  _High betweenness centrality (0.012) - this node is a cross-community bridge._
- **Why does `dependencies` connect `Frontend Dependencies` to `Frontend Build Toolchain`?**
  _High betweenness centrality (0.012) - this node is a cross-community bridge._
- **What connects `name`, `version`, `private` to the rest of the system?**
  _113 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Backend API & Routing` be split into smaller, more focused modules?**
  _Cohesion score 0.08377896613190731 - nodes in this community are weakly interconnected._
- **Should `Flashcards Feature (Frontend)` be split into smaller, more focused modules?**
  _Cohesion score 0.11954022988505747 - nodes in this community are weakly interconnected._