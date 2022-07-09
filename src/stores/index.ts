import { Instance, types } from 'mobx-state-tree';
import Pubsub from 'pubsub-js';

import AuthStore from './authStore';

const RootStore = types
  .model({
    isLoaded: types.optional(types.boolean, false),
    authStore: types.maybeNull(AuthStore),
  })
  .actions((self) => {
    const setLoaded = (loaded: boolean): void => {
      self.isLoaded = loaded;
    };
    return { setLoaded };
  });

const rootStore = RootStore.create({
  authStore: AuthStore.create(),
});

export type IRootStore = Instance<typeof RootStore>;

export default rootStore;

Pubsub.subscribe('logout', rootStore.authStore.logout);
Pubsub.subscribe('setUser', (_, data) => {
  rootStore.authStore.setUser(data);
});
