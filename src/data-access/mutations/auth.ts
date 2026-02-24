import { useMutation } from '@tanstack/react-query';
import {
  riderSignInApi,
  riderSignUpApi,
  toggleOnlineStatusApi,
} from '../../api/riderApis';
import { IDriverSignInPayload } from '../../api/types/authTypes';
import { IRiderSignUpFormPayload } from '../../api/types/riderTypes';
import {
  forgotPasswordSendOtpApi,
  forgotPasswordVerifyOtpApi,
  resetPasswordApi,
} from '../../api/authApis';
export function useSignIn() {
  return useMutation({
    mutationKey: ['signIn'],
    mutationFn: async (payload: IDriverSignInPayload) => {
      const response = await riderSignInApi(payload);
      return response;
    },
  });
}
export function useSignUp() {
  return useMutation({
    mutationKey: ['signUp'],
    mutationFn: async (payload: IRiderSignUpFormPayload) => {
      const response = await riderSignUpApi(payload);
      return response;
    },
  });
}
export function useToggleStatus() {
  return useMutation({
    mutationKey: ['toggleStatus'],
    mutationFn: async () => {
      const response = await toggleOnlineStatusApi();
      return response;
    },
  });
}

// forgot password api
export function useForgotPasswordSendOtpApi() {
  return useMutation({
    mutationKey: ['forgotPasswordSendOtp'],
    mutationFn: async (email: string) => {
      const response = await forgotPasswordSendOtpApi({ email });
      console.log('send otp ', response);

      return response;
    },
  });
}
export function useForgotPasswordVerifyOtpApi() {
  return useMutation({
    mutationKey: ['forgotPasswordVerifyOtp'],
    mutationFn: async (data: { email: string; otp: string }) => {
      const response = await forgotPasswordVerifyOtpApi({
        email: data.email,
        otp: data.otp,
      });
      return response;
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
      const response = await resetPasswordApi({
        email: data.email,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword,
      });
      return response;
    },
  });
}
