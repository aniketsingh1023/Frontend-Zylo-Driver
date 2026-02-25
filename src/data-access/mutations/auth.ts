import { useMutation } from '@tanstack/react-query';
import { driverService, authService } from '../../services';
import { IDriverSignInPayload } from '../../api/types/authTypes';
import { IRiderSignUpFormPayload } from '../../api/types/riderTypes';


export function useSignIn() {
  return useMutation({
    mutationKey: ['signIn'],
    mutationFn: async (payload: IDriverSignInPayload) => {
      // Convert new service response to old format for compatibility
      const response = await driverService.login(payload);

      // Transform response to match old API format
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


export function useSignUp() {
  return useMutation({
    mutationKey: ['signUp'],
    mutationFn: async (payload: IRiderSignUpFormPayload) => {
      // Convert new service response to old format for compatibility
      const response = await driverService.register(payload as any);

      // Transform response to match old API format
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

export function useToggleStatus() {
  return useMutation({
    mutationKey: ['toggleStatus'],
    mutationFn: async () => {
      // Convert new service response to old format for compatibility
      const response = await driverService.toggleOnlineStatus();

      // Transform response to match old API format
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

// forgot password api
export function useForgotPasswordSendOtpApi() {
  return useMutation({
    mutationKey: ['forgotPasswordSendOtp'],
    mutationFn: async (email: string) => {
      // Convert new service response to old format for compatibility
      const response = await authService.forgotPassword({ email });
      console.log('send otp ', response);

      // Transform response to match old API format
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

export function useForgotPasswordVerifyOtpApi() {
  return useMutation({
    mutationKey: ['forgotPasswordVerifyOtp'],
    mutationFn: async (data: { email: string; otp: string }) => {
      // Convert new service response to old format for compatibility
      const response = await authService.verifyOtp({
        email: data.email,
        otp: data.otp,
      });

      // Transform response to match old API format
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

export function useResetPasswordApi() {
  return useMutation({
    mutationKey: ['resetPasswordApi'],
    mutationFn: async (data: {
      email: string;
      newPassword: string;
      confirmPassword: string;
    }) => {
      // Convert new service response to old format for compatibility
      const response = await authService.resetPassword({
        email: data.email,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword,
      });

      // Transform response to match old API format
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
