import { useMutation } from '@tanstack/react-query';
import { riderSignUpApi } from '../../api/riderApis';
import {
  IRiderSignUpFormPayload,
  IVehicleFormPayload,
} from '../../api/types/riderTypes';
import { addVehicleApi } from '../../api/vehicleApis';
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
export function useAddVehicle() {
  return useMutation({
    mutationKey: ['VehicleInfo'],
    mutationFn: async (payload: IVehicleFormPayload) => {
      const response = await addVehicleApi(payload);
      console.log('useAddVehicle', JSON.stringify(response, null, 2));
      return response;
    },
  });
}
