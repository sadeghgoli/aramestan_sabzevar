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
    return apiClient.post<AuthResponse>('/api/auth/unknown/proxy', request);
  }

  /**
   * Login with mobile number - sends OTP
   */
  static async login(request: AuthLoginRequest): Promise<ApiResponse<AuthResponse>> {
    return apiClient.post<AuthResponse>('/api/auth/login/proxy', request);
  }

  /**
   * Verify OTP code
   */
  static async verify(request: AuthVerifyRequest): Promise<ApiResponse<VerifyProxyResponse>> {
    return apiClient.post<VerifyProxyResponse>('/api/auth/verify/proxy', request);
  }
}

// Export singleton instance
export const authService = AuthService;
