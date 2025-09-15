import type { UserRole } from "../auth";

// User DTOs
export interface UserStats {
  reviewsCount: number;
  followersCount: number;
  followingCount: number;
}

export interface UserResponse {
  id: string;
  username: string;
  displayName?: string;
  avatar?: string;
  bio?: string;
  location?: string;
  website?: string;
  isPrivate: boolean;
  createdAt: Date;
  stats: UserStats;
}

export interface UserProfile extends UserResponse {
  email?: string;
  emailNotifications?: boolean;
  language?: string;
  timezone?: string;
  isFollowing?: boolean;
  isMutualFollow?: boolean;
}

export interface UpdateProfileRequest {
  displayName?: string;
  bio?: string;
  avatar?: string;
  location?: string;
  website?: string;
  isPrivate?: boolean;
  emailNotifications?: boolean;
  language?: string;
  timezone?: string;
}

export interface CreateUserRequest {
  email: string;
  username: string;
  password: string;
  displayName?: string;
  role?: UserRole;
}

export interface UpdateUserRequest {
  displayName?: string;
  bio?: string;
  avatar?: string;
  location?: string;
  website?: string;
  isPrivate?: boolean;
  emailNotifications?: boolean;
  language?: string;
  timezone?: string;
  role?: UserRole;
}

// User Query Types
export interface UsersQuery {
  page?: number;
  limit?: number;
  search?: string;
}

// Re-export from auth for convenience
export type { UserRole } from "../auth";
