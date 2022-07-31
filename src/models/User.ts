export interface User {
  id: number;
  name: string;
}

export type Profile = {
  id: number;
  isActive: boolean;
  createdAt: string;
  modifiedAt: string;
  deletedAt?: string;
  name: string;
  nickName?: string;
  email?: string;
  isEmailVerified: boolean;
  phone: string;
  isPhoneVerified: boolean;
  birthday?: string;
  sex?: string;
  gender?: string;
  withdrawalReason?: string;
  lastLoggedAt?: string;
  isNewsLetterSubscribe?: boolean;
  isBlacklist: boolean;
  memo?: string;
  nickname?: string;
  profileImage?: string;
  user: User;
  userType?: string;
};
