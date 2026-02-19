import { apiClient } from './client';
import {
  AuthUnknownRequest,
  AuthLoginRequest,
  AuthVerifyRequest,
  AuthResponse,
  ApiResponse,
  VerifyProxyResponse
} from './types';

/**
 * Auth service for user authentication operations
 */
export class AuthService {
  /**
   * Create unknown user session (for guest users)
   */
  static async unknown(request: AuthUnknownRequest): Promise<ApiResponse<AuthResponse>> {
    return apiClient.post<AuthResponse>('/proxy/api/auth/unknown', request);
  }

  /**
   * Login with mobile number - sends OTP
   */
  static async login(request: AuthLoginRequest): Promise<ApiResponse<AuthResponse>> {
    return apiClient.post<AuthResponse>('/proxy/api/auth/login', request);
  }

  /**
   * Verify OTP code
   */
  static async verify(request: AuthVerifyRequest): Promise<ApiResponse<VerifyProxyResponse>> {
    return apiClient.post<VerifyProxyResponse>('/proxy/api/auth/verify', request);
  }
}

// Export singleton instance
export const authService = AuthService;
