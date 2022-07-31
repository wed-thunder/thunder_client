import { types } from 'mobx-state-tree';

const ToastAlertStore = types
  .model({
    visible: types.optional(types.boolean, false),
    bodyText: types.maybeNull(types.string),
  })
  .actions((self) => {
    const closeToast = (): void => {
      self.visible = false;
      self.bodyText = '';
    };
    const showToast = (text: string): void => {
      self.bodyText = text;
      self.visible = true;
    };
    return { showToast, closeToast };
  });

export default ToastAlertStore;
