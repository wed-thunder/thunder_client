import { flow, getParent, hasParent, types, cast } from 'mobx-state-tree';
import SendBird from 'sendbird';
import * as Sentry from 'sentry-expo';

import { ISendbirdStore } from '.';

import { IRootStore } from '..';

import Channel from '@/models/Channel';
import sendbirdStorage from '@/storage/sendbird';

const ChannelStore = types
  .model({
    openChannelUrl: types.maybeNull(types.string),
    channelList: types.optional(types.array(Channel), []),
  })
  .actions((self) => {
    const setTotalUnreadMessageCount = (): void => {
      const totalUnreadMessageCount = self.channelList.reduce(
        (acc, cur): number => acc + cur.unreadMessageCount,
        0,
      );
      if (hasParent(self)) {
        const sendbird: ISendbirdStore = getParent(self);
        sendbird.setTotalUnreadMessageCount(totalUnreadMessageCount);
        const root: IRootStore = getParent(sendbird);
        root.pushStore.setUnreadPush(totalUnreadMessageCount);
      }
    };
    const sbGetGroupChannelList = flow(function* getGroupChannelList() {
      try {
        const sb = SendBird.getInstance();
        const myGroupChannelListQuery = sb.GroupChannel.createMyGroupChannelListQuery();
        const groupChannelList = yield myGroupChannelListQuery.next((channels, error) => {
          if (error) {
            console.error('Get Group Channel List Failed.');
          }
        });
        const newChannelList = [];
        const { sendbirdId } = yield sendbirdStorage.read();

        for (let i = 0; i < groupChannelList?.length; i += 1) {
          const channel = groupChannelList[i];
          const newChannel = Channel.create();
          yield newChannel.fromGroupChannel(channel, sendbirdId);
          newChannelList.push(newChannel);
        }
        self.channelList = cast(newChannelList);
        setTotalUnreadMessageCount();
      } catch (error) {
        console.log(error);
      }
    });
    const changeChannelList = (): void => {
      try {
        sbGetGroupChannelList();
      } catch (error) {
        console.log(error);
      }
    };
    const leaveChannelList = (channelUrl: string): void => {
      const deleteIndex = self.channelList.findIndex((x) => x.url === channelUrl);
      if (deleteIndex > -1) {
        self.channelList.splice(deleteIndex, 1);
      }
      setTotalUnreadMessageCount();
    };
    return { changeChannelList, sbGetGroupChannelList, leaveChannelList };
  })
  .actions((self) => {
    const sbGetGroupChannel = flow(function* getGroupChannel(channelUrl: string) {
      const sb = SendBird.getInstance();
      const groupChannel: SendBird.GroupChannel = yield sb.GroupChannel.getChannel(
        channelUrl,
        (channel, error) => {
          if (error) {
            console.log('Get Group Channel Failed.');
          }
        },
      );

      return groupChannel;
    });

    const sbLeaveGroupChannel = flow(function* sbLeaveGroupChannel(channelUrl: string) {
      yield sbGetGroupChannel(channelUrl).then((channel) =>
        channel.leave((response, error) => {
          if (error) {
            console.error('Leave Group Channel Failed.');
          }
        }),
      );
      self.leaveChannelList(channelUrl);
    });
    const createGroupChannelListHandler = (): void => {
      const sb = SendBird.getInstance();
      const channelHandler = new sb.ChannelHandler();
      channelHandler.onChannelChanged = self.changeChannelList;
      sb.addChannelHandler('GROUP_CHANNEL_LIST_HANDLER', channelHandler);
    };
    const createChannelWithUserIds = (
      channelUrl,
      sendbirdId,
      channelName,
      data,
      callback,
    ): void => {
      const sb = SendBird.getInstance();
      const params = new sb.GroupChannelParams();
      params.channelUrl = channelUrl;
      params.name = channelName;
      params.addUserIds(sendbirdId);
      params.data = data;
      params.isPublic = true;

      sb.GroupChannel.createChannel(params, (groupChannel, error) => {
        if (error) {
          console.error('Create Group Chnanel Failed');
          Sentry.Native.captureMessage(`Create Group Chnanel Failed: ${channelUrl}`);
        } else {
          callback(groupChannel);
        }
      });
    };
    const setOpenChannelUrl = (channelUrl): void => {
      self.openChannelUrl = channelUrl;
    };
    return {
      sbGetGroupChannel,
      sbLeaveGroupChannel,
      createGroupChannelListHandler,
      createChannelWithUserIds,
      setOpenChannelUrl,
    };
  });

export default ChannelStore;
