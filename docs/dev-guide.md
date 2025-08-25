
# 📘 Questlog - Dev Guide

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

- **Frontend:** Astro + React Islands + TailwindCSS.  
  - Static pages for video game profiles and user profiles (SSG).  
  - Interactive components (feed, login, reviews) in React Islands.  
- **Backend:** NestJS (Node.js) + TypeScript + REST/GraphQL API.  
- **Database:** PostgreSQL.  
- **ORM:** Prisma.  
- **Authentication:** JWT, with future Steam OAuth support.  
- **Deployment:**  
  - Frontend → Vercel.  
  - Backend → Render/Railway.  
  - DB → Supabase/Neon.  

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

*(Relationships: User ↔ Review, User ↔ Follow, Game ↔ Review, Game ↔ Developer)*  

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

The frontend will be built with **Astro** for static rendering (fast and SEO-friendly) and **React Islands** for interactive components. This allows for an optimal balance between performance and interactivity.

#### 🔹 Static Pages (SSG / Hybrid)

Astro will pre-render and serve these sections:

- **Home / Landing page** → introduction to Questlog, call to action for sign-up.  
- **Game profiles** → game description, cover art, aggregated reviews.  
- **User profiles** → user bio, reviews list, following/followers.  
- **Indie showcase section** → curated list of indie games (future roadmap: indie dev uploads).  
- **About / FAQ / Contact** → static informational pages.  
- **Authentication pages** (login, register, reset password) → partially static, form handled by React.  

#### 🔹 React Islands (Dynamic Components)

React will be used selectively for components that need interactivity:

- **Social feed** → dynamically loaded reviews from followed users (GraphQL query).  
- **Login / Register / Profile forms** → controlled React forms with validation.  
- **Review editor** → create/edit review with Markdown editor + rating stars.  
- **Follow / unfollow buttons** → reactive, updated without page reload.  
- **Search bar (games, users)** → autocomplete with GraphQL queries.  
- **Notifications (future roadmap)** → real-time updates (via WebSockets).  

#### 🔹 Styles & UI

- **TailwindCSS** → utility-first, responsive, mobile-first design.  
- **Component library** → shadcn/ui (or Headless UI) for accessible modals, dropdowns, etc.  
- **Dark mode** → toggle support via Tailwind.  

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
   - Embedded web games (JS/TS, Phaser, Unity WebGL).  
   - Real-time notifications (WebSockets).  
