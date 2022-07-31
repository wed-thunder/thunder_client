import { Instance, types } from 'mobx-state-tree';
import Pubsub from 'pubsub-js';

import AuthStore from './authStore';
import PushStore from './pushStore';
import SendbirdStore from './sendbirdStore';
import ToastAlertStore from './toastAlertStore';

const RootStore = types
  .model({
    isLoaded: types.optional(types.boolean, false),
    authStore: types.maybeNull(AuthStore),
    sendbirdStore: types.maybe(SendbirdStore),
    toastAlertStore: types.maybe(ToastAlertStore),
    pushStore: types.maybe(PushStore),
  })
  .actions((self) => {
    const setLoaded = (loaded: boolean): void => {
      self.isLoaded = loaded;
    };
    return { setLoaded };
  });

const rootStore = RootStore.create({
  authStore: AuthStore.create(),
  sendbirdStore: SendbirdStore.create(),
  toastAlertStore: ToastAlertStore.create(),
  pushStore: PushStore.create(),
});

export type IRootStore = Instance<typeof RootStore>;

export default rootStore;

Pubsub.subscribe('logout', rootStore.authStore.logout);
Pubsub.subscribe('setUser', (_, data) => {
  rootStore.authStore.setUser(data);
});
