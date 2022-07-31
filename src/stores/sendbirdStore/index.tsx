import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { flow, types, getEnv, Instance } from 'mobx-state-tree';
import { Platform } from 'react-native';
import SendBird from 'sendbird';

import ChannelStore from './channelStore';
import ChatStore from './chatStore';

import sendbirdStorage from '@/storage/sendbird';
import userStorage from '@/storage/user';

const SendbirdStore = types
  .model({
    channelStore: types.maybe(ChannelStore),
    chatStore: types.maybe(ChatStore),
    totalUnreadMessageCount: types.optional(types.number, 0),
    sendbirdId: types.maybe(types.string),
  })
  .actions((self) => {
    const setTotalUnreadMessageCount = (count: number): void => {
      self.totalUnreadMessageCount = count;
    };
    const sbUpdateSendbirdProfile = flow(function* sbUpdateSendbirdProfile(
      nickname: string = null,
      profileUrl: string = null,
    ) {
      if (!nickname) {
        console.error('Nickname is required.');
        return null;
      }
      const sb = getEnv(self).sendbird;

      yield sb.updateCurrentUserInfo(nickname, profileUrl, (user, error) => {
        if (error) {
          console.error('SendBird Update Profile Failed.');
        }
      });
      return true;
    });
    const sbRegisterPushToken = flow(function* sbRegisterPushToken() {
      const token = (yield Notifications.getDevicePushTokenAsync()).data;
      const sb = getEnv(self).sendbird;
      if (Platform.OS === 'ios') {
        yield sb.registerAPNSPushTokenForCurrentUser(token, (result, error) => {
          if (error) {
            console.log('Register APN PUSH TOEKN Error', error);
          } else {
            console.log('Success Register APN PUSH TOEKN');
          }
        });
      } else {
        yield sb.registerGCMPushTokenForCurrentUser(token, (result, error) => {
          if (error) {
            console.log('Register GCM PUSH TOEKN Error', error);
          } else {
            console.log('Success Register GCM PUSH TOEKN');
          }
        });
      }
    });
    const sbUnregisterPushToken = flow(function* sbUnregisterPushToken() {
      const token = (yield Notifications.getDevicePushTokenAsync()).data;
      const sb = getEnv(self).sendbird;
      if (Platform.OS === 'ios') {
        yield sb.unregisterAPNSPushTokenForCurrentUser(token);
      } else {
        yield sb.unregisterGCMPushTokenForCurrentUser(token);
      }
    });

    const sbConnect = flow(function* sbConnect(sendbirdId: string, nickname: string, profileUrl) {
      if (!sendbirdId) {
        console.error('SendbirdId is required.');
        return null;
      }
      if (!nickname) {
        console.error('Nickname is required.');
        return null;
      }

      const sb = getEnv(self).sendbird;
      yield sb.connect(sendbirdId, (user, error) => {
        if (error) {
          console.error('SendBird Connect Failed.', error);
        }
      });
      yield sbUpdateSendbirdProfile(nickname, profileUrl);
      if (Device.isDevice) {
        yield sbRegisterPushToken();
      }
      yield sendbirdStorage.store({ sendbirdId, nickname });
      self.sendbirdId = sendbirdId;

      return true;
    });
    const sbDisconnect = flow(function* sbDisconnect() {
      const sb = SendBird.getInstance();
      if (sb) {
        yield sbUnregisterPushToken();
        yield sb.disconnect();
      }
    });

    // 초기 SendBird 셋팅
    const loadChat = flow(function* loadChat() {
      const user = yield userStorage.read();

      let service = null;
      if (user) {
        service = user.services?.find((x) => x.service === 'p-check');
      }

      if (user && service) {
        yield sbConnect(service.sendbirdId, user.nickname || user.name, user.signedProfileImageUrl);
        self.channelStore = ChannelStore.create();
        self.channelStore.sbGetGroupChannelList();
        self.channelStore.createGroupChannelListHandler();
        self.chatStore = ChatStore.create();
      }
    });

    // 초기화
    const init = flow(function* init() {
      yield loadChat();
    });
    // 차단관련
    const getBlockList = flow(function* getBlockUserList() {
      const sb = getEnv(self).sendbird;
      const query = sb.createBlockedUserListQuery();
      const userList: Array<SendBird.User> = yield query.next();
      return userList;
    });
    const blockUser = flow(function* blockUser(sendbirdId) {
      const sb = getEnv(self).sendbird;
      yield sb.blockUserWithUserId(sendbirdId);
    });
    const unBlockUser = flow(function* unBlockUser(sendbirdId) {
      const sb = getEnv(self).sendbird;
      yield sb.unblockUserWithUserId(sendbirdId);
    });

    return {
      setTotalUnreadMessageCount,
      sbUpdateSendbirdProfile,
      init,
      sbConnect,
      sbDisconnect,
      sbRegisterPushToken,
      sbUnregisterPushToken,
      getBlockList,
      blockUser,
      unBlockUser,
    };
  });

export type ISendbirdStore = Instance<typeof SendbirdStore>;

export default SendbirdStore;
