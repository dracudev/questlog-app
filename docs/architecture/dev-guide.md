# 📘 Questlog - Development Guide

**Last Updated:** November 4, 2025  
**Status:** Production Ready

## 1. Requirements Analysis (ERS)

### 1.1 System Objective

Questlog is a social network focused on **video games**, similar to Letterboxd but for gamers.  
It will allow users to:

- Create a personal profile.
- Write video game reviews.
- Connect with other users (follow / friend).
- Access a dynamic feed with the most recent reviews.
- Consult detailed information about video games from an internal database or public APIs.

In the future, it will integrate with the Steam API for login and game library data, and will function as a **showcase for indie mobile games**, allowing demos or store links to be displayed.

---

### 1.2 Functional Requirements

1. **User Authentication**
   - Registration and login with email/password and JWT.
   - Different roles:
     - **Administrator**: access to moderation panel (users, reviews).
     - **Registered user**: create reviews, follow other users, comment.
     - **Guest (not logged in)**: can only browse public reviews and profiles.

2. **Profile Management**
   - Each user will have a public profile with photo, bio, and list of reviews.

3. **Video Game Management**
   - Database with at least 5 related tables.
   - Video game catalog with technical sheet, cover, release date.

4. **Reviews**
   - CRUD for reviews (create, read, update, delete).
   - Useful vote / "like" on reviews.

5. **Social Feed**
   - Section where the user sees reviews from people they follow.

6. **User Connections**
   - Follow/unfollow users.
   - View activity of followed users.

---

### 1.3 Non-Functional Requirements

- **Scalability:** system designed to support growth in users and data.
- **Security:** passwords with hash (bcrypt), input validation, JWT for sessions.
- **Availability:** uptime ≥ 99% in production.
- **Usability:** clear and responsive interface (mobile / desktop).
- **Internationalization:** initial support in English and Spanish.

---

## 2. System Design

### 2.1 Architecture

- **Frontend:** Astro 5.x + React 19.x Islands + Tailwind CSS v4.
  - Static pages for optimal performance and SEO (SSG by default).
  - Interactive components in React Islands with selective hydration.
  - Radix UI primitives for accessible component foundations.
- **Backend:** NestJS 11.x (Node.js) + TypeScript + REST API.
- **Database:** PostgreSQL 13+ with Prisma ORM v6.14.0.
- **Authentication:** JWT with HTTP-only cookies for session management.
- **Deployment:**
  - Frontend → Vercel (static hosting with edge functions).
  - Backend → Railway/Render (containerized deployment).
  - Database → Neon/Supabase (managed PostgreSQL).

---

### 2.2 Data Model

- **User**
  - id, username, email, password_hash, bio, avatar, role

- **Game**
  - id, title, description, release_date, cover_image, developer_id

- **Developer**
  - id, name, country

- **Review**
  - id, user_id, game_id, rating, content, created_at

- **Follow**
  - follower_id, followed_id

**Relationships:** User ↔ Review, User ↔ Follow, Game ↔ Review, Game ↔ Developer

---

### 2.3 Web Sections

1. **Home / Feed**
2. **Explore video games**
3. **Reviews**
4. **User profile**
5. **Admin panel**
6. **Login / Register**

---

## 3. Implementation

### 3.1 Backend (REST API + GraphQL with NestJS)

The backend will be built with **NestJS**, structured in modules that expose both **REST endpoints** and **GraphQL resolvers**. Both share the same **services** and **entities** in the domain layer, avoiding duplicated logic.

#### 🔹 REST Endpoints (Core / MVP)

REST will be used for simpler, cacheable, and well-documented cases (e.g., via Swagger):

- `/auth` → login, register (JWT).
- `/users` → user and profile management.
- `/games` → list and detail of video games.
- `/reviews` → basic CRUD for reviews.
- `/follows` → follow / unfollow users.

#### 🔹 GraphQL Schema (Social / Complex Relations)

GraphQL will be used for dynamic queries and relationships between entities (feed, search, recommendations):

- **Queries**
  - `me` → authenticated user data.
  - `feed(limit, offset)` → latest reviews from followed users.
  - `game(id)` → game details + related reviews.
  - `user(id)` → user profile + reviews and followers.

- **Mutations**
  - `createReview(gameId, text, rating)` → create a new review.
  - `followUser(userId)` / `unfollowUser(userId)`.
  - `updateProfile(...)` → update profile information.

#### 🔹 Roles & Permissions

- Implemented with **NestJS middleware + guards** to validate:
  - JWT authentication.
  - Role (`user`, `admin`).
- Permission differentiation:
  - Guest (no login) → read-only access to public games and reviews.
  - User → CRUD reviews, follow users, customize profile.
  - Admin → moderation (delete reviews, manage users).

#### 🔹 Technical Infrastructure

- **NestJS Modules**: `AuthModule`, `UsersModule`, `GamesModule`, `ReviewsModule`, `FollowsModule`.
- **Prisma ORM** for database access (MySQL/Postgres).
- **Resolvers and Controllers** both consume the same service layer.
- **Swagger** → REST documentation.
- **GraphQL Playground / Apollo** → GraphQL exploration.

### 3.2 Frontend (Astro + React Islands)

The frontend is built with **Astro 5.x** for static rendering (fast and SEO-friendly) and **React 19.x Islands** for interactive components. This allows for an optimal balance between performance and interactivity.

#### 🔹 Static Pages (SSG by Default)

Astro uses static output by default (`output: 'static'` in `astro.config.mjs`). Most pages are pre-rendered at build time:

- `/` (Home): Static home page with client-side auth redirect logic
- `/auth/login` & `/auth/register`: Static forms with client-side validation
- `/feed`: Static shell with client-side data fetching for activity feed
- `/reviews`: Static listing with pagination

#### 🔹 Dynamic Pages (SSR - Opt-in with `prerender: false`)

Specific routes require server-side rendering for dynamic content:

- `/games` (Explore): SSR for dynamic filters and query-based pagination
- `/games/[slug]`: SSR for individual game pages with real-time data
- `/profile/[username]`: SSR for user profiles with up-to-date information
- `/reviews/[id]`: SSR for review details with social interactions

#### 🔹 React Islands (Dynamic Components)

React is used selectively for components that need interactivity:

- **Social feed** → Dynamically loaded reviews from followed users
- **Login / Register / Profile forms** → Controlled React forms with validation
- **Review editor** → Create/edit review with rich text editor
- **Follow / unfollow buttons** → Reactive, updated without page reload
- **Search bar** → Autocomplete with API queries
- **Game filters** → Interactive filtering interface

#### 🔹 Styles & UI

- **Tailwind CSS v4** → Utility-first, responsive, mobile-first design with `@tailwindcss/vite` plugin
- **Radix UI** → Headless, accessible component primitives (Dialog, Tabs, Avatar, etc.)
- **Custom Design System** → CSS custom properties for consistent theming
- **Lucide React** → Consistent icon library
- **Dark mode** → System preference support with toggle

#### 🔹 State Management

- **Nanostores** → Lightweight state management for global state
- **React State** → Component-level state with hooks
- **Persistent Auth** → Token management with localStorage

---

## 4. Testing

- **Backend**
  - Unit tests with Jest.
  - Endpoint integration tests with Supertest.

- **Frontend**
  - React Testing Library + Jest.
  - Cypress for end-to-end tests.

- **Key test cases:**
  - User registration/login.
  - Create/edit reviews.
  - Feed showing reviews from followed users.

---

## 5. Deployment

- **Development environment:** Docker Compose (backend + db).
- **Staging environment:** Railway/Render + Supabase.
- **Production:**
  - Backend: Render.
  - Frontend: Vercel.
  - Database: Neon/Supabase.
- **CI/CD:** GitHub Actions to run tests before deploy.

---

## 6. Maintenance

- **Monitoring:** centralized logs + Sentry for errors.
- **Automatic backups:** of the database in Supabase/Neon.

---

## 7. Roadmap

1. **Indie games showcase**
   - Upload demos or store links (Play Store, App Store, itch.io).
   - Statistics dashboard for developers.
   - "Indie Games" section, filterable and featured.

2. **Integration with external APIs**
   - Steam OAuth for login and game library.
   - Public video game APIs (RAWG, IGDB) for catalogs and profiles.

3. **Personal video game management and tracking**
   - Add video games to favorite, played, and pending lists.
   - Achievement tracker synced via Steam (automatic import of achievements).
   - Create a personalized "questlog" with tasks or pending challenges within each video game.

4. **Gamification**
   - Achievements for reviews, lists, or games played.
   - Social feed with friends' activity related to indie games.

5. **Advanced interactivity**
   - Embedded web games (JS/TS, Phaser, Unity WebGL) (future)
   - Real-time notifications via WebSockets (future)
