# @questlog/shared-types

Shared TypeScript types for the Questlog application, providing type safety between the backend API and frontend applications.

## Overview

This package contains all the shared TypeScript interfaces and types that define the data contracts between the Questlog backend and frontend applications. These types are derived from the backend DTOs (Data Transfer Objects) and provide complete type safety for API interactions.

## Installation

```bash
# In your frontend project
pnpm add @questlog/shared-types

# For development
pnpm add -D @questlog/shared-types
```

## Usage

```typescript
// Import specific types
import { UserResponse, GameResponse, ReviewResponse } from '@questlog/shared-types';

// Import entire modules
import * as AuthTypes from '@questlog/shared-types/auth';
import * as GameTypes from '@questlog/shared-types/games';

// Use in your components/services
const user: UserResponse = {
  id: '123',
  username: 'gamer123',
  // ... other fields
};
```

## Type Categories

### Authentication (`/auth`)
- **LoginRequest**, **RegisterRequest** - Authentication request DTOs
- **AuthResponse**, **AuthUser** - Authentication response types
- **UserRole** - User role enumeration
- **JwtPayload** - JWT token payload structure

### Users (`/users`)
- **UserResponse**, **UserProfile** - User data structures
- **UserStats** - User statistics (followers, reviews, etc.)
- **UpdateProfileRequest** - Profile update requests
- **UsersQuery** - User listing and search queries

### Games (`/games`)
- **GameResponse**, **GameBasic** - Game data structures
- **DeveloperResponse**, **PublisherResponse** - Game metadata entities
- **GenreResponse**, **PlatformResponse** - Game categorization
- **CreateGameRequest**, **UpdateGameRequest** - Game management DTOs
- **GamesQuery**, **GameFilters** - Game search and filtering
- **GameStatus** - Game release status enumeration

### Reviews (`/reviews`)
- **ReviewResponse** - Complete review data structure
- **CreateReviewRequest**, **UpdateReviewRequest** - Review management
- **ReviewsQuery**, **ReviewFilters** - Review search and filtering
- **ReviewUser**, **ReviewGame** - Review-specific entity references
- **ReviewStats** - Review engagement statistics

### Social (`/social`)
- **SocialStats** - User social statistics
- **ActivityItem**, **ActivityFeedResponse** - Activity feed structures
- **FollowSuggestion** - User recommendation system
- **SocialRelationship** - User relationship status
- **ActivityType** - Activity feed event types

### API (`/api`)
- **PaginatedResponse**, **PaginationMeta** - Pagination structures
- **ApiResponse**, **ApiError** - Standard API response formats
- **PaginationQuery**, **SortQuery**, **SearchQuery** - Common query types

### Utils (`/utils`)
- **LoadingState**, **AsyncState** - Frontend state management helpers
- **FormState** - Form handling utilities
- **Notification** - User notification system
- **DeepPartial**, **Optional**, **RequiredFields** - TypeScript utility types

## Type Safety Features

### Request/Response Contracts
All API endpoints have corresponding request and response types:

```typescript
// Login flow
const loginRequest: LoginRequest = {
  email: 'user@example.com',
  password: 'password123'
};

const authResponse: AuthResponse = await api.login(loginRequest);
// authResponse.user is fully typed
// authResponse.accessToken is string
```

### Pagination Support
Consistent pagination across all list endpoints:

```typescript
const gamesQuery: GamesQuery = {
  page: 1,
  limit: 20,
  search: 'witcher',
  genreIds: ['rpg-id'],
  sortBy: 'rating',
  sortOrder: 'desc'
};

const gamesResponse: PaginatedResponse<GameResponse> = await api.getGames(gamesQuery);
// gamesResponse.items is GameResponse[]
// gamesResponse.meta contains pagination info
```

### Filtering and Search
Comprehensive filtering types for all major entities:

```typescript
const reviewFilters: ReviewFilters = {
  gameId: 'game-123',
  minRating: 7,
  isPublished: true,
  dateFrom: new Date('2024-01-01')
};
```

## Frontend Integration Examples

### React with TypeScript
```typescript
import { UserResponse, UpdateProfileRequest } from '@questlog/shared-types';

interface UserProfileProps {
  user: UserResponse;
  onUpdate: (data: UpdateProfileRequest) => Promise<void>;
}

const UserProfile: React.FC<UserProfileProps> = ({ user, onUpdate }) => {
  // Component implementation with full type safety
};
```

### API Client Integration
```typescript
import { 
  AuthResponse, 
  LoginRequest, 
  PaginatedResponse, 
  GameResponse 
} from '@questlog/shared-types';

class ApiClient {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    // Implementation
  }

  async getGames(query?: GamesQuery): Promise<PaginatedResponse<GameResponse>> {
    // Implementation
  }
}
```

### State Management (Zustand/Redux)
```typescript
import { UserResponse, GameResponse } from '@questlog/shared-types';

interface AppState {
  user: UserResponse | null;
  favoriteGames: GameResponse[];
  // ... other state
}
```

## Development

### Building
```bash
pnpm build          # Build the package
pnpm dev            # Watch mode for development
pnpm type-check     # Type checking without build
```

### Adding New Types
1. Create or update files in the appropriate module directory (`/auth`, `/games`, etc.)
2. Export the new types from the module's `index.ts`
3. Ensure the main `src/index.ts` exports the module
4. Run `pnpm build` to verify no TypeScript errors

### Versioning
Types should be versioned carefully to avoid breaking changes:
- **Patch** (1.0.1): Adding optional fields, new types
- **Minor** (1.1.0): Adding new modules, non-breaking changes
- **Major** (2.0.0): Breaking changes to existing types

## Relationship to Backend

These types are directly derived from the backend DTOs and should be kept in sync:

- **Backend DTOs** (`apps/backend/src/**/*.dto.ts`) → **Shared Types** (this package)
- Backend validation decorators are removed (frontend handles validation separately)
- Swagger decorators are removed (documentation is in backend)
- Class-based DTOs become interface-based types

## Best Practices

1. **Import Specific Types**: Import only what you need for better tree-shaking
2. **Use Type Guards**: Implement runtime type checking for API responses
3. **Leverage Utility Types**: Use provided utility types for common patterns
4. **Follow Naming Conventions**: 
   - `*Request` for API request bodies
   - `*Response` for API response data
   - `*Query` for URL query parameters
   - `*Filter` for filtering objects

## Support

This package is part of the Questlog monorepo. For issues, feature requests, or questions:
- Check the main project documentation
- Open issues in the main repository
- Follow the contribution guidelines

---

**Note**: This package provides types only. For API client implementations, validation logic, or UI components, see the respective frontend packages.