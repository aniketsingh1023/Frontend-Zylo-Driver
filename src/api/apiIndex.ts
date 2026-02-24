import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  CancelTokenSource,
} from 'axios';

import { getLocalStorage } from '../utils/helper';
import { SERVER_URL } from '../config';
import { useNavigation } from '@react-navigation/native';
import { navigationRef } from '../screens/auth/navigationRef';

const baseURL = SERVER_URL;

const axiosInstance = async (): Promise<AxiosInstance> => {
  return axios.create({ baseURL });
};

const { CancelToken } = axios;

export const createCancelToken = (): {
  token: CancelTokenSource['token'];
  cancel: CancelTokenSource['cancel'];
} => {
  const source = CancelToken.source();
  return {
    token: source.token,
    cancel: source.cancel,
  };
};

interface ParsedSuccess<T> {
  remote: 'success';
  data: T;
}

interface ParsedFailure {
  remote: 'failure';
  error: {
    errors: any;
  };
}

type ParsedResponse<T> = ParsedSuccess<T> | ParsedFailure;

const parseResponse = <T = any>(response: string): ParsedResponse<T> => {
  try {
    const data = JSON.parse(response) || response;

    if (data?.errors) {
      return {
        remote: 'failure',
        error: { errors: data.errors },
      };
    }
    return {
      remote: 'success',
      data,
    };
  } catch (error) {
    return {
      remote: 'failure',
      error: { errors: response },
    };
  }
};

interface RequestResult<T = any> {
  remote: 'success';
  data: T;
}

interface RequestError {
  remote: 'failure';
  errors: {
    status?: number;
    errors: any;
  };
}

export const request = async <T = any>(
  config: AxiosRequestConfig,
  auth = true,
): Promise<RequestResult<T> | RequestError> => {
  try {
    const token = await getLocalStorage('token');
    const instance = await axiosInstance();

    config.headers = {
      'Content-Type': 'application/json',
      ...config.headers,
      Authorization: token ? `Bearer ${token}` : undefined,
      'Client-Time': Date.now(),
      'Client-Time-Zone': Intl.DateTimeFormat().resolvedOptions().timeZone,
    };
    // console.log('config', config);

    const response: AxiosResponse = await instance.request({
      ...config,
      transformResponse: (res: any) => {
        const parsed = parseResponse<T>(res);
        // console.log('parsed', parsed);

        return parsed.remote === 'success' ? parsed.data : parsed;
      },
    });

    return {
      remote: 'success',
      data: response.data,
    };
  } catch (error: any) {
    return handleAxiosError(error);
  }
};

export const requestByToken = async <T = any>(
  config: AxiosRequestConfig,
): Promise<RequestResult<T> | RequestError> => {
  try {
    const token = await getLocalStorage('token');
    const instance = await axiosInstance();

    config.headers = {
      'Content-Type': 'application/json',
      ...config.headers,
      Authorization: token ? `Bearer ${token}` : undefined,
      'Client-Time': Date.now(),
      'Client-Time-Zone': Intl.DateTimeFormat().resolvedOptions().timeZone,
    };

    const response: AxiosResponse = await instance.request({
      ...config,
      transformResponse: (res: any) => {
        const parsed = parseResponse<T>(res);
        return parsed.remote === 'success' ? parsed.data : parsed;
      },
    });

    return {
      remote: 'success',
      data: response.data,
    };
  } catch (error: any) {
    return handleAxiosError(error);
  }
};

function handleAxiosError(error: any): RequestError {
  if (error?.response) {
    const axiosError = error;
    let errorMessage = axiosError?.response?.data?.errors;

    if (axiosError?.response?.status === 500) {
      errorMessage = axiosError?.response?.data?.error || [
        'Internal Server Error',
      ];
    } else if (axiosError?.response?.status === 401) {
      navigationRef.navigate('SignInScreen');
      errorMessage = 'Forbidden';
    } else {
      errorMessage =
        axiosError?.response?.data?.error?.errors || axiosError?.response?.data;
    }

    return {
      remote: 'failure',
      errors: {
        status: axiosError?.response?.status,
        errors: errorMessage,
      },
    };
  } else {
    let errorMessage = error?.message;
    if (errorMessage === 'Network Error') {
      console.log('No internet connection!!!');
      errorMessage = 'No internet connection';
    }

    return {
      remote: 'failure',
      errors: { errors: errorMessage },
    };
  }
}

const toExport = {
  request,
  requestByToken,
  parseResponse,
};

export default toExport;
