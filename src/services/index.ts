/**
 * Services Index
 * Central export point for all services
 */

// Core services
export { httpClient, default as HttpClient } from './core/HttpClient';

// Auth service
export { authService, default as AuthService } from './auth/AuthService';

// Driver service
export {
  driverService,
  default as DriverService,
} from './driver/DriverService';

// Vehicle service
export {
  vehicleService,
  default as VehicleService,
} from './vehicle/VehicleService';

// SignalR Location Hub
export { locationHubService } from './signalr/LocationHub';
export type {
  LocationUpdate,
  DriverLocationUpdate,
} from './signalr/LocationHub';

// Configuration
export * from './config/api.config';

// Types
export * from './types/api.types';
export * from './types/auth.types';
export * from './types/driver.types';
export * from './types/vehicle.types';

// Errors
export * from './errors/ApiError';

// Re-export commonly used functions
export { isSuccessResponse, isErrorResponse } from './types/api.types';
