import { types } from 'mobx-state-tree';

enum noticeType {
  NOTICE = 'notice',
  ACTIVITY = 'activity',
  KEYWORD = 'keyword',
}

const PushStore = types
  .model({
    navigation: types.optional(types.boolean, false),
    noticeId: types.maybeNull(types.number),
    noticeType: types.maybeNull(types.enumeration([...Object.values(noticeType)])),
    link: types.maybeNull(types.string),
    sendbird: types.maybeNull(types.boolean),
    channelTitle: types.maybeNull(types.string),
    channelUrl: types.maybeNull(types.string),
    buyResaleArticleId: types.maybeNull(types.number),
    sellResaleArticleId: types.maybeNull(types.number),
    unreadPush: types.optional(types.number, 0),
    unreadNoti: types.optional(types.number, 0),
  })
  .actions((self) => {
    const setPushNotification = (data): void => {
      self.navigation = true;
      self.noticeId = Number(data.noticeId);
      self.noticeType = data.noticeType;
      self.link = data.link;
      self.sendbird = Boolean(data.sendbird);
      self.channelTitle = data.channelTitle;
      self.channelUrl = data.channelUrl;
      self.buyResaleArticleId = Number(data.buyResaleArticleId);
      self.sellResaleArticleId = Number(data.sellResaleArticleId);
    };
    const setIOSPushNotification = (data): void => {
      self.navigation = true;
      self.noticeId = Number(data.noticeId);
      self.noticeType = data.noticeType;
      self.link = data.link;
      self.sendbird = Boolean(data.channel);
      self.channelTitle = data.channel?.name;
      self.channelUrl = data.channel?.channel_url;
      self.buyResaleArticleId = Number(data.buyResaleArticleId);
      self.sellResaleArticleId = Number(data.sellResaleArticleId);
    };
    const reset = (): void => {
      self.navigation = false;
      self.sendbird = null;
      self.channelTitle = null;
      self.channelUrl = null;
      self.buyResaleArticleId = null;
      self.sellResaleArticleId = null;
    };
    const setUnreadPush = (count: number): void => {
      self.unreadPush = count;
    };
    const plusUnreadPush = (count = 1): number => {
      self.unreadPush += count;
      return self.unreadPush;
    };
    const minusUnreadPush = (count = 1): number => {
      if (count > self.unreadPush) {
        self.unreadPush = 0;
      } else {
        self.unreadPush -= count;
      }
      return self.unreadPush;
    };
    const setUnreadNoti = (count: number): void => {
      self.unreadNoti = count;
    };
    const plusUnreadNoti = (count = 1): number => {
      self.unreadNoti += count;
      return self.unreadPush;
    };
    const minusUnreadNoti = (count = 1): number => {
      if (count > self.unreadNoti) {
        self.unreadNoti = 0;
      } else {
        self.unreadNoti -= count;
      }
      return self.unreadNoti;
    };
    return {
      setPushNotification,
      setIOSPushNotification,
      reset,
      setUnreadPush,
      plusUnreadPush,
      minusUnreadPush,
      setUnreadNoti,
      plusUnreadNoti,
      minusUnreadNoti,
    };
  });

export default PushStore;
