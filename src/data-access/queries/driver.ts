import { useQuery } from '@tanstack/react-query';

import { errorToast } from '../../components/toasts';
import { getCurrentDriverDetailApi } from '../../api/riderApis';
import { getCurrentDriverVehicleApi } from '../../api/vehicleApis';

export const useGetCurrentDriverDetails = () => {
  return useQuery({
    queryKey: ['currentDriverKey'],
    queryFn: async () => {
      const response = await getCurrentDriverDetailApi();

      if (response.remote === 'failure') {
        const errorMsg =
          response?.errors?.errors?.message ||
          response?.errors?.errors ||
          'An unexpected error occurred';
        throw new Error(errorMsg);
      }
      return response.data.data;
    },
    enabled: false,
  });
};
export const useGetVehicleInfo = () => {
  return useQuery({
    queryKey: ['vehicleInfoKey'],
    queryFn: async () => {
      const response = await getCurrentDriverVehicleApi();
      console.log('res', response);

      if (response.remote === 'failure') {
        const errorMsg =
          response?.errors?.errors?.message ||
          response?.errors?.errors ||
          'An unexpected error occurred';
        throw new Error(errorMsg);
      }
      return response.data.data;
    },
  });
};
