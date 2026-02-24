import { buildRiderSignupFormData } from '../utils/helper';
import apiIndex from './apiIndex';
import { FailureResponse, SuccessResponse } from './types';
import {
  IDriverSignInPayload,
  SignInResponseData,
  SignUpResponseData,
} from './types/authTypes';
import {
  IRiderSignUpFormPayload,
  IVehicleFormPayload,
} from './types/riderTypes';

export const riderSignUpApi = async (
  data: IRiderSignUpFormPayload,
): Promise<SuccessResponse<any> | FailureResponse> => {
  const formData = buildRiderSignupFormData(data);

  const response = await apiIndex.request<SignUpResponseData>({
    url: `/rider/register`,
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

export const riderSignInApi = async (
  data: IDriverSignInPayload,
): Promise<SuccessResponse<SignInResponseData> | FailureResponse> => {
  const response = await apiIndex.request<SignInResponseData>({
    url: `/rider/login-rider`,
    method: 'POST',
    data,
  });

  if (response.remote === 'success') {
    return {
      remote: 'success',
      data: response.data,
    };
  }

  return response;
};
export const toggleOnlineStatusApi = async (): Promise<
  SuccessResponse<any> | FailureResponse
> => {
  const response = await apiIndex.request<any>({
    url: `/rider/toggle-online-status`,
    method: 'PATCH',
  });

  if (response.remote === 'success') {
    return {
      remote: 'success',
      data: response.data,
    };
  }

  return response;
};

export const updateRiderApi = async (
  data: IRiderSignUpFormPayload,
): Promise<SuccessResponse<any> | FailureResponse> => {
  const formData = new FormData();

  formData.append('profilePicture', data.profilePicture);
  formData.append('firstName', data.firstName || '');
  formData.append('lastName', data.lastName || '');
  formData.append('email', data.email || '');
  formData.append('username', data.userName || '');
  formData.append('password', data.password || '');
  formData.append('phoneNumber', data.phoneNumber || '');

  formData.append('address.streetAddress', data.address?.streetAddress || '');
  formData.append('address.city', data.address?.city || '');
  formData.append('address.state', data.address?.state || '');
  formData.append('address.zipcode', data.address?.zipcode || '');
  formData.append('address.country', data.address?.country || '');
  formData.append('address.addressLink', data.address?.addressLink || '');
  formData.append('profilePicture', data.profilePicture || '');
  if (data.documents) {
    data.documents.forEach((doc, index) => {
      formData.append(`documents[${index}].documentNumber`, doc.documentNumber);
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

  const response = await apiIndex.request<SignUpResponseData>({
    url: `/rider/update-rider`,
    method: 'PUT',
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

export const getCurrentDriverDetailApi = async (): Promise<
  SuccessResponse<any> | FailureResponse
> => {
  const response = await apiIndex.request<any>({
    url: `/rider/current-rider`,
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
