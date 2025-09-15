// Auth Request DTOs
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

// Auth Response Types
export interface AuthUser {
  id: string;
  email: string;
  username: string;
  role: string;
  avatar?: string;
  bio?: string;
  createdAt: Date;
}

export interface AuthResponse {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
}

export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

// Auth Constants
export type UserRole = "USER" | "ADMIN" | "MODERATOR";

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
}
