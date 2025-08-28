export interface AuthResponse {
  user: {
    id: string;
    email: string;
    username: string;
    role: string;
    avatar?: string;
    bio?: string;
    createdAt: Date;
  };
  accessToken: string;
  refreshToken: string;
}
