# Questlog

**A social network for gamers** - Think Letterboxd, but for video games.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9+-blue.svg)](https://www.typescriptlang.org/)
[![PNPM](https://img.shields.io/badge/PNPM-10+-orange.svg)](https://pnpm.io/)

Questlog is a comprehensive social platform where gamers can discover games, write reviews, connect with fellow players, and build personalized gaming profiles. Built with modern web technologies and designed for scalability, it features a hybrid architecture that combines static generation for optimal performance with interactive components for dynamic user experiences.

## Features

### Authentication & User Management

- **Secure JWT Authentication** with refresh tokens and role-based access control
- **User Profiles** with customizable avatars, bios, and gaming statistics
- **Role-Based Permissions** supporting User, Moderator, and Admin roles
- **Persistent Sessions** with automatic token refresh

### Game Discovery & Management

- **Comprehensive Game Catalog** with detailed information, covers, and metadata
- **Advanced Search & Filtering** by genre, platform, developer, and more
- **Game Details Pages** with aggregated reviews and related games
- **External API Integration** ready for RAWG, IGDB, and Steam APIs

### Review System

- **Rich Review Creation** with ratings, content, and spoiler warnings
- **Social Interactions** including likes, comments, and sharing
- **Review Moderation** tools for community management
- **Personalized Feeds** showing reviews from followed users

### Social Features

- **User Following** system with activity feeds
- **Social Statistics** tracking followers, reviews, and engagement
- **Activity Streams** showcasing user interactions and achievements
- **Community Features** for discovering new users and content

### Admin & Moderation

- **Admin Dashboard** for platform management
- **Content Moderation** tools for reviews and user-generated content
- **User Management** with role assignment and account controls
- **Analytics & Insights** for platform health monitoring

### Performance & Developer Experience

- **Hybrid Architecture** with static generation and dynamic components
- **Type-Safe API** with comprehensive shared types across the stack
- **Modern Development Stack** with hot reload and optimized builds
- **Comprehensive Testing** suite with unit, integration, and E2E tests

## Architecture

Questlog uses a modern monorepo architecture designed for scalability and developer productivity:

### Frontend (Astro + React Islands)

- **Astro 5.x** for static site generation with excellent SEO and performance
- **React 19.x Islands** for selective interactivity and optimal JavaScript delivery
- **Tailwind CSS v4** with custom design system and responsive components
- **Nanostores** for lightweight, efficient state management

### Backend (NestJS + Prisma)

- **NestJS** framework with modular, domain-driven architecture
- **Prisma ORM** with PostgreSQL for type-safe database operations
- **JWT Authentication** with global guards and role-based access control
- **Comprehensive API** with REST endpoints and future GraphQL support

### Infrastructure

- **Docker Compose** for development environment consistency
- **Redis** for caching and session management
- **MinIO** for S3-compatible file storage
- **Monitoring** with Prometheus and centralized logging

```tree
questlog-app/
├── apps/
│   ├── backend/          # NestJS API server
│   ├── frontend/         # Astro + React frontend
│   └── e2e/              # End-to-end tests
├── packages/
│   ├── shared-types/     # TypeScript type definitions
│   ├── ui-components/    # Shared React components
│   ├── utils/            # Utility functions
│   ├── config/           # Shared configurations
│   └── game-apis/        # External API integrations
└── docker/               # Docker configurations
```

## Quick Start

### Prerequisites

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **PNPM** 8+ ([Installation](https://pnpm.io/installation))
- **Docker** & **Docker Compose** ([Get Docker](https://docs.docker.com/get-docker/))

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/dracudev/questlog-app.git
   cd questlog-app
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Start development services**

   ```bash
   pnpm docker:dev        # Start PostgreSQL, Redis, MinIO, etc.
   ```

5. **Set up the database**

   ```bash
   pnpm db:migrate        # Run database migrations
   pnpm db:seed           # Seed with sample data
   ```

6. **Start development servers**

   ```bash
   pnpm dev               # Start both backend and frontend
   ```

### Development URLs

- **Frontend**: [http://localhost:4321](http://localhost:4321)
- **Backend API**: [http://localhost:3001](http://localhost:3001)
- **API Documentation**: [http://localhost:3001/api](http://localhost:3001/api)
- **Database Admin**: [http://localhost:8080](http://localhost:8080) (Adminer)
- **Prisma Studio**: [http://localhost:5555](http://localhost:5555) (via `pnpm db:studio`)
- **MinIO Console**: [http://localhost:9001](http://localhost:9001)

## 📚 Documentation

Comprehensive documentation is available in the `/docs` directory:

- **[System Design](./docs/architecture/system-design.md)** - Overall architecture and design decisions
- **[Development Guide](./docs/architecture/dev-guide.md)** - Detailed development workflow
- **[Frontend TCD](./docs/architecture/frontend-tcd.md)** - Frontend technical context
- **[Backend TCD](./docs/architecture/backend-tcd.md)** - Backend technical context
- **[Project Structure](./docs/architecture/project-structure.md)** - Codebase organization

## Development Scripts

### General Commands

```bash
pnpm dev                   # Start both backend and frontend
pnpm build                 # Build all applications
pnpm test                  # Run all tests
pnpm lint                  # Lint all packages
pnpm type-check            # Type check all packages
```

### Backend Specific

```bash
pnpm dev:backend           # Start backend with hot reload
pnpm build:backend         # Build backend for production
pnpm test:backend          # Run backend tests
```

### Frontend Specific

```bash
pnpm dev:frontend          # Start frontend with hot reload
pnpm build:frontend        # Build frontend for production
pnpm test:frontend         # Run frontend tests
```

### Database Management

```bash
pnpm db:migrate            # Create and run migrations
pnpm db:seed               # Seed database with sample data
pnpm db:studio             # Open Prisma Studio GUI
pnpm db:reset              # Reset database (destructive)
```

### Docker Services

```bash
pnpm docker:dev            # Start development containers
pnpm docker:dev:down       # Stop development containers
pnpm docker:dev:logs       # View container logs
pnpm docker:dev:build      # Rebuild and start containers
```

## Testing

Questlog includes comprehensive testing across all layers:

- **Unit Tests**: Jest with React Testing Library
- **Integration Tests**: Supertest for API testing
- **E2E Tests**: Cypress for end-to-end workflows
- **Type Checking**: TypeScript strict mode across all packages

```bash
pnpm test                  # Run all tests
pnpm test:backend          # Backend tests only
pnpm test:frontend         # Frontend tests only
pnpm test:e2e              # End-to-end tests
```

## Deployment

### Development

- **Backend**: Local development with hot reload
- **Frontend**: Astro dev server with React Fast Refresh
- **Database**: PostgreSQL via Docker Compose

### Production

- **Frontend**: Vercel with automatic deployments
- **Backend**: Railway/Render with Docker containers
- **Database**: Neon/Supabase with automated backups
- **CDN**: Cloudflare for static assets and performance

## Roadmap

### Phase 1: Core Foundation

- [x] Project architecture and monorepo setup
- [x] Authentication system with JWT and roles
- [x] Complete backend API with all domains
- [x] Frontend architecture with Astro + React
- [x] Comprehensive state management
- [x] Type-safe API integration
- [x] Radix UI integration for accessibility
- [x] Design system with CSS custom properties

### Phase 2: UI Development

- [x] Core layout refactoring with Radix UI (Navbar, Footer, ThemeToggle)
- [x] User profile feature implementation (complete 3-layer architecture)
- [x] Authentication pages (login, register)
- [x] Mobile-first responsive design patterns
- [x] Optimistic UI updates with automatic rollback
- [x] Games catalog and detail pages
- [ ] Review creation and editing UI
- [x] Search and filtering interfaces
- [x] Activity feed implementation

### Phase 3: Social Features Enhancement (Q1 2026)

- [ ] Real-time activity feed with polling
- [ ] Comment system for reviews
- [ ] Enhanced user discovery and recommendations
- [ ] Notification center UI
- [ ] Advanced social interactions (mentions, shares)

### Phase 4: Game Integration & APIs (Q2 2026)

- [ ] RAWG API integration for game data
- [ ] Steam OAuth and library sync
- [ ] Achievement tracking system
- [ ] Personal game lists (wishlist, playing, completed, backlog)
- [ ] IGDB integration for enhanced metadata

### Phase 5: Indie Showcase (Q3 2026)

- [ ] Developer portal and registration
- [ ] Game submission system
- [ ] Demo hosting and embedding
- [ ] Developer analytics dashboard
- [ ] Featured indie games section

### Phase 6: Advanced Features (Q4 2026+)

- [ ] AI-powered game recommendations
- [ ] Mobile applications (React Native)
- [ ] Real-time chat and messaging
- [ ] WebSocket integration for live updates
- [ ] Advanced analytics and insights
- [ ] Multi-language support (i18n)

## Contributing

We welcome contributions from the gaming and development community! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes** with proper tests and documentation
4. **Commit your changes**: `git commit -m 'Add amazing feature'`
5. **Push to the branch**: `git push origin feature/amazing-feature`
6. **Open a Pull Request**

### Development Guidelines

- **Code Style**: We use Prettier and ESLint for consistent formatting
- **Type Safety**: All code must be fully typed with TypeScript
- **Testing**: New features require comprehensive test coverage
- **Documentation**: Update relevant documentation for new features
- **Commits**: Use conventional commit messages

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- **Letterboxd** for inspiration on social media for media consumption
- **RAWG API** and **IGDB** for comprehensive game databases
- **NestJS** and **Astro** communities for excellent frameworks
- **The gaming community** for feedback and feature requests

## Support

- **Documentation**: Check the [docs folder](./docs/) for detailed guides
- **Issues**: Report bugs or request features via [GitHub Issues](https://github.com/dracudev/questlog-app/issues)
- **Discussions**: Join community discussions in [GitHub Discussions](https://github.com/dracudev/questlog-app/discussions)

---

Built with care for the gaming community

[Website](https://questlog.app) • [Documentation](./docs/) • [API](http://localhost:3001/api) • [Contributing](./CONTRIBUTING.md)
