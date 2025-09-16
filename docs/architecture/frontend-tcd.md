# Questlog Frontend - Technical Context Document

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

### Current Implementation Features

- **Hybrid Static/Dynamic Architecture**: Astro for static generation with React Islands for interactivity
- **Type-Safe API Client**: Complete integration with backend APIs using `@questlog/shared-types`
- **Responsive UI System**: Tailwind CSS v4 with custom component library
- **Authentication Flow**: Login, registration, password management with JWT token handling
- **Game Discovery**: Browse games with advanced filtering, search, and pagination
- **User Profiles**: Public user profiles with reviews, followers, and gaming statistics
- **Review System**: Create, edit, and interact with game reviews
- **Social Features**: Follow users, view activity feeds, and social interactions
- **Performance Optimization**: Code splitting, lazy loading, and optimized asset delivery

### Future Vision

The frontend is designed to scale into a comprehensive gaming social platform with indie game showcases, Steam integration for automatic library sync, gamification features, and real-time collaboration tools for gaming communities.

## 2. Technology Stack

### Core Technologies

- **Framework**: Astro 5.x (Static Site Generator with hybrid rendering)
- **UI Library**: React 19.x for interactive components (Islands Architecture)
- **Styling**: Tailwind CSS v4 with utility-first approach
- **Type Safety**: TypeScript with strict mode and `@questlog/shared-types` integration
- **State Management**: Nanostores for global state, React state for local component state
- **Build Tool**: Vite (integrated with Astro) for fast development and optimized builds
- **Package Manager**: PNPM with monorepo workspace support

### Key Dependencies

- **@astrojs/react**: React integration for Astro Islands
- **@nanostores/react**: React bindings for Nanostores state management
- **@questlog/shared-types**: Type-safe API contracts from backend
- **@questlog/ui-components**: Shared component library
- **@questlog/utils**: Shared utility functions
- **@tailwindcss/vite**: Tailwind CSS v4 Vite plugin
- **react**: React library for interactive components
- **react-dom**: React DOM rendering
- **tailwindcss**: Utility-first CSS framework

### Framework Choice Rationale

**Astro** was chosen for its:

- **Hybrid Architecture**: Perfect balance between static generation and dynamic interactivity
- **Islands Architecture**: Ship minimal JavaScript, only for components that need interactivity
- **SEO Optimization**: Server-side generation for excellent search engine visibility
- **Performance**: Zero JavaScript by default, progressive enhancement approach
- **Framework Agnostic**: Can integrate React, Vue, Svelte, or other frameworks as needed
- **Developer Experience**: Modern tooling with TypeScript, Vite, and hot module replacement

**React Islands** provide:

- **Selective Hydration**: Only interactive components are hydrated on the client
- **Framework Flexibility**: Can mix with other frameworks if needed in the future
- **Component Reusability**: Shared components across different parts of the application
- **Ecosystem**: Large ecosystem of libraries and tools

**Tailwind CSS v4** offers:

- **Utility-First**: Rapid UI development with consistent design system
- **Performance**: Purged CSS with only used utilities in production
- **Customization**: Extensive theming and customization capabilities
- **Responsive Design**: Mobile-first responsive design out of the box
- **Developer Experience**: IntelliSense support and consistent class naming

## 3. Architecture & Design Patterns

### Overall Architecture

The frontend follows a **hybrid static/dynamic architecture** with clear separation between static content and interactive features:

```tree
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Static Pages  │    │ React Islands   │    │   API Client    │
│   (Astro SSG)   │───▶│ (Interactive    │───▶│   (Type-Safe    │
│                 │    │  Components)    │    │   Backend)      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Directory Structure

```tree
src/
├── pages/                    # Astro pages (SSG/SSR)
│   ├── index.astro          # Home page
│   ├── games/               # Game catalog pages
│   │   ├── index.astro      # Games listing with SSG
│   │   └── [slug].astro     # Individual game pages (SSG)
│   ├── users/               # User profile pages
│   │   └── [username].astro # User profile pages (SSG)
│   ├── reviews/             # Review pages
│   │   └── [id].astro       # Individual review pages (SSG)
│   ├── auth/                # Authentication pages
│   │   ├── login.astro      # Login page
│   │   ├── register.astro   # Registration page
│   │   └── reset.astro      # Password reset page
│   ├── feed/                # Social feed (hybrid SSR/CSR)
│   │   └── index.astro      # Activity feed page
│   ├── admin/               # Admin panel (protected)
│   │   └── index.astro      # Admin dashboard
│   └── indie/               # Indie games showcase (future)
│       └── index.astro      # Indie showcase page
├── components/              # React components (Islands)
│   ├── ui/                  # Base UI components
│   │   ├── Button.tsx       # Button component variants
│   │   ├── Input.tsx        # Form input components
│   │   ├── Modal.tsx        # Modal dialog components
│   │   ├── Card.tsx         # Card layout components
│   │   └── index.ts         # UI components barrel export
│   ├── auth/                # Authentication components
│   │   ├── LoginForm.tsx    # Login form with validation
│   │   ├── RegisterForm.tsx # Registration form
│   │   ├── PasswordReset.tsx# Password reset form
│   │   └── AuthProvider.tsx # Authentication context
│   ├── games/               # Game-related components
│   │   ├── GameCard.tsx     # Game display card
│   │   ├── GameList.tsx     # Game listing with pagination
│   │   ├── GameSearch.tsx   # Game search and filtering
│   │   ├── GameDetails.tsx  # Detailed game information
│   │   └── SimilarGames.tsx # Similar games recommendations
│   ├── reviews/             # Review components
│   │   ├── ReviewForm.tsx   # Review creation/editing
│   │   ├── ReviewCard.tsx   # Review display component
│   │   ├── ReviewList.tsx   # Review listing with pagination
│   │   ├── RatingStars.tsx  # Star rating component
│   │   └── ReviewFilters.tsx# Review filtering controls
│   ├── social/              # Social features
│   │   ├── FeedItem.tsx     # Activity feed item
│   │   ├── ActivityFeed.tsx # Social activity feed
│   │   ├── FollowButton.tsx # Follow/unfollow button
│   │   ├── UserCard.tsx     # User profile card
│   │   └── SocialStats.tsx  # Social statistics display
│   ├── profile/             # User profile components
│   │   ├── ProfileHeader.tsx# Profile banner and info
│   │   ├── ProfileEdit.tsx  # Profile editing form
│   │   ├── UserReviews.tsx  # User's reviews list
│   │   └── FollowersList.tsx# Followers/following lists
│   ├── search/              # Search components
│   │   ├── SearchBar.tsx    # Global search component
│   │   ├── SearchFilters.tsx# Advanced search filters
│   │   └── SearchResults.tsx# Search results display
│   └── layout/              # Layout components
│       ├── Header.tsx       # Site header with navigation
│       ├── Footer.tsx       # Site footer
│       ├── Navigation.tsx   # Main navigation menu
│       └── Sidebar.tsx      # Sidebar for filters/info
├── layouts/                 # Astro layout components
│   ├── BaseLayout.astro     # Base HTML layout
│   ├── MainLayout.astro     # Main site layout
│   ├── AuthLayout.astro     # Authentication pages layout
│   └── AdminLayout.astro    # Admin panel layout
├── stores/                  # State management (Nanostores)
│   ├── auth.ts              # Authentication state
│   ├── theme.ts             # Theme and UI preferences
│   ├── search.ts            # Search state and filters
│   └── notifications.ts    # User notifications
├── services/                # API client services
│   ├── api.ts               # Base API client configuration
│   ├── auth.ts              # Authentication API calls
│   ├── games.ts             # Game-related API calls
│   ├── reviews.ts           # Review API calls
│   ├── social.ts            # Social features API calls
│   └── users.ts             # User management API calls
├── utils/                   # Utility functions
│   ├── constants.ts         # Application constants
│   ├── validation.ts        # Form validation schemas
│   ├── formatting.ts        # Date/text formatting utilities
│   ├── storage.ts           # Local storage utilities
│   └── auth.ts              # Authentication utilities
├── hooks/                   # React hooks
│   ├── useAuth.ts           # Authentication hook
│   ├── useApi.ts            # API calling hook with loading states
│   ├── useLocalStorage.ts   # Local storage hook
│   ├── useDebounce.ts       # Debouncing hook for search
│   └── usePagination.ts     # Pagination logic hook
├── types/                   # Frontend-specific types
│   ├── components.ts        # Component prop types
│   ├── pages.ts             # Page-specific types
│   └── stores.ts            # Store state types
└── styles/                  # Global styles and Tailwind
    ├── global.css           # Global CSS with Tailwind imports
    └── components.css       # Component-specific styles (if needed)
```

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

The application uses different rendering strategies based on content type and user interaction requirements:

### Static Pages (SSG - Static Site Generation)

**Game Catalog Pages**:

- `/games` - Games listing with pagination (pre-rendered)
- `/games/[slug]` - Individual game detail pages (pre-rendered from API data)
- Benefits: Fast loading, excellent SEO, cacheable content

**User Profiles**:

- `/users/[username]` - Public user profiles (pre-rendered)
- `/users/[username]/reviews` - User reviews (pre-rendered with pagination)
- `/users/[username]/followers` - Follower lists (pre-rendered)
- Benefits: Fast profile loading, social media sharing optimization

**Review Pages**:

- `/reviews/[id]` - Individual review detail pages (pre-rendered)
- Benefits: SEO optimization for review content, fast loading

**Marketing & Info Pages**:

- `/` - Home page with featured content
- `/about` - About page
- `/privacy` - Privacy policy
- `/terms` - Terms of service

### Hybrid Pages (SSR + Client Hydration)

**Authentication Pages**:

- `/auth/login` - Login form (static shell, dynamic form validation)
- `/auth/register` - Registration form (static shell, dynamic validation)
- `/auth/reset` - Password reset (static shell, dynamic form handling)

**Social Feed**:

- `/feed` - Activity feed (server-rendered initial content, client-side updates)
- Benefits: Fast initial load, real-time updates after hydration

### Client-Side Rendered Components (CSR)

**Interactive Features**:

- Search and filtering interfaces
- Form submissions and validation
- Social interactions (follow, like, comment)
- Real-time notifications
- User preference updates

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
import { useApi } from '../hooks/useApi';
import { getReviews } from '../services/reviews';
import type { ReviewsQuery, PaginatedResponse, ReviewResponse } from '@questlog/shared-types';

const ReviewList = ({ gameId }: { gameId: string }) => {
  const query: ReviewsQuery = { gameId, page: 1, limit: 10 };
  const { data, loading, error } = useApi(() => getReviews(query));
  
  // Component implementation...
};
```

## 5. State Management Architecture

### Global State (Nanostores)

**Authentication State** (`stores/auth.ts`):

```typescript
import { atom } from 'nanostores';
import type { AuthUser } from '@questlog/shared-types';

export const $currentUser = atom<AuthUser | null>(null);
export const $isAuthenticated = atom<boolean>(false);
export const $authToken = atom<string | null>(null);
```

**Theme & UI State** (`stores/theme.ts`):

```typescript
import { atom } from 'nanostores';

export const $theme = atom<'light' | 'dark'>('light');
export const $sidebarOpen = atom<boolean>(false);
```

**Search State** (`stores/search.ts`):

```typescript
import { atom } from 'nanostores';
import type { GamesQuery } from '@questlog/shared-types';

export const $searchQuery = atom<string>('');
export const $searchFilters = atom<Partial<GamesQuery>>({});
export const $searchResults = atom<any[]>([]);
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
import type { ApiResponse, ApiError } from '@questlog/shared-types';

class ApiClient {
  private baseURL = import.meta.env.PUBLIC_API_URL || 'http://localhost:3001/api';
  
  async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.getToken()}`,
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
  PaginatedResponse 
} from '@questlog/shared-types';

export const getGames = async (query?: GamesQuery): Promise<PaginatedResponse<GameResponse>> => {
  const searchParams = new URLSearchParams(query as any);
  return apiClient.request(`/games?${searchParams}`);
};

export const getGameBySlug = async (slug: string): Promise<GameResponse> => {
  return apiClient.request(`/games/${slug}`);
};
```

### React Hooks for API Integration

**useApi Hook** (`hooks/useApi.ts`):

```typescript
import { useState, useEffect } from 'react';

export const useApi = <T>(apiCall: () => Promise<T>, dependencies: any[] = []) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await apiCall();
        setData(result);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, dependencies);
  
  return { data, loading, error, refetch: () => fetchData() };
};
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
- Husky pre-commit hooks for quality assurance

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

### Implemented Foundation

✅ **Core Architecture**

- Astro + React Islands setup with TypeScript
- Tailwind CSS v4 integration
- Shared types integration from backend
- Basic component structure and patterns

✅ **Development Environment**

- PNPM workspace configuration
- Development server setup
- Build process configuration
- Code quality tools integration

### Implementation Priorities

🔄 **Authentication Flow**

- Login/register forms with validation
- JWT token management and persistence
- Protected route handling
- User session management

🔄 **Core Pages & Components**

- Game catalog with search and filtering
- User profiles with review listings
- Review creation and editing interface
- Social feed and activity tracking

🔄 **API Integration**

- Service layer implementation
- Error handling and loading states
- Type-safe API client setup
- Real-time features preparation

### Development Guidelines

1. **Type Safety First**: Always use types from `@questlog/shared-types` for API interactions
2. **Performance Conscious**: Default to static generation, use client-side rendering only when necessary
3. **Progressive Enhancement**: Ensure core functionality works without JavaScript
4. **Component Reusability**: Build composable components that work across different contexts
5. **Accessibility**: Include ARIA labels, keyboard navigation, and screen reader support
6. **Mobile-First**: Design and implement with mobile devices as the primary consideration

This frontend architecture provides a solid foundation for building a modern, performant, and scalable gaming social network that can grow to support advanced features while maintaining excellent user experience and developer productivity.
