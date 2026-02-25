import { useQuery } from '@tanstack/react-query';
import { driverService, vehicleService } from '../../services';
import { errorToast } from '../../components/toasts';

export const useGetCurrentDriverDetails = () => {
  return useQuery({
    queryKey: ['currentDriverKey'],
    queryFn: async () => {
      const response = await driverService.getCurrentDriver();

      if (!response.success) {
        const errorMsg =
          response.error.message || 'An unexpected error occurred';
        throw new Error(errorMsg);
      }
      return response.data;
    },
    enabled: false,
  });
};

export const useGetVehicleInfo = () => {
  return useQuery({
    queryKey: ['vehicleInfoKey'],
    queryFn: async () => {
      const response = await vehicleService.getVehicles();
      console.log('res', response);

      if (!response.success) {
        const errorMsg =
          response.error.message || 'An unexpected error occurred';
        throw new Error(errorMsg);
      }
      return response.data;
    },
  });
};
