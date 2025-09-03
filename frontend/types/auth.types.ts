// types/auth.types.ts
export interface User {
  id: number;
  email: string;
  role: string;
  name?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  name?: string;
 
}

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
}

export interface AuthResponse {
  accessToken: string;
}

export interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (loginData: LoginDto) => Promise<void>;
  register: (registerData: RegisterDto) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
}

// API Response types
export interface ApiError {
  message: string;
  statusCode: number;
  error?: string;
}

// Optional: Enum for user roles if you have specific roles
export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
  MODERATOR = 'MODERATOR'
}

// Optional: Type for JWT payload (if you need to decode tokens client-side)
export interface JwtPayload {
  email: string;
  sub: number;
  role: string;
  iat: number;
  exp: number;
}