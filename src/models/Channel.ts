import { flow, Instance, types } from 'mobx-state-tree';
import SendBird from 'sendbird';

import Chat from './Chat';

import { convertTimeStampDiffString } from '@/utils';

const Channel = types
  .model({
    url: types.maybeNull(types.string),
    name: types.maybeNull(types.string),
    members: types.maybeNull(types.string),
    profileUrl: types.maybeNull(types.string),
    timeDiffString: types.maybeNull(types.string),
    lastMessage: types.maybeNull(Chat),
    unreadMessageCount: types.maybeNull(types.number),
    title: types.maybeNull(types.string),
  })
  .actions((self) => {
    const fromGroupChannel = flow(function* fromGroupChannel(
      groupChanel: SendBird.GroupChannel,
      sendbirdId: string,
    ) {
      const message =
        'message' in groupChanel.lastMessage
          ? groupChanel.lastMessage.message
          : groupChanel.lastMessage.name;

      let channelData: {
        members: {
          id: number;
          sendbirdId: string;
          nickname: string;
          plainProfileUrl: string;
        }[];
      };
      if (groupChanel.data) {
        channelData = JSON.parse(groupChanel.data);
      }
      const members = channelData?.members?.filter((x) => x.sendbirdId !== sendbirdId);

      const sb = SendBird.getInstance();
      const userQuery = sb.createApplicationUserListQuery();
      userQuery.userIdsFilter = [members[0]?.sendbirdId];

      if (userQuery.hasNext) {
        const member = yield userQuery.next();
        self.profileUrl = member[0]?.plainProfileUrl;
      }
      self.url = groupChanel.url;
      self.name = groupChanel.name;
      if (members) {
        self.title = members.map((x) => x.nickname).join(',');
      }
      self.timeDiffString = convertTimeStampDiffString(groupChanel.lastMessage.createdAt);
      self.lastMessage = Chat.create({
        messageType: groupChanel.lastMessage.messageType,
        message,
      });
      self.unreadMessageCount = groupChanel.unreadMessageCount;
    });
    return { fromGroupChannel };
  });

export type IChannel = Instance<typeof Channel>;

export default Channel;
