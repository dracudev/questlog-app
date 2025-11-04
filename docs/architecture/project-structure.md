# Questlog - Project Structure

**Last Updated:** November 4, 2025

This document provides a comprehensive overview of the Questlog monorepo structure, explaining the organization of applications, packages, and supporting files.

## Repository Overview

Questlog uses a **PNPM monorepo** architecture with the following top-level structure:

```
questlog-app/
├── apps/          # Main applications (frontend, backend, e2e)
├── packages/      # Shared packages and libraries
├── docs/          # Project documentation
├── docker/        # Docker configuration files
├── scripts/       # Utility scripts
└── [config files] # Root configuration files
```

## Directory Structure

### Root Level Files

```
├── package.json                  # Root package.json with workspace scripts
├── pnpm-workspace.yaml          # PNPM workspace configuration
├── pnpm-lock.yaml               # PNPM lockfile
├── .gitignore                   # Git ignore rules
├── LICENSE                      # MIT License
├── README.md                    # Project overview and quick start
├── docker-compose.dev.yml       # Development environment setup
└── docker-compose.prod.yml      # Production environment setup
```

### `/apps` Directory

Main applications of the project:

#### `apps/backend/` - NestJS API Server

```
backend/
├── package.json
├── nest-cli.json
├── tsconfig.json
├── tsconfig.build.json
├── eslint.config.js
├── prisma/
│   ├── schema.prisma            # Database schema
│   ├── migrations/              # Database migrations
│   ├── seeds/                   # Database seed scripts
│   │   └── seed.ts
│   └── init.sql/               # Initial SQL scripts
└── src/
    ├── main.ts                  # Application entry point
    ├── app.module.ts            # Root module
    ├── auth/                    # Authentication & authorization
    │   ├── auth.module.ts
    │   ├── auth.service.ts
    │   ├── auth.controller.ts
    │   ├── strategies/          # Passport strategies
    │   ├── guards/             # Auth guards
    │   ├── decorators/         # Custom decorators
    │   ├── dto/                # Data transfer objects
    │   ├── interfaces/         # Type interfaces
    │   └── constants/          # Auth constants
    ├── users/                   # User management
    ├── games/                   # Game catalog
    │   ├── developers/         # Game developers
    │   ├── publishers/         # Game publishers
    │   ├── genres/            # Game genres
    │   └── platforms/         # Gaming platforms
    ├── reviews/                # Review system
    ├── social/                 # Social features
    ├── health/                 # Health check endpoints
    ├── common/                 # Shared utilities
    │   ├── constants/
    │   ├── dto/
    │   ├── filters/           # Exception filters
    │   └── interceptors/      # Response interceptors
    └── database/              # Database configuration
        ├── database.module.ts
        └── prisma.service.ts
```

#### `apps/frontend/` - Astro + React Application

```
frontend/
├── package.json
├── astro.config.mjs            # Astro configuration
├── tsconfig.json
├── eslint.config.js
├── public/                     # Static assets
│   ├── manifest.json
│   └── images/
└── src/
    ├── components/             # React components
    │   ├── ui/                # Base UI components
    │   ├── auth/              # Authentication
    │   ├── games/             # Game components
    │   ├── reviews/           # Review components
    │   ├── social/            # Social features
    │   ├── profile/           # Profile components
    │   └── layout/            # Layout components
    ├── pages/                 # Astro pages (routes)
    │   ├── index.astro        # Home page
    │   ├── feed/
    │   │   └── index.astro    # Activity feed
    │   ├── games/
    │   │   ├── index.astro    # Games catalog
    │   │   └── [slug].astro   # Game details
    │   ├── profile/
    │   │   └── [username].astro # User profiles
    │   ├── reviews/
    │   │   ├── index.astro    # Reviews listing
    │   │   └── [id].astro     # Review details
    │   └── auth/              # Auth pages
    │       ├── login.astro
    │       └── register.astro
    ├── layouts/               # Page layouts
    │   └── MainLayout.astro
    ├── stores/                # State management
    │   ├── auth.ts
    │   ├── games.ts
    │   ├── reviews.ts
    │   ├── social.ts
    │   └── users.ts
    ├── services/              # API client services
    │   ├── api.ts            # Base API client
    │   ├── auth.ts
    │   ├── games.ts
    │   ├── reviews.ts
    │   ├── social.ts
    │   └── users.ts
    ├── hooks/                 # React hooks
    │   ├── useAuth.ts
    │   ├── useGames.ts
    │   ├── useReviews.ts
    │   └── useSocial.ts
    ├── utils/                 # Utility functions
    ├── types/                 # Frontend-specific types
    ├── scripts/               # Client-side scripts
    │   └── client-redirect.ts
    └── styles/                # Global styles
        └── global.css
```

#### `apps/e2e/` - End-to-End Tests

```
e2e/
├── package.json
└── [test files]               # Future: Cypress/Playwright tests
```

### `/packages` Directory

Shared packages used across applications:

#### `packages/shared-types/` - TypeScript Type Definitions

```
shared-types/
├── package.json
├── tsconfig.json
├── README.md
└── src/
    ├── index.ts              # Barrel exports
    ├── api/                  # API types
    ├── auth/                 # Authentication types
    ├── games/                # Game types
    ├── users/                # User types
    ├── reviews/              # Review types
    ├── social/               # Social types
    ├── admin/                # Admin types
    └── utils/                # Utility types
```

**Purpose**: Ensures type safety across frontend and backend by sharing TypeScript definitions.

#### `packages/utils/` - Shared Utilities

```
utils/
├── package.json
└── src/
    └── [utility functions]   # Shared helper functions
```

#### `packages/config/` - Shared Configuration

```
config/
├── package.json
├── tsconfig.json
└── src/
    ├── eslint/
    │   └── eslint.config.mjs
    ├── prettier/             # Prettier configs
    └── typescript/           # TypeScript configs
        └── tsconfig.base.json
```

**Purpose**: Centralized configuration for linting, formatting, and TypeScript across all packages.

#### Future Packages

- **`packages/game-apis/`**: External API integration clients (RAWG, IGDB, Steam)
- **`packages/indie-sdk/`**: SDK for indie developers
- **`packages/analytics/`**: Analytics and tracking utilities
- **`packages/steam-integration/`**: Steam platform integration

### `/docs` Directory

Project documentation:

```
docs/
├── agent/                    # Agent/copilot working docs
│   ├── button-migration-guide.md
│   ├── core-layout/
│   └── user-profile/
├── api/                      # API documentation (future)
├── architecture/             # Architecture documentation
│   ├── backend-tcd.md       # Backend technical context
│   ├── dev-guide.md         # Development guide
│   ├── frontend-tcd.md      # Frontend technical context
│   ├── project-structure.md # This file
│   └── system-design.md     # Design system documentation
└── deployment/               # Deployment guides (future)
```

### `/docker` Directory

Docker configuration files:

```
docker/
├── nginx/
│   └── dev.conf             # Nginx reverse proxy config
├── redis/                    # Redis configuration (future)
├── prometheus/               # Monitoring configuration (future)
└── fluentd/                  # Log aggregation (future)
```

### `/scripts` Directory

Utility scripts for development:

```
scripts/
└── docker-dev.sh            # Docker development helper script
```

## Workspace Configuration

### PNPM Workspaces

Defined in `pnpm-workspace.yaml`:

```yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

### Cross-Package Dependencies

Packages reference each other using the workspace protocol:

```json
{
  "dependencies": {
    "@questlog/shared-types": "workspace:*",
    "@questlog/utils": "workspace:*"
  }
}
```

## Key Features of This Structure

### 1. **Monorepo Benefits**

- Shared code and types across applications
- Consistent tooling and configuration
- Atomic commits across related changes
- Simplified dependency management

### 2. **Type Safety**

- Shared TypeScript definitions ensure API contract adherence
- Type checking across entire codebase
- Reduced runtime errors

### 3. **Modularity**

- Clear separation of concerns
- Independent package versioning
- Easy to add new applications or packages

### 4. **Developer Experience**

- Single command to start entire stack
- Hot reload for both frontend and backend
- Consistent linting and formatting

## Implementation Status

### ✅ Fully Implemented

- Backend NestJS application with complete API
- Frontend Astro + React application
- Shared types package with comprehensive types
- Config package with shared configurations
- Docker development environment
- Complete authentication and authorization
- Game catalog system
- Review system
- Social features

### 🚧 In Progress

- E2E testing suite
- Admin panel UI improvements
- Advanced search and filtering

### 📋 Planned

- External API integration packages (game-apis)
- Indie developer SDK (indie-sdk)
- Analytics package
- Steam integration package
- Comprehensive API documentation
- Deployment guides

## Development Commands

From the root directory:

```bash
# Start entire stack
pnpm dev

# Start specific app
pnpm dev:backend
pnpm dev:frontend

# Build all apps
pnpm build

# Run tests
pnpm test

# Database operations
pnpm db:migrate
pnpm db:seed
pnpm db:studio

# Docker operations
pnpm docker:dev
pnpm docker:dev:down
```

## Contributing

When adding new features:

1. Determine if code belongs in an app or shared package
2. Place shared types in `packages/shared-types`
3. Place shared utilities in `packages/utils`
4. Keep app-specific logic in respective app directories
5. Update this documentation when adding new packages

## References

- [Backend Technical Context](./backend-tcd.md)
- [Frontend Technical Context](./frontend-tcd.md)
- [System Design](./system-design.md)
- [Development Guide](./dev-guide.md)
