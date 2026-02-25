/**
 * Vehicle Service
 * Handles all vehicle-related API calls
 */

import { httpClient } from '../core/HttpClient';
import { ApiResponse } from '../types/api.types';
import {
  CreateVehicleRequest,
  UpdateVehicleRequest,
  Vehicle,
  VehicleListResponse,
} from '../types/vehicle.types';

/**
 * Vehicle Service Class
 */
class VehicleService {
  /**
   * Get list of vehicles
   */
  async getVehicles(): Promise<ApiResponse<VehicleListResponse>> {
    return httpClient.get<VehicleListResponse>('/vehicle/list');
  }

  /**
   * Get vehicle by ID
   */
  async getVehicle(id: string): Promise<ApiResponse<Vehicle>> {
    return httpClient.get<Vehicle>(`/vehicle/${id}`);
  }

  /**
   * Create new vehicle
   */
  async createVehicle(
    data: CreateVehicleRequest,
  ): Promise<ApiResponse<Vehicle>> {
    const formData = new FormData();

    // Append vehicle details
    formData.append('make', data.make);
    formData.append('model', data.model);
    formData.append('year', data.year);
    formData.append('color', data.color);
    formData.append('licensePlate', data.licensePlate);
    formData.append('vinNumber', data.vinNumber);
    formData.append('seatingCapacity', data.seatingCapacity);

    // Append display image if exists
    if (data.displayImage) {
      formData.append('displayImage', {
        uri: data.displayImage.uri,
        name: data.displayImage.name || 'vehicle.jpg',
        type: data.displayImage.type || 'image/jpeg',
      } as any);
    }

    // Append documents if exists
    if (data.documents && data.documents.length > 0) {
      data.documents.forEach((doc, index) => {
        formData.append(
          `documents[${index}].documentNumber`,
          doc.documentNumber,
        );
        formData.append(
          `documents[${index}].documentExpiryDate`,
          doc.documentExpiryDate,
        );

        if (doc.file) {
          formData.append(`documents[${index}].file`, {
            uri: doc.file.uri,
            name: doc.file.name || `document_${index}.jpg`,
            type: doc.file.type || 'image/jpeg',
          } as any);
        }
      });
    }

    return httpClient.upload<Vehicle>('/vehicle/add', formData);
  }

  /**
   * Update existing vehicle
   */
  async updateVehicle(
    data: UpdateVehicleRequest,
  ): Promise<ApiResponse<Vehicle>> {
    const formData = new FormData();

    // Append vehicle details
    if (data.make) formData.append('make', data.make);
    if (data.model) formData.append('model', data.model);
    if (data.year) formData.append('year', data.year);
    if (data.color) formData.append('color', data.color);
    if (data.licensePlate) formData.append('licensePlate', data.licensePlate);
    if (data.vinNumber) formData.append('vinNumber', data.vinNumber);
    if (data.seatingCapacity)
      formData.append('seatingCapacity', data.seatingCapacity);

    // Append display image if exists
    if (data.displayImage) {
      formData.append('displayImage', {
        uri: data.displayImage.uri,
        name: data.displayImage.name || 'vehicle.jpg',
        type: data.displayImage.type || 'image/jpeg',
      } as any);
    }

    // Append documents if exists
    if (data.documents && data.documents.length > 0) {
      data.documents.forEach((doc, index) => {
        formData.append(
          `documents[${index}].documentNumber`,
          doc.documentNumber,
        );
        formData.append(
          `documents[${index}].documentExpiryDate`,
          doc.documentExpiryDate,
        );

        if (doc.file) {
          formData.append(`documents[${index}].file`, {
            uri: doc.file.uri,
            name: doc.file.name || `document_${index}.jpg`,
            type: doc.file.type || 'image/jpeg',
          } as any);
        }
      });
    }

    return httpClient.upload<Vehicle>(`/vehicle/update/${data.id}`, formData);
  }

  /**
   * Delete vehicle
   */
  async deleteVehicle(id: string): Promise<ApiResponse<void>> {
    return httpClient.delete<void>(`/vehicle/delete/${id}`);
  }
}

// Export singleton instance
export const vehicleService = new VehicleService();
export default vehicleService;
