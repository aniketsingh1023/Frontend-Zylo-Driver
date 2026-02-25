/**
 * Driver Service
 * Handles all driver/rider-related API calls
 */

import { httpClient } from '../core/HttpClient';
import { API_ENDPOINTS } from '../config/api.config';
import { ApiResponse, isSuccessResponse } from '../types/api.types';
import {
  DriverLoginRequest,
  DriverRegisterRequest,
  DriverProfile,
  UpdateDriverRequest,
  ToggleOnlineStatusResponse,
} from '../types/driver.types';
import { LoginResponse } from '../types/auth.types';
import {
  setLocalStorage,
  getLocalStorage,
  removeLocalStorage,
} from '../../utils/helper';
import { buildRiderSignupFormData } from '../../utils/helper';

/**
 * Driver Service Class
 */
class DriverService {
  /**
   * Login driver with email/phone and password
   */
  async login(
    credentials: DriverLoginRequest,
  ): Promise<ApiResponse<LoginResponse>> {
    const response = await httpClient.post<LoginResponse>(
      '/rider/login-rider',
      credentials,
    );

    // Store token and user data on successful login
    if (isSuccessResponse(response)) {
      await this.storeAuthData(response.data);
    }

    return response;
  }

  /**
   * Register new driver
   */
  async register(data: DriverRegisterRequest): Promise<ApiResponse<any>> {
    const formData = buildRiderSignupFormData(data as any);

    return httpClient.upload<any>('/rider/register', formData);
  }

  /**
   * Get current driver profile
   */
  async getCurrentDriver(): Promise<ApiResponse<DriverProfile>> {
    return httpClient.get<DriverProfile>('/rider/current-rider');
  }

  /**
   * Update driver profile
   */
  async updateProfile(
    data: UpdateDriverRequest,
  ): Promise<ApiResponse<DriverProfile>> {
    const formData = new FormData();

    // Append basic fields
    if (data.firstName) formData.append('firstName', data.firstName);
    if (data.lastName) formData.append('lastName', data.lastName);
    if (data.email) formData.append('email', data.email);
    if (data.userName) formData.append('username', data.userName);
    if (data.password) formData.append('password', data.password);
    if (data.phoneNumber) formData.append('phoneNumber', data.phoneNumber);

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

    // Append documents if exists
    if (data.documents) {
      data.documents.forEach((doc, index) => {
        formData.append(
          `documents[${index}].documentNumber`,
          doc.documentNumber,
        );
        formData.append(
          `documents[${index}].documentExpiryDate`,
          doc.documentExpiryDate,
        );
        formData.append(`documents[${index}].file`, {
          uri: doc.file.uri,
          name: doc.file.fileName || `document_${index}.jpg`,
          type: doc.file.type || 'image/jpeg',
        } as any);
      });
    }

    return httpClient.upload<DriverProfile>('/rider/update-rider', formData);
  }

  /**
   * Toggle online/offline status
   */
  async toggleOnlineStatus(): Promise<ApiResponse<ToggleOnlineStatusResponse>> {
    return httpClient.patch<ToggleOnlineStatusResponse>(
      '/rider/toggle-online-status',
    );
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
   * Check if driver is authenticated
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
   * Logout driver
   */
  async logout(): Promise<ApiResponse<void>> {
    try {
      // Clear local storage
      await this.clearAuthData();

      return {
        success: true,
        data: undefined,
      };
    } catch (error) {
      // Clear local storage even if error occurs
      await this.clearAuthData();

      return {
        success: true,
        data: undefined,
      };
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
}

// Export singleton instance
export const driverService = new DriverService();
export default driverService;
