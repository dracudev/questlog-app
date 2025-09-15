# Questlog Backend - Technical Context Document

## 1. High-Level Overview

**Questlog** is a social network for gamers, similar to Letterboxd but focused on video games. The platform allows users to discover games, write reviews, follow other gamers, and build a personalized gaming profile. The backend serves as the core API that powers user authentication, game catalog management, social features, and review systems.

### Core Functionality

- **Game Catalog Management**: Comprehensive database of video games with metadata, ratings, and relationships
- **User Authentication & Authorization**: JWT-based auth with role-based access control (User, Admin, Moderator)
- **Social Features**: User following, activity feeds, review interactions, and mutual connection discovery
- **Review System**: Rich game reviews with ratings, comments, and social engagement (likes)
- **Profile Management**: Customizable user profiles with gaming preferences and social settings
- **Advanced Search & Filtering**: Sophisticated filtering for games, reviews, and users with pagination
- **Activity Feeds**: Personalized activity streams showing followed users' activities
- **Social Statistics**: Comprehensive stats for users including followers, following, and engagement metrics

### Current Implementation Features

- **Complete Authentication Flow**: Registration, login, token refresh, password changes, and reset functionality
- **Comprehensive Game Management**: Full CRUD for games with detailed metadata and relationships
- **Developer/Publisher/Genre/Platform Management**: Complete catalog system for game metadata
- **Review System**: Create, read, update, delete reviews with like/unlike functionality
- **Social Interactions**: Follow/unfollow users, activity feeds, mutual connections, and follow suggestions
- **Advanced API Features**: Comprehensive filtering, pagination, search, and sorting across all endpoints
- **Security**: Role-based access control, rate limiting, input validation, and comprehensive guards
- **Documentation**: Auto-generated Swagger/OpenAPI documentation with detailed endpoint specifications

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
- **@nestjs/throttler**: Rate limiting protection (100 req/min per IP)
- **@nestjs/swagger**: OpenAPI documentation generation
- **@nestjs/config**: Environment configuration management
- **@prisma/client**: Type-safe database client
- **bcryptjs**: Secure password hashing
- **class-validator**: DTO validation and transformation
- **class-transformer**: Object transformation utilities
- **helmet**: Security middleware for HTTP headers
- **compression**: Response compression middleware

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
├── main.ts               # Application bootstrap with Swagger setup
├── auth/                 # Authentication & authorization
│   ├── constants/        # Auth-related constants
│   ├── decorators/       # Custom decorators (GetUser, Public, Roles)
│   ├── dto/             # Auth DTOs (Login, Register, Password changes)
│   ├── guards/          # Auth guards (JWT, Local, Refresh, Roles)
│   ├── interfaces/      # Auth interfaces and types
│   └── strategies/      # Passport strategies (JWT, Local, Refresh)
├── users/               # User management and profiles
│   ├── constants/       # User-related constants
│   └── dto/            # User DTOs (Profile, Update, Response)
├── games/               # Game catalog system
│   ├── constants/       # Game-related constants
│   ├── dto/            # Game DTOs (Create, Update, Response, Filters)
│   ├── developers/     # Game developer management
│   │   └── dto/        # Developer DTOs
│   ├── genres/         # Genre management
│   │   └── dto/        # Genre DTOs
│   ├── platforms/      # Platform management
│   │   └── dto/        # Platform DTOs
│   └── publishers/     # Publisher management
│       └── dto/        # Publisher DTOs
├── reviews/             # Review system
│   ├── constants/       # Review-related constants
│   └── dto/            # Review DTOs (Create, Update, Response, Queries)
├── social/              # Social features
│   ├── constants/       # Social-related constants
│   └── dto/            # Social DTOs (Activity feed, Stats, Follow)
├── common/              # Shared utilities and DTOs
│   ├── constants/       # Global constants
│   ├── dto/            # Common DTOs (Pagination, Response)
│   ├── filters/        # Exception filters
│   └── interceptors/   # Request/response interceptors
└── database/           # Database configuration and services
    ├── database.module.ts
    └── prisma.service.ts
```

### Key Design Patterns

1. **Module Pattern**: Each feature is encapsulated in its own NestJS module with clear boundaries
2. **Repository Pattern**: Prisma service acts as a repository layer, abstracting database operations
3. **DTO Pattern**: Data Transfer Objects with validation for all API inputs/outputs
4. **Guard Pattern**: Authentication and authorization guards protect routes
5. **Decorator Pattern**: Custom decorators for user extraction and role-based access
6. **Strategy Pattern**: Multiple authentication strategies (Local, JWT, JWT Refresh)

### Cross-Cutting Concerns

- **Global Guards**: JWT authentication and rate limiting applied globally to all routes
- **Validation Pipe**: Automatic DTO validation and transformation with whitelist protection
- **Exception Filters**: Centralized error handling and response formatting via HttpExceptionFilter
- **Interceptors**: Request/response transformation (TransformInterceptor) and logging (LoggingInterceptor)
- **Middleware**: Security headers (Helmet), CORS configuration, and compression
- **API Documentation**: Automatic Swagger/OpenAPI documentation generation
- **Versioning**: URI-based API versioning with global prefix '/api'
- **Global Prefix**: All endpoints prefixed with '/api' for clear API structure

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
POST   /api/auth/refresh           # Token refresh using refresh token
POST   /api/auth/change-password   # Change password (authenticated)
POST   /api/auth/forgot-password   # Request password reset
POST   /api/auth/reset-password    # Reset password with token
GET    /api/auth/me                # Get current user profile
```

### User Management (`/api/users`)

```
GET    /api/users                     # Get all users with pagination and search
GET    /api/users/profile/:username   # Get user profile by username
GET    /api/users/profile/:username/followers   # Get user followers
GET    /api/users/profile/:username/following   # Get users that this user follows
PATCH  /api/users/profile             # Update current user profile
PATCH  /api/users/:id/role            # Update user role (admin only)
DELETE /api/users/:id                 # Delete user (admin only)
```

### Game Catalog (`/api/games`)

```
GET    /api/games                  # List games with advanced filters/pagination
POST   /api/games                  # Create game (admin/moderator only)
GET    /api/games/:slug            # Get game by slug with detailed information
PATCH  /api/games/:id              # Update game (admin/moderator only)
DELETE /api/games/:id              # Delete game (admin only)
GET    /api/games/:id/similar      # Get similar games based on genres/developers
```

### Game Metadata Management

**Developers** (`/api/developers`)

```
GET    /api/developers             # List developers with pagination/filters
POST   /api/developers             # Create developer (admin/moderator only)
GET    /api/developers/:id         # Get developer by ID or slug
PATCH  /api/developers/:id         # Update developer (admin/moderator only)
DELETE /api/developers/:id         # Delete developer (admin only)
GET    /api/developers/:id/games   # Get developer's games with pagination
GET    /api/developers/:id/stats   # Get developer statistics
```

**Genres** (`/api/genres`)

```
GET    /api/genres                 # List game genres
POST   /api/genres                 # Create genre (admin/moderator only)
GET    /api/genres/:id             # Get genre details
PATCH  /api/genres/:id             # Update genre (admin/moderator only)
DELETE /api/genres/:id             # Delete genre (admin only)
```

**Platforms** (`/api/platforms`)

```
GET    /api/platforms              # List gaming platforms
POST   /api/platforms              # Create platform (admin/moderator only)
GET    /api/platforms/:id          # Get platform details
PATCH  /api/platforms/:id          # Update platform (admin/moderator only)
DELETE /api/platforms/:id          # Delete platform (admin only)
```

**Publishers** (`/api/publishers`)

```
GET    /api/publishers             # List game publishers
POST   /api/publishers             # Create publisher (admin/moderator only)
GET    /api/publishers/:id         # Get publisher details
PATCH  /api/publishers/:id         # Update publisher (admin/moderator only)
DELETE /api/publishers/:id         # Delete publisher (admin only)
```

### Reviews (`/api/reviews`)

```
POST   /api/reviews                     # Create a new review (authenticated)
GET    /api/reviews                     # Get all reviews with filters/pagination
GET    /api/reviews/:id                 # Get review by ID
GET    /api/reviews/game/:gameId        # Get reviews for a specific game
GET    /api/reviews/user/:userId        # Get reviews by a specific user
GET    /api/reviews/user/:userId/game/:gameId  # Get specific user's review for a game
PATCH  /api/reviews/:id                 # Update review (owner only)
DELETE /api/reviews/:id                 # Delete review (owner only)
POST   /api/reviews/:id/like            # Like a review (authenticated)
DELETE /api/reviews/:id/like            # Unlike a review (authenticated)
```

### Social Features (`/api/social`)

```
POST   /api/social/follow/:userId       # Follow a user (authenticated)
DELETE /api/social/follow/:userId       # Unfollow a user (authenticated)
GET    /api/social/following/:userId    # Check if following a user
GET    /api/social/feed                 # Get activity feed for current user
GET    /api/social/stats                # Get current user's social statistics
GET    /api/social/stats/:userId        # Get specific user's social statistics
GET    /api/social/suggestions          # Get follow suggestions
GET    /api/social/mutual/:userId       # Get mutual follows with another user
```

### Request/Response Format

All endpoints use consistent JSON format:

**Success Response:**

```json
{
  "statusCode": 200,
  "message": "Success",
  "data": {
    /* response data */
  }
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
  "data": [
    /* items */
  ],
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

- Game catalog browsing and detailed views
- Public user profiles and follower/following lists
- Public reviews and review browsing
- Game metadata (developers, genres, platforms, publishers)

**Authenticated Routes** (Valid JWT required):

- Profile management and updating
- Creating, editing, and deleting reviews
- Social features (following, unfollowing, liking reviews)
- Activity feed and social statistics
- Review interactions (like/unlike)

**Admin/Moderator Routes** (Admin or Moderator role required):

- Game management (CRUD operations)
- Developer/Publisher/Genre/Platform management (Create, Update)
- User role management (Admin only)

**Admin-Only Routes** (Admin role required):

- Deleting games, developers, publishers, genres, platforms
- User account deletion
- Advanced user management

### Security Implementation

**Password Security:**

- bcryptjs with salt rounds of 12
- Password strength validation in DTOs
- Secure password reset flow with time-limited tokens

**JWT Security:**

- Separate secrets for access, refresh, and reset tokens
- Access tokens: 7 days expiration by default
- Refresh tokens: 30 days expiration by default
- Token refresh endpoint for seamless renewal
- Payload includes user ID, email, and role only

**Route Protection:**

- `JwtAuthGuard`: Validates JWT tokens globally
- `JwtRefreshGuard`: Validates refresh tokens for token renewal
- `LocalAuthGuard`: Validates username/password for login
- `RolesGuard`: Enforces role-based access control
- `@Public()` decorator: Bypasses auth for public routes
- `@Roles()` decorator: Specifies required roles for endpoints

**Advanced Security Features:**

- Rate limiting: 100 requests per minute per IP
- CORS configuration for frontend domains
- Helmet middleware for security headers
- Compression middleware for performance
- Input validation and sanitization via class-validator
- SQL injection prevention through Prisma ORM
- Global exception handling with custom filters
- Request/response transformation and logging

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

1. **Environment Variables:**
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

1. Set production environment variables (remove development URLs and secrets)
2. Run database migrations: `pnpm db:migrate:deploy`
3. Build application: `pnpm build`
4. Start production server: `pnpm start:prod`

**Production Considerations:**

- Set `NODE_ENV=production` to disable Swagger documentation
- Use secure JWT secrets (different from development)
- Configure proper CORS origins for production frontend
- Set up proper database connection pooling
- Enable logging and monitoring
- Configure rate limiting appropriate for production load

---

## Current Status and Future Roadmap

### Implemented Features (Current)

✅ **Authentication & Authorization**

- Complete JWT-based auth with refresh tokens
- Role-based access control (User, Admin, Moderator)
- Password management (change, reset, forgot)
- Secure route protection and guards

✅ **Game Catalog System**

- Full CRUD operations for games
- Comprehensive metadata management (developers, genres, platforms, publishers)
- Advanced search and filtering capabilities
- Game relationships and similar game suggestions

✅ **Review System**

- Create, read, update, delete reviews
- Review rating system (0-10 scale)
- Review interactions (like/unlike)
- Privacy controls (published/draft, spoiler flags)

✅ **Social Features**

- User following/unfollowing
- Activity feeds and social statistics
- Mutual connections discovery
- Follow suggestions
- User profile management

✅ **Technical Foundation**

- Comprehensive API documentation (Swagger)
- Advanced pagination and filtering
- Global error handling and validation
- Security best practices implementation
- Performance optimization (compression, rate limiting)

### Planned Features (Future)

🔄 **Enhanced Social Features**

- Comments on reviews
- Review discussions and threads
- User notifications system
- Advanced activity feed filtering

🔄 **Gamification**

- User achievements and badges
- Gaming statistics and analytics
- Personal gaming journals/questlogs
- Progress tracking for games

🔄 **External Integrations**

- Steam API integration for library sync
- Other gaming platform integrations (Epic, PlayStation, Xbox)
- Game metadata enrichment from external APIs

🔄 **Advanced Features**

- Game recommendations engine
- User-created game lists and collections
- Advanced search with AI/ML capabilities
- Real-time features (live notifications, chat)

This backend provides a solid foundation for the Questlog gaming social network, with a comprehensive feature set already implemented and clear pathways for future expansion into indie game showcases, external platform integrations, and advanced social gaming features.
