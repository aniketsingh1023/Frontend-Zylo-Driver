import { Platform } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { IMAGE_URL } from '../config';
import { FailureResponse } from '../api/types';
import { IAddress } from '../api/types/userTypes';
import {
  IRiderSignUpFormPayload,
  IVehicleFormPayload,
} from '../api/types/riderTypes';

export const GOOGLE_MAPS_APIKEY = 'AIzaSyCjyYDKOmjZtMneD7xJlxNU3lANAPOpJ6M';
export const DEFAULT_PAGE_SIZE = 10;

export const isIOS = () => {
  return Platform.OS === 'ios';
};
export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const setLocalStorage = async (
  key: string,
  value: string,
): Promise<void> => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (e) {
    console.error('Error setting local storage:', e);
  }
};
export function formatAddress(address?: IAddress | null): string {
  if (!address) return 'Address not available';

  const { streetAddress, city, state, zipcode, country } = address;

  // Collect only valid parts
  const parts = [
    streetAddress?.trim(),
    city?.trim(),
    state?.trim(),
    zipcode?.trim(),
    country?.trim(),
  ].filter(Boolean); // removes null, undefined, and empty strings

  return parts.length > 0 ? parts.join(', ') : 'Address not available';
}

export const getLocalStorage = async (key: string): Promise<string | null> => {
  try {
    const value = await AsyncStorage.getItem(key);
    return value;
  } catch (e) {
    console.error('Error getting local storage:', e);
    return null;
  }
};

export const removeLocalStorage = async (key: string): Promise<void> => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (e) {
    console.error('Error removing local storage:', e);
  }
};

export function getMediaUrl(filePath: string): string {
  return `${IMAGE_URL}${filePath}`;
}

export const addParam = (
  params: URLSearchParams,
  key: string,
  value: string,
): void => {
  if (params.has(key)) {
    params.set(key, value);
  } else {
    params.append(key, value);
  }
};

type ErrorResponse = {
  remote: 'failure';
  errors: {
    status: number;
    errors: {
      [field: string]: string[]; // e.g., "PhoneNumber": ["Phone number is already taken!"]
    };
  };
};

export const extractErrorMessage = (response: any): string => {
  if (__DEV__) {
    console.log('Extracting error from response:', JSON.stringify(response, null, 2));
  }
  
  const errorFields = response?.errors?.errors || response?.errors;
  
  if (typeof errorFields === 'string') {
    return errorFields;
  }

  if (errorFields && typeof errorFields === 'object') {
    // If it's an array of errors
    if (Array.isArray(errorFields) && errorFields.length > 0 && typeof errorFields[0] === 'string') {
      return errorFields[0];
    }
    
    // Check for common error keys
    if (typeof errorFields.message === 'string') return errorFields.message;
    if (typeof errorFields.error === 'string') return errorFields.error;

    for (const key in errorFields) {
      const messages = errorFields[key];
      if (Array.isArray(messages) && messages?.length > 0 && typeof messages[0] === 'string') {
        return messages[0];
      } else if (typeof messages === 'string' && (key === 'message' || key === 'error')) {
        return messages;
      }
    }
  }

  // Fallback to checking the response directly
  if (typeof response?.message === 'string') return response.message;
  if (typeof response?.error === 'string') return response.error;

  return 'Something went wrong';
};
export const formatAmount = (
  amount: number | string | undefined | null,
): string => {
  if (amount === undefined || !amount) return '0.00';
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(num)) return '0.00';
  return num.toFixed(2);
};

export const buildRiderSignupFormData = (data: IRiderSignUpFormPayload) => {
  const formData = new FormData();

  // Basic fields - backend expects these exact names
  formData.append('FirstName', data.firstName || '');
  formData.append('LastName', data.lastName || '');
  formData.append('Email', data.email || '');
  formData.append('UserName', data.userName || '');
  formData.append('Password', data.password || '');
  formData.append('PhoneNumber', data.phoneNumber || '');

  // Address fields - backend expects Pascal case
  formData.append('Address.StreetAddress', data.address?.streetAddress || '');
  formData.append('Address.City', data.address?.city || '');
  formData.append('Address.State', data.address?.state || '');
  formData.append('Address.Zipcode', data.address?.zipcode || '');
  formData.append('Address.Country', data.address?.country || '');

  // AddressLink is required - generate a Google Maps search link if not provided
  const addressLink =
    data.address?.addressLink ||
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      `${data.address?.streetAddress || ''} ${data.address?.city || ''} ${
        data.address?.state || ''
      } ${data.address?.country || ''}`,
    )}`;
  formData.append('Address.AddressLink', addressLink);

  // Profile picture
  if (data.profilePicture) {
    const pic = data.profilePicture as any;
    // React Native FormData expects this exact format
    const fileObj = {
      uri: pic.uri,
      name: pic.name || pic.fileName || 'profile.jpg',
      type: pic.type || 'image/jpeg',
    };
    formData.append('ProfilePicture', fileObj as any);

    if (__DEV__) {
      console.log('📷 ProfilePicture added:', {
        name: fileObj.name,
        type: fileObj.type,
        uri: fileObj.uri?.substring(0, 50) + '...',
      });
    }
  }

  // Documents
  if (data.documents) {
    data.documents.forEach((doc, index) => {
      formData.append(`Documents[${index}].DocumentNumber`, doc.documentNumber);
      formData.append(
        `Documents[${index}].DocumentExpiryDate`,
        doc.documentExpiryDate,
      );

      const file = doc.file as any;
      const fileObj = {
        uri: file.uri,
        name: file.name || file.fileName || `document_${index}.jpg`,
        type: file.type || 'image/jpeg',
      };
      formData.append(`Documents[${index}].File`, fileObj as any);

      if (__DEV__) {
        console.log(`📄 Document[${index}] added:`, {
          name: fileObj.name,
          type: fileObj.type,
        });
      }
    });
  }

  return formData;
};
export const buildVehicleFormData = (data: IVehicleFormPayload) => {
  const formData = new FormData();

  formData.append('make', data.make);
  formData.append('model', data.model);
  formData.append('year', data.year);
  formData.append('licensePlate', data.licensePlate);

  Object.entries(data).forEach(([key, value]) => {
    if (
      key !== 'documents' &&
      key !== 'displayImage' &&
      typeof value === 'string'
    ) {
      formData.append(key, value);
    }
  });

  if (data.displayImage) {
    formData.append('displayImage', {
      uri: data.displayImage.uri,
      name: data.displayImage.name || 'displayImage.jpg',
      type: data.displayImage.type || 'image/jpeg',
    } as any);
  }

  data.documents?.forEach((doc, index) => {
    formData.append(`documents[${index}].documentNumber`, doc.documentNumber);
    formData.append(
      `documents[${index}].documentExpiryDate`,
      doc.documentExpiryDate,
    );

    if (doc.file) {
      formData.append(`documents[${index}].file`, {
        uri: doc.file.uri,
        name: doc.file.name || `doc_${index}.jpg`,
        type: doc.file.type || 'image/jpeg',
      } as any);
    }
  });

  return formData;
};
