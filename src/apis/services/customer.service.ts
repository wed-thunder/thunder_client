import * as Sentry from 'sentry-expo';

import { ApiResponse, isServerError } from '../api';
import privateApi from '../privateApi';
import publicApi from '../publicApi';

import { Profile } from '@/models';

const BASE_URL = '/v1/customers';

export const getProfile = async (): Promise<Profile> => {
  try {
    const { data }: ApiResponse<Profile> = await privateApi.get(`${BASE_URL}/me`);

    return isServerError(data) ? null : data;
  } catch (err) {
    Sentry.Native.captureException(err);
    return Promise.reject(err);
  }
};

export const updateProfile = async (body: ThunderAPI.User.UpdateUserDto): Promise<Profile> => {
  try {
    const { data }: ApiResponse<Profile> = await privateApi.patch(`${BASE_URL}/me`, body);

    return isServerError(data) ? null : data;
  } catch (err) {
    Sentry.Native.captureException(err);
    return Promise.reject(err);
  }
};

export const updateProfileImage = async (body: FormData | null): Promise<void> => {
  await privateApi.patch(`${BASE_URL}/me/profile-images`, body, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

// export const getKeywords = async (): Promise<NestListResponse<ThunderAPI.User.Keyword>> => {
//   const { data }: ApiResponse<NestListResponse<ThunderAPI.User.Keyword>> = await privateApi.get(
//     `${BASE_URL}/me/keywords`,
//   );

//   return isServerError(data) ? null : data;
// };

export const deleteKeyword = async (id: number): Promise<void> => {
  await privateApi.delete(`${BASE_URL}/me/keywords/${id}`);
};

// export const addKeyword = async (
//   body: ThunderAPI.User.Keyword.CreateRequestDto,
// ): Promise<ThunderAPI.User.Keyword> => {
//   const { data }: ApiResponse<ThunderAPI.User.Keyword> = await privateApi.post(
//     `${BASE_URL}/me/keywords`,
//     { ...body },
//   );

//   return isServerError(data) ? null : data;
// };

export const getNickNameExists = async (nickname: string): Promise<{ isExist: boolean }> => {
  try {
    const { data }: ApiResponse<{ isExist: boolean }> = await publicApi.get(
      `${BASE_URL}/nickname/exists?nickname=${nickname}`,
    );

    return isServerError(data) ? null : data;
  } catch (err) {
    Sentry.Native.captureException(err);
    return Promise.reject(err);
  }
};

// 서비스업데이트
export const updateService = async (body: ThunderAPI.User.UpdateServiceDto): Promise<void> => {
  await privateApi.patch(`${BASE_URL}/me/services`, body);
};
