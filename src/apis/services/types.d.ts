/* eslint-disable @typescript-eslint/no-unused-vars */
namespace ThunderAPI {
  declare type ErrorMsg = {
    code: string;
    message: Array<string>;
    path: string;
    timestamp: number;
  };

  declare type User = {
    id: number;
    name: string;
    birthday: string;
    phoneNumber: string;
    gender: string;
    email: string;

    verified: boolean;
    token: string;
    refreshToken: string;

    lastLoggedAt: string;
    logged: boolean;
  };
}

declare type ThunderListResponse<T> = {
  data: T[];
  meta: {
    itemsPerPage: number;
    totalItems: number;
    currentPage: number;
    totalPages: number;
    sortBy?: [[string]];
    search?: string;
    searchBy?: [string];
  };
  links: {
    first?: string;
    previous?: string;
    current?: string;
    next?: string;
    last?: string;
  };
};

enum ErrorMessage {}
