/* eslint-disable @typescript-eslint/no-unused-vars */
namespace ThunderAPI {
  declare type ErrorMsg = {
    code: string;
    message: Array<string>;
    path: string;
    timestamp: number;
  };

  declare namespace User {
    declare type UpdateUserDto = {
      name?: string;
    };

    declare type UpdateServiceDto = {
      service: string;
      notificationApprovedAt?: string;
      nightNotificationApprovedAt?: string;
    };
  }
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

  lastLoggedA: string;
  logged: boolean;
};
