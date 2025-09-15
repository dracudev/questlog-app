# Questlog - Project Structure

```tree
questlog/
├── package.json                          # Root package.json with workspace config
├── pnpm-workspace.yaml                   # PNPM workspace configuration
├── pnpm-lock.yaml                        # PNPM lockfile
├── .gitignore                            # Git ignore rules
├── .env.example                          # Environment variables example
├── .env.local                            # Local environment variables
├── README.md                             # Project documentation
├── CONTRIBUTING.md                       # Contribution guidelines
├── docker-compose.dev.yml                # Development Docker setup
├── docker-compose.prod.yml               # Production Docker setup
├── .github/                              # GitHub Actions workflows
│   └── workflows/
│       ├── ci.yml                        # Continuous Integration
│       ├── deploy-staging.yml            # Staging deployment
│       └── deploy-prod.yml               # Production deployment
├── docker/                               # Docker configuration files
│   ├── nginx/
│   │   ├── dev.conf                      # Nginx config for development
│   │   ├── prod.conf                     # Nginx config for production
│   │   └── ssl/                          # SSL certificates
│   ├── redis/
│   │   └── redis.conf                    # Redis configuration
│   ├── prometheus/
│   │   └── prometheus.yml                # Monitoring configuration
│   └── fluentd/
│       └── fluent.conf                   # Log aggregation config
├── scripts/                              # Utility scripts
│   ├── setup.sh                          # Project setup script
│   ├── backup.sh                         # Database backup script
│   ├── deploy.sh                         # Deployment script
│   └── seed-data.sh                      # Seed sample data
├── docs/                                 # Documentation
│   ├── api/                              # API documentation
│   ├── deployment/                       # Deployment guides
│   └── architecture/                     # Architecture diagrams
├── apps/                                 # Applications
│   ├── frontend/                         # Astro + React frontend
│   │   ├── package.json
│   │   ├── astro.config.mjs
│   │   ├── tailwind.config.mjs
│   │   ├── tsconfig.json
│   │   ├── Dockerfile.dev
│   │   ├── Dockerfile
│   │   ├── src/
│   │   │   ├── components/               # React components
│   │   │   │   ├── ui/                   # Base UI components
│   │   │   │   ├── auth/                 # Authentication components
│   │   │   │   ├── games/                # Game-related components
│   │   │   │   ├── reviews/              # Review components
│   │   │   │   ├── social/               # Social features
│   │   │   │   └── indie/                # Indie showcase components
│   │   │   ├── pages/                    # Astro pages (SSG)
│   │   │   │   ├── index.astro           # Home page
│   │   │   │   ├── games/
│   │   │   │   │   ├── index.astro       # Games catalog
│   │   │   │   │   └── [slug].astro      # Game detail pages
│   │   │   │   ├── users/
│   │   │   │   │   └── [username].astro  # User profiles
│   │   │   │   ├── reviews/
│   │   │   │   │   └── [id].astro        # Review detail pages
│   │   │   │   ├── indie/                # Indie games showcase
│   │   │   │   ├── admin/                # Admin panel
│   │   │   │   └── auth/                 # Auth pages
│   │   │   ├── layouts/                  # Page layouts
│   │   │   ├── stores/                   # State management (Nanostores)
│   │   │   ├── utils/                    # Utility functions
│   │   │   ├── hooks/                    # React hooks
│   │   │   ├── types/                    # TypeScript types
│   │   │   └── styles/                   # Global styles
│   │   └── public/                       # Static assets
│   ├── backend/                          # NestJS backend API
│   │   ├── package.json
│   │   ├── nest-cli.json
│   │   ├── tsconfig.json
│   │   ├── Dockerfile.dev
│   │   ├── Dockerfile
│   │   ├── prisma/                       # Database schema and migrations
│   │   │   ├── schema.prisma
│   │   │   ├── migrations/
│   │   │   ├── seeds/
│   │   │   └── init.sql
│   │   ├── src/
│   │   │   ├── main.ts                   # Application entry point
│   │   │   ├── app.module.ts             # Root module
│   │   │   ├── auth/                     # Authentication module
│   │   │   │   ├── auth.module.ts
│   │   │   │   ├── auth.service.ts
│   │   │   │   ├── auth.controller.ts
│   │   │   │   ├── strategies/           # JWT, Steam OAuth strategies
│   │   │   │   ├── guards/               # Auth guards
│   │   │   │   └── decorators/           # Custom decorators
│   │   │   ├── users/                    # User management
│   │   │   ├── games/                    # Game catalog
│   │   │   ├── reviews/                  # Review system
│   │   │   ├── social/                  # Social following, feed
│   │   │   ├── indie/                    # Indie games showcase
│   │   │   ├── steam/                    # Steam integration (future)
│   │   │   ├── achievements/             # Achievement system (future)
│   │   │   ├── notifications/            # Real-time notifications (future)
│   │   │   ├── uploads/                  # File upload handling
│   │   │   ├── external-apis/            # RAWG, IGDB integrations
│   │   │   ├── common/                   # Shared utilities
│   │   │   │   ├── filters/              # Exception filters
│   │   │   │   ├── guards/               # Global guards
│   │   │   │   ├── interceptors/         # Response interceptors
│   │   │   │   ├── middleware/           # Custom middleware
│   │   │   │   ├── pipes/                # Validation pipes
│   │   │   │   └── decorators/           # Custom decorators
│   │   │   └── database/                 # Database utilities
│   │   └── test/                         # E2E tests
│   └── e2e/                              # End-to-end testing
│       ├── package.json
│       ├── cypress.config.ts
│       ├── cypress/
│       │   ├── e2e/                      # E2E test specs
│       │   ├── fixtures/                 # Test data
│       │   └── support/                  # Test utilities
│       └── playwright.config.ts          # Playwright config (alternative)
└── packages/                             # Shared packages
    ├── shared-types/                     # Shared TypeScript types
    │   ├── package.json
    │   ├── src/
    │   │   ├── api/                      # API types
    │   │   ├── auth/                     # Auth types
    │   │   ├── games/                    # Game types
    │   │   ├── users/                    # User types
    │   │   ├── reviews/                  # Review types
    │   │   └── index.ts                  # Barrel exports
    │   └── tsconfig.json
    ├── ui-components/                    # Shared UI components
    │   ├── package.json
    │   ├── src/
    │   │   ├── components/               # Reusable components
    │   │   ├── styles/                   # Component styles
    │   │   └── index.ts                  # Component exports
    │   ├── tailwind.config.js
    │   └── tsconfig.json
    ├── utils/                            # Shared utility functions
    │   ├── package.json
    │   ├── src/
    │   │   ├── validation/               # Zod schemas
    │   │   ├── formatting/               # Text/date formatting
    │   │   ├── constants/                # App constants
    │   │   └── helpers/                  # Helper functions
    │   └── tsconfig.json
    ├── config/                           # Shared configuration
    │   ├── package.json
    │   ├── src/
    │   │   ├── eslint/                   # ESLint configs
    │   │   ├── prettier/                 # Prettier configs
    │   │   ├── typescript/               # TypeScript configs
    │   │   └── tailwind/                 # Tailwind configs
    │   └── tsconfig.json
    ├── game-apis/                        # External game API clients
    │   ├── package.json
    │   ├── src/
    │   │   ├── rawg/                     # RAWG API client
    │   │   ├── igdb/                     # IGDB API client
    │   │   ├── steam/                    # Steam API client (future)
    │   │   └── types/                    # API response types
    │   └── tsconfig.json
    ├── indie-sdk/                        # SDK for indie game developers (future)
    │   ├── package.json
    │   ├── src/
    │   │   ├── showcase/                 # Showcase API client
    │   │   ├── analytics/                # Analytics utilities
    │   │   ├── webhooks/                 # Webhook helpers
    │   │   └── types/                    # SDK types
    │   └── tsconfig.json
    ├── analytics/                        # Analytics utilities (future)
    │   ├── package.json
    │   ├── src/
    │   │   ├── tracking/                 # Event tracking
    │   │   ├── metrics/                  # Custom metrics
    │   │   └── reporting/                # Report generation
    │   └── tsconfig.json
    └── steam-integration/                # Steam integration package (future)
        ├── package.json
        ├── src/
        │   ├── auth/                     # Steam OAuth
        │   ├── library/                  # Game library sync
        │   ├── achievements/             # Achievement sync
        │   └── profiles/                 # Profile data sync
        └── tsconfig.json
```
