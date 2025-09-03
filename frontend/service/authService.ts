// src/service/authService.ts
import api from "@/api";
import { ChangePasswordDto } from "@/types/auth.types";

// Types for request/response DTOs
export interface RegisterDto {
  email: string;
  password: string;
  name?: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthResponseDto {
  accessToken: string;
}

export interface User {
  id: string;
  email: string;
  name?: string;
}

class AuthService {
  /**
   * Register a new user
   */
  async register(registerData: RegisterDto): Promise<User> {
    const response = await api.post("/auth/register", registerData);
    return response.data;
  }

  /**
   * Login user - tokens will be set as httpOnly cookies automatically
   */
  async login(loginData: LoginDto): Promise<AuthResponseDto> {
    const response = await api.post("/auth/login", loginData);
    return response.data;
  }

  /**
   * Refresh access token using httpOnly refresh token cookie
   */
 async refreshToken(): Promise<AuthResponseDto> {
  const response = await api.post("/auth/refresh", {}, { withCredentials: true });
  return response.data;
}


  /**
   * Logout user - clears httpOnly cookies
   */
  async logout(): Promise<void> {
    await api.post("/auth/logout");
  }

  /**
   * Change password (requires authentication)
   */
  async changePassword(changePasswordData: ChangePasswordDto): Promise<{ message: string }> {
    const response = await api.patch("/auth/change-password", changePasswordData);
    return response.data;
  }

  /**
   * Get current user info (requires a valid access token)
   */
  async getCurrentUser(): Promise<User | null> {
    try {
      const response = await api.get("/auth/me");
      return response.data;
    } catch (error) {
      return null;
    }
  }
}

// Create singleton
export const authService = new AuthService();
export default AuthService;
