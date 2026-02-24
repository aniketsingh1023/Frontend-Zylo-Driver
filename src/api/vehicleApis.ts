import {
  buildRiderSignupFormData,
  buildVehicleFormData,
} from '../utils/helper';
import apiIndex from './apiIndex';
import { FailureResponse, SuccessResponse } from './types';
import { SignUpResponseData } from './types/authTypes';
import { IVehicleFormPayload } from './types/riderTypes';

export const addVehicleApi = async (
  data: IVehicleFormPayload,
): Promise<SuccessResponse<any> | FailureResponse> => {
  const formData = new FormData();
  if (data.displayImage)
    formData.append('displayImage', {
      uri: data.displayImage?.uri,
      name: data.displayImage?.name || `display.jpg`,
      type: data.displayImage?.type || 'image/jpeg',
    } as any);
  formData.append('make', data.make || '');
  formData.append('model', data.model || '');
  formData.append('year', data.year || '');
  formData.append('licensePlate', data.licensePlate || '');
  formData.append('color', data.color || '');
  formData.append('vinNumber', data.vinNumber || '');

  if (data.documents) {
    data.documents.forEach((doc, index) => {
      formData.append(`documents[${index}].documentNumber`, doc.documentNumber);
      formData.append(
        `documents[${index}].documentExpiryDate`,
        doc.documentExpiryDate,
      );
      formData.append(`documents[${index}].file`, {
        uri: doc.file?.uri,
        name: doc.file?.name || `document_${index}.jpg`,
        type: doc.file?.type || 'image/jpeg',
      } as any);
    });
  }

  const response = await apiIndex.request<SignUpResponseData>({
    url: `/vehicle/add-vehicle`,
    method: 'POST',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  if (response.remote === 'success') {
    return {
      remote: 'success',
      data: response.data,
    };
  }

  return response;
};

export const getCurrentDriverVehicleApi = async (): Promise<
  SuccessResponse<any> | FailureResponse
> => {
  const response = await apiIndex.request<any>({
    url: `/vehicle/get-current-user-vehicle`,
    method: 'GET',
  });

  if (response.remote === 'success') {
    return {
      remote: 'success',
      data: response.data,
    };
  }

  return response;
};
