import { isServerError, ApiResponse } from '../api';
import { Token } from '../privateApi';
import publicApi from '../publicApi';

const BASE_URL = '/v1/auth';

// 인증번호 요청
export const authenticatePhone = async (phone: string): Promise<boolean> => {
  const data: boolean = await publicApi.post(`${BASE_URL}/authenticate-phone`, {
    phone,
  });

  return isServerError(data) ? null : data;
};

// 인증번호 확인
export const verifyPhone = async (phone: string, code: string): Promise<Token> => {
  const { data }: ApiResponse<Token> = await publicApi.post(`${BASE_URL}/verify-phone`, {
    phone,
    code,
  });

  return isServerError(data) ? null : data;
};

// 회원가입
export const signUp = async (
  name: string,
  uid: string,
  password: string,
  token: string,
): Promise<Token> => {
  const { data }: ApiResponse<Token> = await publicApi.post(
    `${BASE_URL}/signup`,
    {
      name,
      uid,
      password,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return isServerError(data) ? null : data;
};
