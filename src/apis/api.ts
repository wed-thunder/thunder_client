import { API_URL } from '@env';
import { AxiosResponse } from 'axios';
import _ from 'lodash';

export interface PaginationParams {
  pageParam?: number;
  pageSize?: number;
}

export type ApiError = {
  message: string;
  code: string;
  errorInfo: any;
};

export type ApiResponse<T> = AxiosResponse<T | ApiError>;

export const apiConfig = {
  baseURL: API_URL || 'https://sample-alternative.com',
  timeout: 9000,
  headers: {
    Accept: 'application/json',
  },
};

export const isNetworkError = (error: Error): boolean =>
  _.get(error, 'isAxiosError', false) && !!_.get(error, 'request') && !_.get(error, 'response');

export function isServerError<T>(data: T | ApiError): data is ApiError {
  return 'errorInfo' in data;
}
