/**
 * Driver Service Types
 * Type definitions for driver/rider service
 */

import { ImageType } from '../../api/types/authTypes';
import { User } from './auth.types';

export interface DriverLoginRequest {
  email?: string;
  phoneNumber?: string;
  password: string;
}

export interface DriverRegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  userName: string;
  password: string;
  phoneNumber: string;
  profilePicture?: any;
  address?: {
    streetAddress: string;
    city: string;
    state: string;
    zipcode: string;
    country: string;
    addressLink?: string;
  };
  documents?: DriverDocument[];
}

export interface DriverDocument {
  file: ImageType | any;
  documentExpiryDate: string;
  documentNumber: string;
}

export interface DriverProfile extends User {
  isOnline?: boolean;
  rating?: number;
  totalTrips?: number;
  documents?: DriverDocument[];
  vehicle?: VehicleInfo;
}

export interface VehicleInfo {
  id: string;
  make: string;
  model: string;
  year: string;
  color: string;
  licensePlate: string;
  vinNumber: string;
  seatingCapacity: string;
  displayImage?: string;
}

export interface UpdateDriverRequest extends Partial<DriverRegisterRequest> {}

export interface ToggleOnlineStatusResponse {
  isOnline: boolean;
  message: string;
}
