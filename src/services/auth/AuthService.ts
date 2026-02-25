/**
 * Authentication Service
 * Handles all authentication-related API calls
 */

import { httpClient } from '../core/HttpClient';
import { API_ENDPOINTS } from '../config/api.config';
import { ApiResponse, isSuccessResponse } from '../types/api.types';
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  SendOtpRequest,
  SendOtpResponse,
  VerifyOtpRequest,
  VerifyOtpResponse,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
  User,
} from '../types/auth.types';
import {
  setLocalStorage,
  getLocalStorage,
  removeLocalStorage,
} from '../../utils/helper';

/**
 * Authentication Service Class
 */
class AuthService {
  /**
   * Login user with email and password
   */
  async login(credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    const response = await httpClient.post<LoginResponse>(
      API_ENDPOINTS.AUTH.LOGIN,
      credentials,
    );

    // Store token and user data on successful login
    if (isSuccessResponse(response)) {
      await this.storeAuthData(response.data);
    }

    return response;
  }

  /**
   * Register new user
   */
  async register(
    data: RegisterRequest,
  ): Promise<ApiResponse<RegisterResponse>> {
    const formData = new FormData();

    // Append basic fields
    formData.append('firstName', data.firstName);
    formData.append('lastName', data.lastName);
    formData.append('email', data.email);
    formData.append('username', data.userName);
    formData.append('password', data.password);
    formData.append('phoneNumber', data.phoneNumber);

    // Append profile picture if exists
    if (data.profilePicture) {
      formData.append('profilePicture', data.profilePicture);
    }

    // Append address fields if exists
    if (data.address) {
      formData.append(
        'address.streetAddress',
        data.address.streetAddress || '',
      );
      formData.append('address.city', data.address.city || '');
      formData.append('address.state', data.address.state || '');
      formData.append('address.zipcode', data.address.zipcode || '');
      formData.append('address.country', data.address.country || '');
      formData.append('address.addressLink', data.address.addressLink || '');
    }

    return httpClient.upload<RegisterResponse>(
      API_ENDPOINTS.AUTH.REGISTER,
      formData,
    );
  }

  /**
   * Send OTP to email for verification
   */
  async sendOtp(data: SendOtpRequest): Promise<ApiResponse<SendOtpResponse>> {
    return httpClient.post<SendOtpResponse>(API_ENDPOINTS.AUTH.SEND_OTP, data);
  }

  /**
   * Confirm email with OTP
   */
  async confirmEmail(
    data: VerifyOtpRequest,
  ): Promise<ApiResponse<VerifyOtpResponse>> {
    return httpClient.post<VerifyOtpResponse>(
      API_ENDPOINTS.AUTH.CONFIRM_EMAIL,
      data,
    );
  }

  /**
   * Send OTP for forgot password
   */
  async forgotPassword(
    data: ForgotPasswordRequest,
  ): Promise<ApiResponse<ForgotPasswordResponse>> {
    return httpClient.post<ForgotPasswordResponse>(
      API_ENDPOINTS.AUTH.FORGOT_PASSWORD,
      data,
    );
  }

  /**
   * Verify OTP for forgot password
   */
  async verifyOtp(
    data: VerifyOtpRequest,
  ): Promise<ApiResponse<VerifyOtpResponse>> {
    return httpClient.post<VerifyOtpResponse>(
      API_ENDPOINTS.AUTH.VERIFY_OTP,
      data,
    );
  }

  /**
   * Reset password with new password
   */
  async resetPassword(
    data: ResetPasswordRequest,
  ): Promise<ApiResponse<ResetPasswordResponse>> {
    return httpClient.post<ResetPasswordResponse>(
      API_ENDPOINTS.AUTH.RESET_PASSWORD,
      data,
    );
  }

  /**
   * Logout user
   */
  async logout(): Promise<ApiResponse<void>> {
    try {
      // Call logout endpoint if available
      const response = await httpClient.post<void>(API_ENDPOINTS.AUTH.LOGOUT);

      // Clear local storage
      await this.clearAuthData();

      return response;
    } catch (error) {
      // Clear local storage even if API call fails
      await this.clearAuthData();

      return {
        success: true,
        data: undefined,
      };
    }
  }

  /**
   * Get current user from storage
   */
  async getCurrentUser(): Promise<User | null> {
    try {
      const userData = await getLocalStorage('user');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  /**
   * Get authentication token
   */
  async getToken(): Promise<string | null> {
    try {
      return await getLocalStorage('token');
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  }

  /**
   * Check if user is authenticated
   */
  async isAuthenticated(): Promise<boolean> {
    const token = await this.getToken();
    return !!token;
  }

  /**
   * Store authentication data
   */
  private async storeAuthData(data: LoginResponse): Promise<void> {
    try {
      if (data.token) {
        await setLocalStorage('token', data.token);
      }

      if (data.refreshToken) {
        await setLocalStorage('refreshToken', data.refreshToken);
      }

      if (data.user) {
        await setLocalStorage('user', JSON.stringify(data.user));
      }
    } catch (error) {
      console.error('Error storing auth data:', error);
      throw error;
    }
  }

  /**
   * Clear authentication data
   */
  private async clearAuthData(): Promise<void> {
    try {
      await removeLocalStorage('token');
      await removeLocalStorage('refreshToken');
      await removeLocalStorage('user');
    } catch (error) {
      console.error('Error clearing auth data:', error);
    }
  }

  /**
   * Update user profile in storage
   */
  async updateUserProfile(user: Partial<User>): Promise<void> {
    try {
      const currentUser = await this.getCurrentUser();
      if (currentUser) {
        const updatedUser = { ...currentUser, ...user };
        await setLocalStorage('user', JSON.stringify(updatedUser));
      }
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const authService = new AuthService();
export default authService;
