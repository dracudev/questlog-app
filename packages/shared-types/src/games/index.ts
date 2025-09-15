// Game Status Types
export type GameStatus =
  | 'RELEASED'
  | 'UNRELEASED'
  | 'EARLY_ACCESS'
  | 'CANCELLED';

// Basic Game Entities
export interface DeveloperResponse {
  id: string;
  name: string;
  slug: string;
  description?: string;
  website?: string;
  foundedYear?: number;
  country?: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
  gamesCount?: number;
}

export interface PublisherResponse {
  id: string;
  name: string;
  slug: string;
  description?: string;
  website?: string;
  foundedYear?: number;
  country?: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
  gamesCount?: number;
}

export interface GenreResponse {
  id: string;
  name: string;
  slug: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  gamesCount?: number;
}

export interface PlatformResponse {
  id: string;
  name: string;
  slug: string;
  abbreviation?: string;
  createdAt: Date;
  updatedAt: Date;
  gamesCount?: number;
}

// Game Types
export interface GameBasic {
  id: string;
  title: string;
  slug: string;
  coverImage?: string;
  releaseDate?: Date;
  status: GameStatus;
  averageRating?: number;
  reviewCount: number;
}

export interface GameResponse {
  game: GameBasic;
  description?: string;
  summary?: string;
  screenshots: string[];
  videos: string[];
  playCount: number;
  developer?: DeveloperResponse;
  publisher?: PublisherResponse;
  genres: GenreResponse[];
  platforms: PlatformResponse[];
  createdAt: Date;
  updatedAt: Date;
  rawgId?: number;
  igdbId?: number;
  steamId?: number;
  metacriticId?: string;
}

export interface GameDetail extends GameResponse {
  // Add any additional fields specific to detailed game view
}

// Create/Update Game DTOs
export interface CreateGameRequest {
  title: string;
  slug?: string;
  description?: string;
  summary?: string;
  coverImage?: string;
  screenshots?: string[];
  videos?: string[];
  releaseDate?: Date;
  status?: GameStatus;
  developerId?: string;
  publisherId?: string;
  genreIds?: string[];
  platformIds?: string[];
  rawgId?: number;
  igdbId?: number;
  steamId?: number;
  metacriticId?: string;
}

export interface UpdateGameRequest {
  title?: string;
  slug?: string;
  description?: string;
  summary?: string;
  coverImage?: string;
  screenshots?: string[];
  videos?: string[];
  releaseDate?: Date;
  status?: GameStatus;
  developerId?: string;
  publisherId?: string;
  genreIds?: string[];
  platformIds?: string[];
  rawgId?: number;
  igdbId?: number;
  steamId?: number;
  metacriticId?: string;
}

// Developer CRUD DTOs
export interface CreateDeveloperRequest {
  name: string;
  slug?: string;
  description?: string;
  website?: string;
  foundedYear?: number;
  country?: string;
  avatar?: string;
}

export interface UpdateDeveloperRequest {
  name?: string;
  slug?: string;
  description?: string;
  website?: string;
  foundedYear?: number;
  country?: string;
  avatar?: string;
}

// Publisher CRUD DTOs
export interface CreatePublisherRequest {
  name: string;
  slug?: string;
  description?: string;
  website?: string;
  foundedYear?: number;
  country?: string;
  avatar?: string;
}

export interface UpdatePublisherRequest {
  name?: string;
  slug?: string;
  description?: string;
  website?: string;
  foundedYear?: number;
  country?: string;
  avatar?: string;
}

// Genre CRUD DTOs
export interface CreateGenreRequest {
  name: string;
  slug?: string;
  description?: string;
}

export interface UpdateGenreRequest {
  name?: string;
  slug?: string;
  description?: string;
}

// Platform CRUD DTOs
export interface CreatePlatformRequest {
  name: string;
  slug?: string;
  abbreviation?: string;
}

export interface UpdatePlatformRequest {
  name?: string;
  slug?: string;
  abbreviation?: string;
}

// Query Types
export interface GamesQuery {
  page?: number;
  limit?: number;
  search?: string;
  genreIds?: string[];
  platformIds?: string[];
  developerId?: string;
  publisherId?: string;
  status?: GameStatus;
  minRating?: number;
  maxRating?: number;
  sortBy?: 'title' | 'releaseDate' | 'rating' | 'reviewCount' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

export interface DevelopersQuery {
  page?: number;
  limit?: number;
  search?: string;
  country?: string;
  includeGames?: boolean;
}

export interface PublishersQuery {
  page?: number;
  limit?: number;
  search?: string;
  country?: string;
  includeGames?: boolean;
}

export interface GenresQuery {
  page?: number;
  limit?: number;
  search?: string;
}

export interface PlatformsQuery {
  page?: number;
  limit?: number;
  search?: string;
}

// Stats Types
export interface DeveloperStats {
  gamesCount: number;
  averageRating?: number;
  totalReviews: number;
  releaseYears: number[];
}

export interface PublisherStats {
  gamesCount: number;
  averageRating?: number;
  totalReviews: number;
  releaseYears: number[];
}

// Game Filters DTO
export interface GameFilters {
  genreIds?: string[];
  platformIds?: string[];
  developerId?: string;
  publisherId?: string;
  status?: GameStatus;
  minRating?: number;
  maxRating?: number;
  releaseYearStart?: number;
  releaseYearEnd?: number;
}
