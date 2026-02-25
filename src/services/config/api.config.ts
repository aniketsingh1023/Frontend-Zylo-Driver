/**
 * API Configuration
 * Centralized configuration for API endpoints and settings
 */

export const API_CONFIG = {
  BASE_URL:
    process.env.NEXT_PUBLIC_SERVER_URL ||
    'https://zylo-backend-3xqn.onrender.com/api',
  IMAGE_URL: process.env.IMAGE_URL || 'https://zylo-backend-3xqn.onrender.com',
  TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second
} as const;

/**
 * API Endpoints
 * Centralized endpoint definitions
 */
export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    LOGIN: '/account/user-login',
    REGISTER: '/account/register',
    SEND_OTP: '/account/send-otp-to-email',
    CONFIRM_EMAIL: '/account/confirm-email',
    FORGOT_PASSWORD: '/account/forgot-password',
    VERIFY_OTP: '/account/verify-otp',
    RESET_PASSWORD: '/account/reset-password',
    REFRESH_TOKEN: '/account/refresh-token',
    LOGOUT: '/account/logout',
  },
  // Driver/Rider endpoints
  DRIVER: {
    LOGIN: '/rider/login-rider',
    REGISTER: '/rider/register',
    PROFILE: '/rider/current-rider',
    UPDATE_PROFILE: '/rider/update-rider',
    TOGGLE_ONLINE: '/rider/toggle-online-status',
    UPDATE_LOCATION: '/rider/update-location',
    GET_ORDERS: '/rider/orders',
    ACCEPT_ORDER: '/rider/accept-order',
    COMPLETE_ORDER: '/rider/complete-order',
  },
  // Vehicle endpoints
  VEHICLE: {
    LIST: '/vehicle/list',
    GET: '/vehicle/:id',
    ADD: '/vehicle/add',
    UPDATE: '/vehicle/update/:id',
    DELETE: '/vehicle/delete/:id',
    CURRENT: '/vehicle/current-driver-vehicle',
  },
} as const;

/**
 * HTTP Status Codes
 */
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;

/**
 * Error Messages
 */
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'No internet connection. Please check your network.',
  TIMEOUT_ERROR: 'Request timeout. Please try again.',
  UNAUTHORIZED: 'Session expired. Please login again.',
  FORBIDDEN: 'You do not have permission to perform this action.',
  SERVER_ERROR: 'Server error. Please try again later.',
  UNKNOWN_ERROR: 'An unexpected error occurred.',
  VALIDATION_ERROR: 'Please check your input and try again.',
} as const;
