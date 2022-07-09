import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import dayjs from 'dayjs';
import jwt_decode from 'jwt-decode';
import Pubsub from 'pubsub-js';
import * as Sentry from 'sentry-expo';

import { apiConfig, ApiResponse, isServerError } from './api';
import publicApi from './publicApi';

import { IAuthUser } from '@/models';
import authStorage from '@/storage/auth';
import userStorage from '@/storage/user';

export type Token = {
  accessToken: string;
  refreshToken: string;
  profile?: IAuthUser;
};

type ThunderJwtPayload = {
  tokenType: string;
  exp: number;
  jti: string;
  userId: number;
};

export interface ExtendedAxiosRequestConfig extends AxiosRequestConfig {
  retry?: boolean;
}

const privateApi = axios.create(apiConfig);

const isTokenExpired = (token: string): boolean => {
  const decoded = jwt_decode<ThunderJwtPayload>(token);
  return dayjs(new Date()).isAfter(decoded.exp * 1000);
};

const refreshTokenRequest = async (refreshToken: string): Promise<Token> => {
  const { data }: ApiResponse<Token> = await publicApi.post('/vi/auth/refresh', {
    refreshToken,
  });
  return isServerError(data) ? null : data;
};

privateApi.interceptors.request.use(
  async (config) => {
    const { accessToken } = await authStorage.read();
    if (accessToken) {
      config.headers = {
        Authorization: `Bearer ${accessToken}`,
      };
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// RefreshToken
privateApi.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    // 요청이 발생하였지만 서버가 2xx 이외의 상태 코드로 응답
    if (error.response) {
      const { status } = error.response;
      const originalRequest: ExtendedAxiosRequestConfig = error.config;

      const oldUser = await userStorage.read();
      const { accessToken, refreshToken } = await authStorage.read();
      if (status === 401 && isTokenExpired(accessToken) && !originalRequest.retry) {
        // refresh token
        originalRequest.retry = true;

        try {
          if (oldUser === null) {
            throw Error('Old User LogOut');
          }
          const response = await refreshTokenRequest(refreshToken);

          const { profile } = response;
          const auth = {
            accessToken: response.accessToken,
            refreshToken: response.refreshToken,
          };

          await userStorage.store({
            ...profile,
            userId: oldUser.uid,
          } as IAuthUser);
          await authStorage.store(auth);

          if (profile === null || auth === null) {
            throw Error('LogOut');
          }

          Pubsub.publishSync('setUser', {
            ...profile,
            userId: oldUser.uid,
          });
          privateApi.defaults.headers.common.Authorization = `Bearer ${auth.accessToken}`;

          return privateApi(originalRequest);
        } catch (refreshError) {
          Pubsub.publishSync('logout');
          Sentry.Native.captureException(refreshError);
        }
      }
    }
    return Promise.reject(error);
  },
);

export default privateApi;
