/**
 * Custom API Error Class
 * Enhanced error handling with structured error information
 */

export class ApiError extends Error {
  public readonly code: string;
  public readonly status?: number;
  public readonly details?: any;
  public readonly timestamp: number;

  constructor(
    message: string,
    code: string = 'UNKNOWN_ERROR',
    status?: number,
    details?: any,
  ) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.status = status;
    this.details = details;
    this.timestamp = Date.now();

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiError);
    }
  }

  /**
   * Convert error to JSON format
   */
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      status: this.status,
      details: this.details,
      timestamp: this.timestamp,
    };
  }

  /**
   * Check if error is a network error
   */
  isNetworkError(): boolean {
    return this.code === 'NETWORK_ERROR' || this.code === 'TIMEOUT_ERROR';
  }

  /**
   * Check if error is an authentication error
   */
  isAuthError(): boolean {
    return this.status === 401 || this.code === 'UNAUTHORIZED';
  }

  /**
   * Check if error is a validation error
   */
  isValidationError(): boolean {
    return this.status === 400 || this.code === 'VALIDATION_ERROR';
  }

  /**
   * Check if error is a server error
   */
  isServerError(): boolean {
    return (this.status || 0) >= 500;
  }
}

/**
 * Create ApiError from various error types
 */
export function createApiError(error: any): ApiError {
  if (error instanceof ApiError) {
    return error;
  }

  if (error?.response) {
    // Axios error with response
    const { status, data } = error.response;
    const message = data?.message || data?.error || error.message;
    const code = data?.code || `HTTP_${status}`;

    return new ApiError(message, code, status, data);
  }

  if (error?.request) {
    // Network error (no response)
    return new ApiError(
      'No internet connection. Please check your network.',
      'NETWORK_ERROR',
      0,
      { originalError: error.message },
    );
  }

  // Unknown error
  return new ApiError(
    error?.message || 'An unexpected error occurred.',
    'UNKNOWN_ERROR',
    undefined,
    error,
  );
}
