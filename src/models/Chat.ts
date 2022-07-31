import { Instance, types } from 'mobx-state-tree';

const Chat = types.model({
  messageType: types.string,
  message: types.maybeNull(types.string),
});

export type IChat = Instance<typeof Chat>;

export default Chat;
