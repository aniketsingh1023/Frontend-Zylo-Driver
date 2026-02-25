/**
 * Vehicle Service Types
 * Type definitions for vehicle service
 */

import { ImageType } from '../../api/types/authTypes';

export interface VehicleDocument {
  documentExpiryDate: string;
  documentNumber: string;
  file: ImageType | null;
}

export interface CreateVehicleRequest {
  make: string;
  model: string;
  year: string;
  color: string;
  licensePlate: string;
  vinNumber: string;
  seatingCapacity: string;
  documents: VehicleDocument[];
  displayImage: ImageType | null;
}

export interface UpdateVehicleRequest extends Partial<CreateVehicleRequest> {
  id: string;
}

export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: string;
  color: string;
  licensePlate: string;
  vinNumber: string;
  seatingCapacity: string;
  displayImage?: string;
  documents?: VehicleDocument[];
  createdAt?: string;
  updatedAt?: string;
}

export interface VehicleListResponse {
  vehicles: Vehicle[];
  total: number;
}
