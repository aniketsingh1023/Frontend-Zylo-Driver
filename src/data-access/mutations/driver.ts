import { useMutation } from '@tanstack/react-query';
import { riderSignUpApi } from '../../api/riderApis';
import {
  IRiderSignUpFormPayload,
  IVehicleFormPayload,
} from '../../api/types/riderTypes';
import { addVehicleApi } from '../../api/vehicleApis';
import { driverService } from '../../services';
import { vehicleService } from '../../services';

export function useUpdateDriverDetails() {
  return useMutation({
    mutationKey: ['driverUpdateDetails'],
    mutationFn: async (payload: IRiderSignUpFormPayload) => {
      const response = await riderSignUpApi(payload);
      console.log(JSON.stringify(response, null, 2));
      return response;
    },
  });
}

export function useUpdateDriverProfile() {
  return useMutation({
    mutationKey: ['updateDriverProfile'],
    mutationFn: async (payload: any) => {
      const response = await driverService.updateProfile(payload);

      if (response.success) {
        return {
          remote: 'success' as const,
          data: response.data,
        };
      } else {
        return {
          remote: 'failure' as const,
          errors: {
            status: response.error.status,
            errors: response.error.message,
          },
        };
      }
    },
  });
}

export function useAddVehicle() {
  return useMutation({
    mutationKey: ['VehicleInfo'],
    mutationFn: async (payload: IVehicleFormPayload) => {
      const response = await vehicleService.createVehicle(payload as any);

      if (response.success) {
        return {
          remote: 'success' as const,
          data: response.data,
        };
      } else {
        return {
          remote: 'failure' as const,
          errors: {
            status: response.error.status,
            errors: response.error.message,
          },
        };
      }
    },
  });
}
