# Questlog AI Coding Agent Instructions

Questlog is a social network for gamers (like Letterboxd for games) built as a modern monorepo with comprehensive type safety and future indie game showcase capabilities.

## Architecture Overview

**Monorepo Structure**: PNPM workspace with apps (`backend`, `frontend`, `e2e`) and shared packages (`shared-types`, `ui-components`, `utils`, `config`, `game-apis`)

**Backend**: NestJS with Prisma ORM, PostgreSQL, JWT auth with refresh tokens, and global guards. Modular domain architecture: auth, users, games (with developers/publishers/genres/platforms), reviews, and social features.

**Frontend**: Astro (SSG/SSR) with React Islands for interactivity, Tailwind CSS v4, and Nanostores for state management

**Type Safety**: `@questlog/shared-types` package provides complete API contracts with `*Request`, `*Response`, and `*Query` types for all endpoints

## Essential Development Commands

```bash
# Development (localhost:3001 backend, localhost:4321 frontend)
pnpm dev                    # Start both backend and frontend
pnpm dev:backend           # Backend only with hot reload
pnpm dev:frontend          # Frontend only with hot reload

# Database (Prisma commands)
pnpm db:migrate            # Create and run migrations
pnpm db:seed               # Seed with test data
pnpm db:studio             # Open Prisma Studio GUI
pnpm db:reset              # Reset database (destructive)

# Docker Development Stack
pnpm docker:dev            # Start Postgres, Redis, MinIO, MailHog, Adminer
pnpm docker:dev:logs       # View container logs
pnpm docker:dev:down       # Stop containers

# Testing & Quality
pnpm test                  # Run all tests
pnpm test:e2e              # E2E tests with Cypress
pnpm lint                  # ESLint across all packages
pnpm format                # Prettier formatting
```

## Key Architectural Patterns

### Backend Patterns

**Global Guards**: All endpoints require JWT auth by default. Use `@Public()` decorator for unprotected routes like game listings.

**Dual-Token Auth**: Access tokens (7 days) + refresh tokens (30 days) with JWT strategy. `JwtAuthGuard`, `JwtRefreshGuard`, and `LocalAuthGuard` handle different auth flows.

**Module Structure**: Domain-driven with dedicated modules: `auth/`, `users/`, `games/` (with submodules for developers/publishers/genres/platforms), `reviews/`, `social/`. Each has controller, service, DTOs, constants, guards.

**Error Handling**: Global `HttpExceptionFilter` in `src/common/filters/` maps Prisma errors to user-friendly messages with consistent JSON responses.

**Database**: Comprehensive Prisma schema with CUID IDs, cascade deletes, optimized indexes. Key entities: User, Game, Review, Follow, Like, Comment with many-to-many relationships via junction tables.

**Role-Based Access**: USER/ADMIN/MODERATOR roles with `@Roles()` decorator. Admin-only routes for user management, moderator routes for content management.

### Frontend Patterns

**Static + Interactive**: Astro SSG for game profiles, user profiles, and static pages. React Islands for dynamic components (feed, forms, search, social interactions).

**Type Safety**: Always import from `@questlog/shared-types` - provides `LoginRequest`, `GameResponse`, `ReviewsQuery`, etc. Package organized by domain (auth/, games/, reviews/, social/).

**State Management**: Nanostores for global state (user session, theme), React state for local component state.

**Styling**: Tailwind CSS v4 with utility-first approach and custom component library.

### Cross-Package Patterns

**Shared Types System**: Complete API contracts in `@questlog/shared-types` with Request/Response/Query types for every endpoint. Frontend and backend must use same types.

**Development Workflow**: Schema changes → `pnpm db:migrate` → rebuild shared-types → update frontend usage. Always maintain type safety across the stack.

## Development Workflow

1. **Database Changes**: Update `schema.prisma` → run `pnpm db:migrate` → regenerate types
2. **API Changes**: Update backend DTOs → rebuild `shared-types` → update frontend usage
3. **New Features**: Create backend module → add types to shared-types → implement frontend
4. **Authentication**: Most routes protected by default, use `@Public()` for public access
5. **Testing**: E2E tests in `apps/e2e`, unit tests with Jest, integration with Supertest

## External Integrations

**Game Data**: Designed for RAWG API, IGDB, and Steam integration (credentials in docker-compose)
**Storage**: MinIO for S3-compatible file storage
**Caching**: Redis for sessions and performance
**Email**: MailHog for development email testing

## Testing & Quality

- E2E tests in dedicated `apps/e2e` package with Cypress
- Global ESLint config in `packages/config/eslint`
- Prettier formatting across all packages
- TypeScript strict mode enabled
- Comprehensive input validation with class-validator

## Important File Locations

- Database schema: `apps/backend/prisma/schema.prisma`
- Backend modules: `apps/backend/src/{auth,users,games,reviews,social}/`
- Shared types: `packages/shared-types/src/`
- Docker config: `docker-compose.dev.yml` (development), `docker-compose.prod.yml` (production)
- Global guards and filters: `apps/backend/src/common/`
- Auth strategies: `apps/backend/src/auth/strategies/` (JWT, Local, Refresh)

Focus on type safety, modular architecture, and leveraging the comprehensive shared types system for all API interactions.
