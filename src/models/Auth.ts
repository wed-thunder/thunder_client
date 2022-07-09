import { Instance, types } from 'mobx-state-tree';

export const Auth = types.model({
  accessToken: types.maybeNull(types.string),
  refreshToken: types.maybeNull(types.string),
});

export const AuthUser = types
  .model({
    id: types.maybeNull(types.number),
    uid: types.maybeNull(types.string),
    password: types.maybeNull(types.string),
    name: types.maybeNull(types.string),
    phone: types.maybeNull(types.string),
    signedProfileImageUrl: types.maybeNull(types.string),
  })
  .actions((self) => {
    const setProfileImage = (profileUrl: string): void => {
      self.signedProfileImageUrl = profileUrl;
    };
    const setName = (name: string): void => {
      self.name = name;
    };
    return { setProfileImage, setName };
  })
  .views((self) => ({
    viewName(): string {
      return self.name;
    },
  }));

export interface IAuthUser extends Instance<typeof AuthUser> {}

export interface IAuth extends Instance<typeof Auth> {}
