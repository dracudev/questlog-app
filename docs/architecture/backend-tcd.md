# Questlog Backend - Technical Context Document

## 1. High-Level Overview

**Questlog** is a social network for gamers, similar to Letterboxd but focused on video games. The platform allows users to discover games, write reviews, follow other gamers, and build a personalized gaming profile. The backend serves as the core API that powers user authentication, game catalog management, social features, and review systems.

### Core Functionality

- **Game Catalog Management**: Comprehensive database of video games with metadata, ratings, and relationships
- **User Authentication & Authorization**: JWT-based auth with role-based access control (User, Admin, Moderator)
- **Social Features**: User following, review interactions, and activity feeds
- **Review System**: Rich game reviews with ratings, comments, and social engagement
- **Profile Management**: Customizable user profiles with gaming preferences and social settings

### Future Vision

The platform is designed to eventually become a showcase for indie games, integrate with Steam APIs for automatic game library sync, and provide gamification features like achievements and personalized gaming questlogs.

## 2. Technology Stack

### Core Technologies

- **Framework**: NestJS 11.x (Node.js TypeScript framework)
- **Database**: PostgreSQL with Prisma ORM (v6.14.0)
- **Authentication**: JWT tokens with passport strategies
- **Validation**: class-validator and class-transformer for DTOs
- **API Documentation**: Swagger/OpenAPI integration
- **Security**: Helmet, CORS, bcryptjs for password hashing

### Key Dependencies

- **@nestjs/jwt**: JWT token management and validation
- **@nestjs/passport**: Authentication strategies (Local, JWT, JWT Refresh)
- **@nestjs/throttler**: Rate limiting protection
- **@prisma/client**: Type-safe database client
- **bcryptjs**: Secure password hashing
- **redis**: Caching and session management (configured but not yet implemented)

### Framework Choice Rationale

**NestJS** was chosen for its:

- **Enterprise-grade architecture**: Modular design with dependency injection
- **TypeScript-first approach**: Full type safety across the application
- **Decorator-based development**: Clean, maintainable code with metadata
- **Built-in features**: Guards, interceptors, pipes, and filters for cross-cutting concerns
- **Extensibility**: Easy integration with databases, authentication, and third-party services

**PostgreSQL** provides:

- **ACID compliance**: Ensuring data integrity for user content and relationships
- **Advanced JSON support**: Flexible data storage for game metadata and user preferences
- **Complex relationships**: Efficient handling of many-to-many relationships between games, genres, and platforms

## 3. Architecture & Design Patterns

### Overall Architecture

The backend follows a **modular monolithic architecture** with clear separation of concerns:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Controllers   │    │    Services     │    │   Data Layer    │
│   (HTTP Layer)  │───▶│  (Business      │───▶│   (Prisma +     │
│                 │    │   Logic)        │    │   PostgreSQL)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Directory Structure

```
src/
├── app.module.ts          # Root module with global configuration
├── main.ts               # Application bootstrap
├── auth/                 # Authentication & authorization
├── users/                # User management
├── games/                # Game catalog system
│   ├── developers/       # Game developer management
│   ├── genres/          # Genre management
│   ├── platforms/       # Platform management
│   └── publishers/      # Publisher management
├── common/              # Shared utilities and DTOs
└── database/            # Database configuration and services
```

### Key Design Patterns

1. **Module Pattern**: Each feature is encapsulated in its own NestJS module with clear boundaries
2. **Repository Pattern**: Prisma service acts as a repository layer, abstracting database operations
3. **DTO Pattern**: Data Transfer Objects with validation for all API inputs/outputs
4. **Guard Pattern**: Authentication and authorization guards protect routes
5. **Decorator Pattern**: Custom decorators for user extraction and role-based access
6. **Strategy Pattern**: Multiple authentication strategies (Local, JWT, JWT Refresh)

### Cross-Cutting Concerns

- **Global Guards**: JWT authentication and rate limiting applied globally
- **Validation Pipe**: Automatic DTO validation and transformation
- **Exception Filters**: Centralized error handling and response formatting
- **Interceptors**: Request/response transformation and logging
- **Middleware**: Security headers (Helmet) and compression

## 4. Database Schema

The database uses a **relational model** optimized for gaming social network features:

### Core Entities

**Users** (`users` table)

- Primary key: `id` (CUID)
- Authentication: `email`, `username`, `password`, `role`
- Profile: `displayName`, `bio`, `avatar`, `location`, `website`
- Privacy: `isPrivate`, `emailNotifications`
- Internationalization: `language`, `timezone`

**Games** (`games` table)

- Primary key: `id` (CUID)
- Core info: `title`, `slug`, `description`, `summary`, `status`
- Release: `releaseDate`, `coverImage`, `screenshots`, `videos`
- External APIs: `rawgId`, `igdbId`, `steamId`, `metacriticId`
- Metrics: `averageRating`, `reviewCount`, `playCount`

**Reviews** (`reviews` table)

- Primary key: `id` (CUID)
- Content: `title`, `content`, `rating` (0-10 scale)
- Status: `isPublished`, `isSpoiler`
- Foreign keys: `userId`, `gameId`

### Key Relationships

1. **User ↔ Review**: One-to-many (a user can write many reviews)
2. **Game ↔ Review**: One-to-many (a game can have many reviews)
3. **User ↔ Follow**: Many-to-many self-referencing (users follow other users)
4. **Game ↔ Genre**: Many-to-many through `game_genres` junction table
5. **Game ↔ Platform**: Many-to-many through `game_platforms` junction table
6. **Game ↔ Developer**: Many-to-one (developer can make many games)
7. **Game ↔ Publisher**: Many-to-one (publisher can publish many games)

### Advanced Features Schema

**Social Features**:

- `follows`: User following relationships
- `likes`: Review likes/reactions
- `comments`: Review comments and discussions

**Game Lists** (Future Feature):

- `game_lists`: User-created game collections
- `game_list_entries`: Items in game lists with custom ordering

**Gamification** (Future Features):

- `achievements`: System achievements
- `user_achievements`: User progress tracking
- `notifications`: Real-time user notifications
- `user_sessions`: Session management for security

### Constraints & Indexes

- **Unique constraints**: User emails/usernames, game slugs, review per user per game
- **Cascade deletes**: Maintains referential integrity when users or games are deleted
- **Optimized queries**: Indexes on frequently queried fields like slugs and foreign keys

## 5. API Endpoints

The API follows RESTful conventions with clear resource-based URLs:

### Authentication (`/api/auth`)

```
POST   /api/auth/register          # User registration
POST   /api/auth/login             # User login
POST   /api/auth/refresh           # Token refresh
POST   /api/auth/logout            # User logout
POST   /api/auth/change-password   # Change password (authenticated)
POST   /api/auth/forgot-password   # Request password reset
POST   /api/auth/reset-password    # Reset password with token
```

### User Management (`/api/users`)

```
GET    /api/users/profile          # Get current user profile
PUT    /api/users/profile          # Update user profile
GET    /api/users/:id              # Get user by ID
PUT    /api/users/:id              # Update user (admin only)
DELETE /api/users/:id              # Delete user (admin only)
```

### Game Catalog (`/api/games`)

```
GET    /api/games                  # List games with filters/pagination
POST   /api/games                  # Create game (admin only)
GET    /api/games/:slug            # Get game by slug
PUT    /api/games/:id              # Update game (admin only)
DELETE /api/games/:id              # Delete game (admin only)
GET    /api/games/:id/similar      # Get similar games
```

### Game Metadata (`/api/developers`, `/api/genres`, `/api/platforms`, `/api/publishers`)

```
GET    /api/developers             # List developers
POST   /api/developers             # Create developer (admin only)
GET    /api/developers/:id         # Get developer details
PUT    /api/developers/:id         # Update developer (admin only)
DELETE /api/developers/:id         # Delete developer (admin only)
GET    /api/developers/:id/games   # Get developer's games
GET    /api/developers/:id/stats   # Get developer statistics
```

### Request/Response Format

All endpoints use consistent JSON format:

**Success Response:**

```json
{
  "statusCode": 200,
  "message": "Success",
  "data": { /* response data */ }
}
```

**Error Response:**

```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Bad Request",
  "details": ["field1 is required", "field2 must be a string"]
}
```

**Paginated Response:**

```json
{
  "data": [/* items */],
  "meta": {
    "page": 1,
    "limit": 12,
    "total": 120,
    "totalPages": 10,
    "hasNext": true,
    "hasPrev": false
  }
}
```

## 6. Authentication & Authorization

### Authentication Strategy

The system uses **JWT-based stateless authentication** with a dual-token approach:

1. **Access Token**: Short-lived (7 days) for API access
2. **Refresh Token**: Long-lived (30 days) for token renewal

### Token Flow

```
1. User logs in with email/password
2. System validates credentials
3. Server generates access + refresh tokens
4. Client stores tokens securely
5. Client sends access token in Authorization header
6. Server validates token on protected routes
7. Client refreshes tokens before expiration
```

### Authorization Levels

**Public Routes** (No authentication required):

- Game catalog browsing
- Public user profiles
- Public reviews

**Authenticated Routes** (Valid JWT required):

- Profile management
- Creating/editing reviews
- Social features (following, liking)

**Admin Routes** (Admin role required):

- Game management (CRUD operations)
- Developer/Publisher/Genre management
- User moderation

### Security Implementation

**Password Security:**

- bcryptjs with salt rounds of 12
- Password strength validation in DTOs
- Secure password reset flow with time-limited tokens

**JWT Security:**

- Separate secrets for access, refresh, and reset tokens
- Token expiration and rotation
- Payload includes user ID, email, and role only

**Route Protection:**

- `JwtAuthGuard`: Validates JWT tokens
- `RolesGuard`: Enforces role-based access
- `@Public()` decorator: Bypasses auth for public routes
- `@Roles()` decorator: Specifies required roles

**Additional Security:**

- Rate limiting: 100 requests per minute per IP
- CORS configuration for frontend domains
- Helmet middleware for security headers
- Input validation and sanitization
- SQL injection prevention through Prisma

## 7. Setup & Local Development

### Prerequisites

- Node.js 18+ and pnpm
- PostgreSQL 13+
- Docker (optional but recommended)

### Environment Setup

1. **Clone and Install:**

```bash
git clone https://github.com/dracudev/questlog-app.git
cd questlog-app
pnpm install
```

2. **Environment Variables:**
Create `/apps/backend/.env` with these required variables:

```bash
# Database
DATABASE_URL="postgresql://questlog:questlog@localhost:5432/questlog_dev"
POSTGRES_DB="questlog_dev"
POSTGRES_USER="questlog"
POSTGRES_PASSWORD="questlog"

# JWT Configuration
JWT_SECRET="your-super-secret-jwt-key-here-make-it-long-and-secure"
JWT_EXPIRES_IN="7d"
JWT_REFRESH_SECRET="your-super-secret-refresh-key-here-different-from-jwt-secret"
JWT_REFRESH_EXPIRES_IN="30d"
JWT_RESET_SECRET="your-super-secret-reset-key-here-different-from-others"

# Redis (Optional for future features)
REDIS_URL="redis://localhost:6379"

# Email (Future password reset feature)
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT="587"
EMAIL_USER="your-email@gmail.com"
EMAIL_PASS="your-email-password"

# Application
NODE_ENV="development"
PORT="3000"
FRONTEND_URL="http://localhost:4321"
```

### Database Setup

**Using Docker (Recommended):**

```bash
# Start database
docker-compose -f docker-compose.dev.yml up -d postgres

# Run migrations and seed data
cd apps/backend
pnpm db:migrate
pnpm db:seed
```

**Manual Setup:**

```bash
# Install PostgreSQL and create database
createdb questlog_dev

# Run migrations and seed
cd apps/backend
pnpm db:migrate
pnpm db:seed
```

### Development Workflow

**Start Development Server:**

```bash
cd apps/backend
pnpm dev
```

**Available Scripts:**

```bash
pnpm dev                 # Start with hot reload
pnpm build              # Build for production
pnpm start:prod         # Start production build
pnpm test               # Run unit tests
pnpm test:e2e           # Run E2E tests
pnpm db:studio          # Open Prisma Studio
pnpm db:reset           # Reset database (destructive)
pnpm lint               # Run ESLint
```

### API Documentation

With the server running, access:

- **Swagger UI**: `http://localhost:3000/api/docs`
- **API Base**: `http://localhost:3000/api`

### Testing

**Unit Tests:**

```bash
pnpm test              # Run all tests
pnpm test:watch        # Watch mode
pnpm test:cov          # With coverage
```

**E2E Tests:**

```bash
pnpm test:e2e          # Integration tests
```

### Database Management

**Prisma Commands:**

```bash
pnpm db:generate       # Generate Prisma client
pnpm db:push          # Push schema changes (dev only)
pnpm db:migrate       # Create and run migrations
pnpm db:studio        # Visual database browser
pnpm db:seed          # Run seed scripts
```

### Production Deployment

The application is designed for deployment on platforms like Railway, Render, or similar:

1. Set production environment variables
2. Run database migrations: `pnpm db:migrate:deploy`
3. Build application: `pnpm build`
4. Start production server: `pnpm start:prod`

---

This backend provides a solid foundation for the Questlog gaming social network, with room for future expansion into indie game showcases, Steam integration, and advanced social features.
