# Questlog Frontend - Technical Context Document

**Last Updated:** November 4, 2025  
**Status:** Production Ready

## 1. High-Level Overview

**Questlog Frontend** is the user-facing application for the gaming social network, built with a modern hybrid architecture that combines static generation for optimal performance with interactive components for dynamic user experiences. The frontend serves as a progressive web application that allows gamers to discover games, write reviews, connect with other users, and build personalized gaming profiles.

### Core Functionality

- **Static Game Catalog**: Server-side generated pages for game profiles, user profiles, and discovery with optimal SEO and performance
- **Interactive Social Features**: Dynamic React components for user authentication, review creation, social feeds, and real-time interactions
- **Responsive Design**: Mobile-first approach with adaptive layouts for desktop, tablet, and mobile devices
- **Progressive Enhancement**: Works without JavaScript for core browsing, enhanced with JavaScript for interactivity
- **Type-Safe API Integration**: Complete type safety for all backend API interactions using shared type definitions
- **State Management**: Efficient client-side state with Nanostores for global state and React state for component-level interactions
- **Search & Discovery**: Advanced filtering and search capabilities for games, users, and reviews
- **User Experience**: Optimized loading states, error handling, and accessibility features
- **Admin Panel**: Role-based admin interface for content management and user administration

### Current Implementation Features

- **Server-Side Rendering Architecture**: Astro 5.x with SSR by default and opt-in static generation using `export const prerender = true`
- **React 19.x Islands**: Selective client-side hydration for interactive components with Radix UI primitives
- **Type-Safe API Client**: Complete integration with backend APIs using `@questlog/shared-types`
- **Accessible Component Library**: Radix UI primitives (Avatar, Dialog, Tabs) with Tailwind CSS styling
- **Responsive UI System**: Mobile-first Tailwind CSS v4 design with responsive grids and Lucide React icons
- **Authentication System**: Complete login/register flow with JWT token management, role-based access control, and persistent authentication
- **User Profile Feature**: Complete implementation with ProfileHeader, ProfileTabs, FollowList, ReviewList, and EditProfileDialog
- **Optimistic UI Updates**: Follow/unfollow actions with instant feedback and automatic rollback on errors
- **Game Management**: Comprehensive games catalog with search, filtering, pagination, and detailed game pages
- **Review System**: Full review CRUD operations with ratings, social interactions (like/unlike), and game-specific reviews
- **Social Features**: User profiles, activity feeds, follow/unfollow functionality, and social statistics
- **Admin Dashboard**: Role-based admin panel for managing games, users, reviews, and platform content
- **Developer Tools**: Complete service layer architecture with specialized hooks for each domain
- **State Management**: Comprehensive Nanostores implementation with persistent auth state and optimistic updates
- **Performance Optimization**: SSR for initial page load, code splitting, lazy loading, caching strategies, and optimized asset delivery
- **SEO Optimization**: Dynamic meta tags, Open Graph, structured data (Schema.org), and canonical URLs

### Future Vision

The frontend is designed to scale into a comprehensive gaming social platform with indie game showcases, Steam integration for automatic library sync, gamification features, and real-time collaboration tools for gaming communities.

## 2. Technology Stack

### Core Technologies

- **Framework**: Astro 5.x (Static Site Generator)
- **UI Library**: React 19.x for interactive components (Islands Architecture)
- **UI Components**: Radix UI primitives for accessible, unstyled components
- **Styling**: Tailwind CSS v4 with @tailwindcss/vite plugin
- **State Management**: Nanostores for efficient client-side state
- **Type Safety**: TypeScript 5.9+ with strict mode
- **Icons**: Lucide React for consistent iconography
- **Routing**: File-based routing with Astro pages

### Key Dependencies

- **@astrojs/react**: React integration for Astro (v4.3.1)
- **@astrojs/node**: Node.js adapter for SSR capabilities (v9.5.0)
- **@astrojs/vercel**: Vercel deployment adapter (v8.2.6)
- **@nanostores/react**: React bindings for Nanostores (v1.0.0)
- **@radix-ui/react-\***: Accessible component primitives
- **@questlog/shared-types**: Shared TypeScript types with backend
- **class-variance-authority**: For component variant management
- **tailwindcss**: v4.1.12 with Vite plugin

## 3. Architecture & Directory Structure

The frontend follows a component-based architecture with clear separation of concerns:

```text
src/
├── components/              # React components
│   ├── ui/                 # Base UI components (Button, Input, etc.)
│   ├── auth/               # Authentication components (LoginForm, RegisterForm)
│   ├── games/              # Game components (GameCard, GameDetail, GameFilters)
│   ├── reviews/            # Review components (ReviewCard, ReviewForm)
│   ├── social/             # Social components (ActivityFeed, FollowButton)
│   ├── profile/            # Profile components (ProfileHeader, ProfileTabs)
│   └── layout/             # Layout components (Navbar, Footer)
├── pages/                  # Astro pages (file-based routing)
│   ├── index.astro        # Home page
│   ├── feed/              # Activity feed pages
│   ├── games/             # Games catalog and details
│   ├── profile/           # User profiles
│   ├── reviews/           # Review pages
│   └── auth/              # Authentication pages
├── layouts/               # Page layouts
│   └── MainLayout.astro   # Main layout with header/footer
├── stores/                # Nanostores state management
├── services/              # API client services
├── hooks/                 # React hooks
├── utils/                 # Utility functions
├── types/                 # TypeScript type definitions
├── scripts/               # Client-side scripts
└── styles/                # Global styles
    └── global.css         # Tailwind imports and custom styles
```

## 4. Page Types & Rendering Strategy

The application uses **static output by default** configured in `astro.config.mjs` with `output: 'static'`. Specific routes can opt into server-side rendering using `export const prerender = false`.

### Rendering Configuration

```javascript
// astro.config.mjs
export default defineConfig({
  output: 'static', // Static generation by default
  adapter: vercel(), // Vercel adapter for deployment
  // ...
});
```

### Current Route Implementations

**Static Pages (Default - SSG)**:

- `/` - Home page with static content
- `/auth/login` - Login form (static with client-side validation)
- `/auth/register` - Registration form (static with client-side validation)
- `/feed` - Activity feed shell (static shell, client-side data fetching)
- `/reviews` - Reviews listing (static first page)

**Dynamic Pages (SSR - `prerender: false`)**:

- `/games` - Games catalog with dynamic filtering and pagination
- `/games/[slug]` - Game detail pages (SSR for dynamic content)
- `/profile/[username]` - User profiles (SSR for real-time data)
- `/reviews/[id]` - Review detail pages (SSR for interactions)

### Rendering Patterns

**1. Static Shell Pattern** (used in `/feed`):

```astro
---
// Static shell at build time
import ActivityFeedPage from '@/components/social/ActivityFeedPage';
---

<MainLayout>
  <!-- Client component fetches and renders the feed -->
  <ActivityFeedPage client:load />
</MainLayout>
```

**2. Server-Side Rendering Pattern** (used in `/profile/[username]`):

```astro
---
export const prerender = false; // Enable SSR for this route

import ProfilePage from '@/components/profile/ProfilePage';
import { fetchUserProfile } from '@/services/users';

const { username } = Astro.params;
const profile = await fetchUserProfile(username);
---

<MainLayout>
  <ProfilePage profile={profile} username={username} client:load />
</MainLayout>
```

**3. Client-Only Data Fetching**:

- Used for auth-protected, user-specific data
- Keeps static pages cacheable while preserving privacy
- Examples: Activity feed, follow lists, user statistics

## 5. Component Architecture

### Islands Architecture

React components are hydrated selectively using Astro's Islands:

- `client:load` - Hydrate immediately (interactive components)
- `client:idle` - Hydrate when browser is idle
- `client:visible` - Hydrate when component is visible
- `client:only` - Skip server rendering, client-only

### Component Categories

**1. UI Components** (`components/ui/`):

- Base design system components
- Button, Input, Dialog, Tabs, Avatar
- Built with Radix UI primitives + Tailwind CSS
- Fully accessible and type-safe

**2. Feature Components**:

- Game-related: GameCard, GameDetail, GameFilters
- Reviews: ReviewCard, ReviewForm, ReviewList
- Social: ActivityFeed, FollowButton, FollowList
- Profile: ProfileHeader, ProfileTabs, EditProfileDialog

**3. Layout Components**:

- Navbar with responsive mobile menu
- Footer with site links
- ThemeToggle for dark/light mode

### State Management Architecture

**Global State (Nanostores)**:

### Key Design Patterns

1. **Islands Architecture**: Interactive components are isolated islands in a sea of static content
2. **Progressive Enhancement**: Core functionality works without JavaScript, enhanced with interactivity
3. **Static-First**: Default to static generation, opt into server-side rendering only when needed
4. **Component Composition**: Reusable components that compose into larger features
5. **Type-Safe API Integration**: All API calls use shared types for complete type safety
6. **Store Pattern**: Global state managed with Nanostores, local state with React
7. **Service Layer Pattern**: API calls abstracted into service functions with error handling

### Cross-Cutting Concerns

- **Type Safety**: Complete type safety from API responses to component props using `@questlog/shared-types`
- **Error Handling**: Centralized error handling with user-friendly error messages and fallbacks
- **Loading States**: Consistent loading indicators and skeleton screens across the application
- **Authentication**: JWT token management with automatic refresh and route protection
- **Responsive Design**: Mobile-first responsive design with Tailwind CSS breakpoints
- **Performance**: Code splitting, lazy loading, and optimized asset delivery
- **SEO**: Server-side generation for optimal search engine visibility
- **Accessibility**: ARIA labels, keyboard navigation, and screen reader support

## 4. Page Types & Rendering Strategy

The application uses **Server-Side Rendering (SSR) by default** with opt-in static generation for specific pages. This is configured in `astro.config.mjs` with `output: 'server'` and `adapter: node()`.

### Rendering Configuration

```javascript
// astro.config.mjs
export default defineConfig({
  output: "server", // SSR by default
  adapter: node({ mode: "standalone" }),
  // ...
});
```

### Static Pages (Opt-in SSG with `export const prerender = true`)

**Authentication Pages**:

- `/auth/login` - Login form (static with client-side validation)
- `/auth/register` - Registration form (static with client-side validation)
- Benefits: Fast loading, cacheable, no server computation needed

**Marketing & Info Pages** (Future):

- `/` - Home page with featured content
- `/about` - About page
- `/privacy` - Privacy policy
- `/terms` - Terms of service

**Usage Pattern**:

```astro
---
// Add this directive to opt into static generation
export const prerender = true;

import LoginForm from '@/components/auth/LoginForm';
---

<MainLayout>
  <LoginForm client:load />
</MainLayout>
```

### Server-Side Rendered Pages (SSR - Default)

**User Profiles**:

- `/profile/[username]` - Dynamic user profiles (server-rendered with client hydration)
- Benefits: Real-time data, personalized content, SEO optimization
- Pattern: Server fetches data → Hydrates React Islands with initial data → Client loads additional data

**Game Pages** (Future):

- `/games` - Games listing with pagination
- `/games/[slug]` - Individual game detail pages
- Benefits: Dynamic content, search indexing, personalized recommendations

**Review Pages** (Future):

- `/reviews/[id]` - Individual review detail pages
- Benefits: Real-time review data, social interactions

**Social Feed** (Future):

- `/feed` - Personalized activity feed
- Benefits: Dynamic content, authentication-based data, real-time updates

### Server-Side Rendering Pattern

```astro
---
// No prerender directive = SSR by default
import ProfilePage from '@/components/profile/ProfilePage';
import { fetchUserProfile } from '@/services/users';

const { username } = Astro.params;

// Server-side data fetching
const profile = await fetchUserProfile(username);

if (!profile) {
  return new Response(null, { status: 404 });
}
---

<MainLayout>
  <!-- Hydrate with server-fetched data -->
  <ProfilePage profile={profile} username={username} client:load />
</MainLayout>
```

### Client-Side Rendered Components (CSR Islands)

**Interactive Features** (React Islands with `client:load` directive):

- Profile editing modal (Radix Dialog)
- Follow/unfollow buttons with optimistic updates
- Review creation and editing forms
- Search and filtering interfaces
- Social interactions (like, comment)
- Tab navigation (Radix Tabs)
- User preference updates

**Hydration Directives**:

- `client:load` - Hydrate immediately on page load (interactive components)
- `client:idle` - Hydrate when browser is idle (lower priority)
- `client:visible` - Hydrate when component is visible (lazy loading)
- `client:only` - Skip server rendering, client-only (rare cases)

### API Integration Strategy

**Server-Side Data Fetching**:

```typescript
// In Astro pages (.astro files)
---
import { getGameBySlug } from '../services/games';
import type { GameResponse } from '@questlog/shared-types';

const { slug } = Astro.params;
const game: GameResponse = await getGameBySlug(slug);
---
```

**Client-Side Data Fetching**:

```typescript
// In React components (.tsx files)
import { useApi } from "../hooks/useApi";
import { getReviews } from "../services/reviews";
import type {
  ReviewsQuery,
  PaginatedResponse,
  ReviewResponse,
} from "@questlog/shared-types";

const ReviewList = ({ gameId }: { gameId: string }) => {
  const query: ReviewsQuery = { gameId, page: 1, limit: 10 };
  const { data, loading, error } = useApi(() => getReviews(query));

  // Component implementation...
};
```

## 5. State Management Architecture

### Global State (Nanostores)

**Explore State** (`stores/explore.ts`):

```typescript
// Manages explore page filters, selected facets and query params
// Persisted in memory and syncs with querystring for server requests
export const $exploreFilters = atom<ExploreFilters | null>(null);
export const $exploreLoading = atom<boolean>(false);
```

**Authentication State** (`stores/auth.ts`):

```typescript
import { atom, computed } from "nanostores";
import type { AuthUser, UserRole } from "@questlog/shared-types";

// Core authentication state
export const $currentUser = atom<AuthUser | null>(null);
export const $authToken = atom<string | null>(null);
export const $refreshToken = atom<string | null>(null);
export const $authLoading = atom<boolean>(false);
export const $authError = atom<string | null>(null);

// Computed state selectors
export const $isAuthenticated = computed($currentUser, (user) => user !== null);
export const $userRole = computed(
  $currentUser,
  (user): UserRole | null => (user?.role as UserRole) || null,
);
export const $isAdmin = computed($userRole, (role) => role === "ADMIN");
export const $isModerator = computed(
  $userRole,
  (role) => role === "MODERATOR" || role === "ADMIN",
);
export const $displayName = computed(
  $currentUser,
  (user) => user?.username || "Anonymous",
);
```

**Games State** (`stores/games.ts`):

```typescript
import { atom } from "nanostores";
import type {
  GameResponse,
  GameDetail,
  PaginatedGamesResponse,
} from "@questlog/shared-types";

// Games list state
export const $gamesData = atom<PaginatedGamesResponse | null>(null);
export const $gamesLoading = atom<boolean>(false);
export const $gamesError = atom<string | null>(null);

// Game detail state
export const $gameDetail = atom<GameDetail | null>(null);
export const $currentGameSlug = atom<string | null>(null);
export const $gameDetailLoading = atom<boolean>(false);
export const $gameDetailError = atom<string | null>(null);

// Similar games state
export const $similarGames = atom<GameResponse[] | null>(null);
export const $similarGamesLoading = atom<boolean>(false);
```

**Reviews State** (`stores/reviews.ts`):

```typescript
import { atom } from "nanostores";
import type {
  ReviewResponse,
  PaginatedReviewsResponse,
} from "@questlog/shared-types";

// Reviews list state
export const $reviewsData = atom<PaginatedReviewsResponse | null>(null);
export const $reviewsLoading = atom<boolean>(false);
export const $reviewsError = atom<string | null>(null);

// Review detail state
export const $reviewDetail = atom<ReviewResponse | null>(null);
export const $currentReviewId = atom<string | null>(null);
export const $reviewDetailLoading = atom<boolean>(false);

// User reviews state
export const $userReviews = atom<PaginatedReviewsResponse | null>(null);
export const $userReviewsLoading = atom<boolean>(false);
export const $currentUserReviewsId = atom<string | null>(null);

// Game reviews state
export const $gameReviews = atom<PaginatedReviewsResponse | null>(null);
export const $gameReviewsLoading = atom<boolean>(false);
export const $currentGameReviewsId = atom<string | null>(null);

// Review actions state
export const $reviewActionLoading = atom<boolean>(false);
export const $reviewActionError = atom<string | null>(null);
```

### Local Component State

**Form State**:

- React `useState` for form inputs and validation
- Form libraries like React Hook Form for complex forms
- Validation with Zod schemas (shared with backend)

**UI State**:

- Modal open/close state
- Loading indicators
- Error messages
- Pagination state

**Component-Specific Data**:

- Component-level API data that doesn't need global sharing
- Temporary UI state like accordion expand/collapse
- Form draft states

### State Persistence

**Local Storage**:

- User authentication tokens (with secure handling)
- Theme preferences
- Search history and saved filters
- Draft content (reviews, comments)

**Session Storage**:

- Temporary navigation state
- Form data preservation during page navigation
- Search state during user sessions

## 6. API Integration & Type Safety

### Type-Safe API Client

**Base API Configuration** (`services/api.ts`):

```typescript
import type { ApiResponse, ApiError } from "@questlog/shared-types";

class ApiClient {
  private baseURL =
    import.meta.env.PUBLIC_API_URL || "http://localhost:3001/api";

  async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.getToken()}`,
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const error: ApiError = await response.json();
      throw new Error(error.message);
    }

    const apiResponse: ApiResponse<T> = await response.json();
    return apiResponse.data;
  }

  private getToken(): string | null {
    // Token management implementation
  }
}
```

**Service Layer Implementation**:

```typescript
// services/games.ts
import type {
  GameResponse,
  GamesQuery,
  PaginatedResponse,
} from "@questlog/shared-types";

export const getGames = async (
  query?: GamesQuery,
): Promise<PaginatedResponse<GameResponse>> => {
  const searchParams = new URLSearchParams(query as any);
  return apiClient.request(`/games?${searchParams}`);
};

export const getGameBySlug = async (slug: string): Promise<GameResponse> => {
  return apiClient.request(`/games/${slug}`);
};
```

### React Hooks for API Integration

**useAuth Hook** (`hooks/useAuth.ts`):

```typescript
import { useCallback } from "react";
import { useStore } from "@nanostores/react";
import type {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
} from "@questlog/shared-types";
import { login, register, logout } from "@/services/auth";
import {
  $currentUser,
  $authToken,
  $authLoading,
  $authError,
} from "@/stores/auth";

export function useAuth() {
  const user = useStore($currentUser);
  const authToken = useStore($authToken);
  const isLoading = useStore($authLoading);
  const error = useStore($authError);

  const isAuthenticated = !!user && !!authToken;

  const loginUser = useCallback(
    async (credentials: LoginRequest): Promise<AuthResponse> => {
      return await login(credentials);
    },
    [],
  );

  const registerUser = useCallback(
    async (userData: RegisterRequest): Promise<AuthResponse> => {
      return await register(userData);
    },
    [],
  );

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login: loginUser,
    register: registerUser,
    logout,
  };
}
```

**useReviews Hook** (`hooks/useReviews.ts`):

```typescript
import { useCallback } from "react";
import { useStore } from "@nanostores/react";
import type {
  ReviewsQuery,
  CreateReviewRequest,
  UpdateReviewRequest,
} from "@questlog/shared-types";
import { reviewsService } from "@/services/reviews";
import { $reviewsData, $reviewsLoading, $reviewsError } from "@/stores/reviews";

export function useReviews() {
  const data = useStore($reviewsData);
  const isLoading = useStore($reviewsLoading);
  const error = useStore($reviewsError);

  const fetchReviews = useCallback(async (query?: ReviewsQuery) => {
    return await reviewsService.getAllReviews(query);
  }, []);

  const createReview = useCallback(async (reviewData: CreateReviewRequest) => {
    return await reviewsService.createReview(reviewData);
  }, []);

  const updateReview = useCallback(
    async (reviewId: string, updateData: UpdateReviewRequest) => {
      return await reviewsService.updateReview(reviewId, updateData);
    },
    [],
  );

  return {
    data,
    isLoading,
    error,
    fetchReviews,
    createReview,
    updateReview,
    deleteReview: reviewsService.deleteReview,
    likeReview: reviewsService.likeReview,
    unlikeReview: reviewsService.unlikeReview,
  };
}
```

### Error Handling Strategy

**Global Error Boundary**:

```typescript
// components/ErrorBoundary.tsx
import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} />;
    }

    return this.props.children;
  }
}
```

**API Error Handling**:

- Centralized error handling in API client
- User-friendly error messages
- Automatic token refresh on authentication errors
- Retry mechanisms for network failures

## 7. Performance Optimization

### Build-Time Optimizations

**Static Generation**:

- Pre-render all game pages, user profiles, and reviews at build time
- Generate sitemap and RSS feeds for SEO
- Optimize images with Astro's image optimization

**Code Splitting**:

- Automatic route-based code splitting with Astro
- Dynamic imports for heavy components
- Lazy loading for React Islands

**Asset Optimization**:

- Image optimization and responsive images
- CSS purging with Tailwind CSS
- JavaScript minification and compression

### Runtime Optimizations

**React Islands Optimization**:

- Selective hydration only for interactive components
- Minimal JavaScript payload for static content
- Progressive enhancement approach

**Caching Strategy**:

- Browser caching for static assets
- API response caching with service workers
- Local storage for frequently accessed data

**Performance Monitoring**:

- Core Web Vitals tracking
- Bundle size monitoring
- API response time monitoring

### Loading States & UX

**Skeleton Screens**:

- Loading skeletons for game cards, user profiles, and reviews
- Progressive loading of content sections
- Smooth transitions between loading and loaded states

**Optimistic Updates**:

- Immediate UI updates for user actions (like, follow)
- Rollback mechanisms for failed operations
- Pending state indicators for ongoing operations

## 8. Development Workflow & Tools

### Development Environment

**Local Development**:

```bash
# Start development server
pnpm dev                     # Astro dev server with hot reload
pnpm dev:frontend           # Frontend only development

# Build and preview
pnpm build                  # Production build
pnpm preview                # Preview production build locally
```

**Development Features**:

- Hot module replacement for React components
- Fast refresh for instant updates
- TypeScript integration with VS Code
- Astro dev tools for debugging

### Code Quality Tools

**TypeScript Configuration**:

- Strict mode enabled for maximum type safety
- Path mapping for clean imports
- Integration with `@questlog/shared-types`

**Linting & Formatting**:

- ESLint with React and Astro-specific rules
- Prettier for consistent code formatting

**Testing Strategy**:

- Unit tests with Jest and React Testing Library
- Component testing with Storybook (future)
- E2E tests with Cypress (shared with backend)
- Visual regression testing (future)

### Build Process

**Production Build**:

```bash
pnpm build                  # Build static assets and pages
pnpm build:analyze          # Analyze bundle size
```

**Build Outputs**:

- Static HTML pages for SSG routes
- Optimized JavaScript bundles for React Islands
- Purged CSS with only used Tailwind utilities
- Optimized images and assets

**Deployment Configuration**:

- Vercel deployment with automatic previews
- Environment variable management
- CDN configuration for static assets
- Progressive Web App features (future)

## 9. Future Enhancements & Roadmap

### Near-Term Features (Next 3 months)

**Enhanced Interactivity**:

- Real-time notifications using WebSockets
- Advanced search with autocomplete and filters
- Infinite scrolling for feeds and lists
- Keyboard navigation and shortcuts

**Performance Improvements**:

- Service worker for offline functionality
- Background sync for user actions
- Image lazy loading with intersection observer
- Bundle optimization and tree shaking

### Auth Form Revert

Note: a previous refactor that replaced `LoginForm.tsx` and `RegisterForm.tsx` with `@radix-ui/react-form`-based implementations was reverted after discovering client hydration errors in production-like builds. The forms remain implemented with the project's stable form approach to preserve reliable hydration; revisiting a Radix-form implementation will require a controlled migration and hydration testing.

### Medium-Term Features (3-6 months)

**Advanced Social Features**:

- Real-time chat and messaging
- User-generated content moderation
- Advanced activity feed filtering
- Social sharing optimizations

**Indie Game Showcase**:

- Developer dashboard for game submissions
- Interactive game demos and trailers
- Analytics dashboard for developers
- Featured content management system

### Long-Term Vision (6+ months)

**Platform Integration**:

- Steam OAuth integration
- Automatic game library sync
- Achievement tracking and display
- Cross-platform gaming statistics

**Advanced Features**:

- AI-powered game recommendations
- Voice search and accessibility features
- Mobile app with React Native
- Advanced analytics and user insights

## Current Status and Implementation Guidelines

### Implemented Features

✅ **Core Architecture**

- Astro 5.x + React 19.x Islands setup with TypeScript
- Tailwind CSS v4 integration with shared config
- Complete shared types integration from backend
- Comprehensive component architecture and patterns
- Vercel deployment integration

✅ **Authentication System**

- Complete login/register forms with validation using Zod schemas
- JWT token management with automatic refresh
- Persistent authentication state with localStorage
- Role-based access control (USER/ADMIN/MODERATOR)
- Protected route handling and guest-only routes
- User session management with auth state persistence

✅ **Core Pages & Components**

- Complete authentication pages (login, register)
- Responsive navigation with mobile menu support
- Theme toggle component with system preferences
- Base layouts for different page types
- NoScript fallbacks for progressive enhancement
- Footer component with proper styling

✅ **API Integration**

- Complete service layer implementation for all domains
- Comprehensive error handling and loading states
- Type-safe API client with automatic token management
- Specialized hooks for each service domain
- Caching strategies for game details and user data
- Optimistic updates for social interactions

✅ **State Management**

- Complete Nanostores implementation for all domains
- Authentication state with computed selectors
- Games catalog and detail state management
- Reviews CRUD state with pagination support
- Social features state (follows, likes, activity feed)
- Admin panel state management
- Persistent state for authentication and user preferences

✅ **Game Management**

- Games catalog with search, filtering, and pagination
- Game detail pages with comprehensive information
- Similar games recommendations
- Game caching and optimization strategies
- Support for game developers, publishers, genres, and platforms

✅ **Review System**

- Complete review CRUD operations
- Rating system implementation
- Review pagination and filtering by game/user
- Social interactions (like/unlike reviews)
- Review moderation capabilities
- Optimistic updates for review actions

✅ **Social Features**

- User profile management
- Activity feed implementation
- Follow/unfollow functionality
- Social statistics tracking
- User search and discovery

✅ **Admin Dashboard**

- Role-based admin panel access
- Content management interfaces
- User administration capabilities
- Game and review moderation tools
- Admin-specific API endpoints and services

### Implementation Priorities for Enhancement

✅ **Profile Feature - COMPLETE**

- ✅ ProfilePage component with SSR data initialization
- ✅ ProfileHeader with Radix Avatar, responsive layout, stats
- ✅ ProfileTabs with Radix Tabs for navigation
- ✅ ReviewList with infinite scroll and responsive grid (mobile: 1 col, tablet: 2 cols, desktop: 3 cols)
- ✅ FollowList with pagination and responsive grid
- ✅ FollowButton with optimistic updates and error rollback
- ✅ EditProfileDialog with Radix Dialog
- ✅ Mobile-first responsive design throughout
- ✅ Loading skeletons for all content sections
- ✅ SEO optimization with dynamic meta tags and structured data

🔧 **Games & Reviews Pages**

- Implement games catalog page with search and filtering
- Create game detail pages with SSR
- Build review detail pages with social interactions
- Add review creation and editing forms

🔧 **Advanced Features**

- Real-time notifications and WebSocket integration
- Advanced search with autocomplete
- Image optimization and lazy loading
- PWA features and offline functionality
- Activity feed with real-time updates

🔧 **Performance & UX**

- Implement service workers for caching
- Add background sync for user actions
- Further optimize bundle sizes and code splitting
- Expand error boundaries to all major sections
- Add more loading states and skeleton screens

### Development Guidelines

1. **Type Safety First**: Always use types from `@questlog/shared-types` for API interactions - fully implemented across all services and hooks
2. **Performance Conscious**: Default to static generation, use client-side rendering only when necessary - architecture supports hybrid rendering
3. **Progressive Enhancement**: Ensure core functionality works without JavaScript - NoScript fallbacks implemented
4. **Component Reusability**: Build composable components that work across different contexts - component architecture established
5. **Accessibility**: Include ARIA labels, keyboard navigation, and screen reader support - responsive navigation implemented
6. **Mobile-First**: Design and implement with mobile devices as the primary consideration - mobile-responsive navigation and layouts
7. **State Management**: Leverage comprehensive Nanostores implementation for consistent global state
8. **Error Handling**: Use established error handling patterns across all API services
9. **Caching**: Utilize implemented caching strategies for optimal performance
10. **Role-Based Access**: Leverage role-based authentication system for proper access control

### Architecture Strengths

This frontend implementation demonstrates several architectural strengths:

- **Complete Service Layer**: All backend domains have corresponding frontend services with comprehensive error handling
- **Consistent State Management**: Nanostores implementation across all features with computed selectors and actions
- **Type Safety**: Complete integration with shared types package ensures API contract adherence
- **Scalable Hook Architecture**: Domain-specific hooks provide consistent patterns for component integration
- **Authentication System**: Robust authentication with role-based access, persistence, and automatic token management
- **Performance Optimization**: Caching strategies, optimistic updates, and efficient state management
- **Developer Experience**: Comprehensive TypeScript integration, consistent patterns, and clear separation of concerns

This frontend architecture provides a solid, well-implemented foundation for a modern, performant, and scalable gaming social network with most core features already implemented and ready for UI enhancement and advanced feature development.
