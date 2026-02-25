/**
 * HTTP Client Service
 * Production-grade HTTP client with interceptors, retry logic, and error handling
 */

import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
} from 'axios';
import { API_CONFIG, HTTP_STATUS, ERROR_MESSAGES } from '../config/api.config';
import { ApiError, createApiError } from '../errors/ApiError';
import { ApiResponse } from '../types/api.types';
import {
  getLocalStorage,
  setLocalStorage,
  removeLocalStorage,
} from '../../utils/helper';

/**
 * HTTP Client Class
 * Singleton pattern for consistent API communication
 */
class HttpClient {
  private instance: AxiosInstance;
  private isRefreshing = false;
  private failedQueue: Array<{
    resolve: (value?: any) => void;
    reject: (reason?: any) => void;
  }> = [];

  constructor() {
    this.instance = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: API_CONFIG.TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  /**
   * Setup request and response interceptors
   */
  private setupInterceptors(): void {
    // Request interceptor
    this.instance.interceptors.request.use(
      this.handleRequest,
      this.handleRequestError,
    );

    // Response interceptor
    this.instance.interceptors.response.use(
      this.handleResponse,
      this.handleResponseError,
    );
  }

  /**
   * Handle outgoing requests
   */
  private handleRequest = async (
    config: InternalAxiosRequestConfig,
  ): Promise<InternalAxiosRequestConfig> => {
    // Add authentication token
    const token = await getLocalStorage('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add client metadata
    if (config.headers) {
      config.headers['Client-Time'] = Date.now().toString();
      config.headers['Client-Time-Zone'] =
        Intl.DateTimeFormat().resolvedOptions().timeZone;
    }

    // Log request in development
    if (__DEV__) {
      console.log('📤 API Request:', {
        method: config.method?.toUpperCase(),
        url: config.url,
        data:
          config.data instanceof FormData
            ? 'FormData (see below)'
            : config.data,
      });

      // Log FormData contents if present
      if (config.data instanceof FormData) {
        console.log('📦 FormData contents:');
        // @ts-ignore
        for (let [key, value] of config.data._parts) {
          if (typeof value === 'object' && value?.uri) {
            console.log(`  ${key}:`, { name: value.name, type: value.type });
          } else {
            console.log(`  ${key}:`, value);
          }
        }
      }
    }

    return config;
  };

  /**
   * Handle request errors
   */
  private handleRequestError = (error: AxiosError): Promise<never> => {
    console.error('❌ Request Error:', error);
    return Promise.reject(createApiError(error));
  };

  /**
   * Handle successful responses
   */
  private handleResponse = (response: AxiosResponse): AxiosResponse => {
    // Log response in development
    if (__DEV__) {
      console.log('📥 API Response:', {
        status: response.status,
        url: response.config.url,
        data: response.data,
      });
    }

    // Backend returns {success: boolean, message: string, data: any}
    // If success is false, treat it as an error even if HTTP status is 200
    if (response.data && response.data.success === false) {
      const error = new Error(response.data.message || 'Request failed');
      (error as any).response = response;
      (error as any).config = response.config;
      throw error;
    }

    return response;
  };

  /**
   * Handle response errors with retry logic and token refresh
   */
  private handleResponseError = async (error: AxiosError): Promise<any> => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Handle token refresh for 401 errors
    if (
      error.response?.status === HTTP_STATUS.UNAUTHORIZED &&
      !originalRequest._retry
    ) {
      if (this.isRefreshing) {
        // Queue requests while refreshing token
        return new Promise((resolve, reject) => {
          this.failedQueue.push({ resolve, reject });
        })
          .then(() => {
            return this.instance(originalRequest);
          })
          .catch(err => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      this.isRefreshing = true;

      try {
        const refreshToken = await getLocalStorage('refreshToken');
        if (refreshToken) {
          // Attempt to refresh token
          const response = await this.instance.post('/account/refresh-token', {
            refreshToken,
          });

          const { token } = response.data;
          await setLocalStorage('token', token);

          // Retry all queued requests
          this.failedQueue.forEach(promise => promise.resolve());
          this.failedQueue = [];

          // Retry original request
          return this.instance(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed - logout user
        this.failedQueue.forEach(promise => promise.reject(refreshError));
        this.failedQueue = [];
        await this.handleLogout();
        return Promise.reject(createApiError(refreshError));
      } finally {
        this.isRefreshing = false;
      }
    }

    // Handle network errors
    if (!error.response) {
      console.error('🌐 Network Error:', error.message);
      return Promise.reject(
        new ApiError(ERROR_MESSAGES.NETWORK_ERROR, 'NETWORK_ERROR', 0, {
          originalError: error.message,
        }),
      );
    }

    // Handle timeout errors
    if (error.code === 'ECONNABORTED') {
      return Promise.reject(
        new ApiError(ERROR_MESSAGES.TIMEOUT_ERROR, 'TIMEOUT_ERROR'),
      );
    }

    // Log error in development
    if (__DEV__) {
      console.error('❌ API Error:', {
        status: error.response?.status,
        url: error.config?.url,
        error: error.response?.data,
        fullError: JSON.stringify(error.response?.data, null, 2),
      });
    }

    return Promise.reject(createApiError(error));
  };

  /**
   * Handle user logout
   */
  private async handleLogout(): Promise<void> {
    await removeLocalStorage('token');
    await removeLocalStorage('refreshToken');
    await removeLocalStorage('user');

    // Navigate to login screen
    const { navigationRef } = require('../../screens/auth/navigationRef');
    if (navigationRef.isReady()) {
      navigationRef.navigate('SignInScreen');
    }
  }

  /**
   * Generic request method with type safety
   */
  public async request<T = any>(
    config: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> {
    try {
      const response = await this.instance.request(config);

      // Backend returns {success: boolean, message: string, data: any}
      // Extract the actual data from the response
      const backendResponse = response.data as any;

      // Handle case where backend returns success but data might be null/undefined
      if (backendResponse && typeof backendResponse === 'object') {
        return {
          success: true,
          data: backendResponse.data as T,
          message: backendResponse.message,
        };
      }

      // Fallback for non-standard responses
      return {
        success: true,
        data: backendResponse as T,
        message: 'Success',
      };
    } catch (error) {
      if (error instanceof ApiError) {
        return {
          success: false,
          error: {
            code: error.code,
            message: error.message,
            details: error.details,
            status: error.status,
          },
        };
      }

      const apiError = createApiError(error);
      return {
        success: false,
        error: {
          code: apiError.code,
          message: apiError.message,
          details: apiError.details,
          status: apiError.status,
        },
      };
    }
  }

  /**
   * GET request
   */
  public async get<T = any>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> {
    return this.request<T>({ ...config, method: 'GET', url });
  }

  /**
   * POST request
   */
  public async post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> {
    return this.request<T>({ ...config, method: 'POST', url, data });
  }

  /**
   * PUT request
   */
  public async put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> {
    return this.request<T>({ ...config, method: 'PUT', url, data });
  }

  /**
   * PATCH request
   */
  public async patch<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> {
    return this.request<T>({ ...config, method: 'PATCH', url, data });
  }

  /**
   * DELETE request
   */
  public async delete<T = any>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> {
    return this.request<T>({ ...config, method: 'DELETE', url });
  }

  /**
   * Upload file with multipart/form-data
   */
  public async upload<T = any>(
    url: string,
    formData: FormData,
    onUploadProgress?: (progressEvent: any) => void,
  ): Promise<ApiResponse<T>> {
    return this.request<T>({
      method: 'POST',
      url,
      data: formData,
      headers: {
        // Let axios set Content-Type automatically with boundary
        'Content-Type': 'multipart/form-data',
      },
      timeout: 60000, // 60 seconds for file uploads
      onUploadProgress,
    });
  }

  /**
   * Get axios instance for custom configurations
   */
  public getAxiosInstance(): AxiosInstance {
    return this.instance;
  }
}

// Export singleton instance
export const httpClient = new HttpClient();
export default httpClient;
