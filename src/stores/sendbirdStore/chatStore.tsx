import { flow, types } from 'mobx-state-tree';
import * as mime from 'react-native-mime-types';
import SendBird from 'sendbird';

const ChatStore = types.model({}).actions(() => {
  const sbCreatePreviousMessageListQuery = (
    openChannel: SendBird.GroupChannel,
  ): SendBird.PreviousMessageListQuery => {
    return openChannel.createPreviousMessageListQuery();
  };
  const sbGetMessageList = flow(function* sbGetMessageList(
    previouseMessageListQuery: SendBird.PreviousMessageListQuery,
  ) {
    const limit = 30;
    const reverse = true;
    const messageList: (SendBird.UserMessage | SendBird.FileMessage | SendBird.AdminMessage)[] =
      yield previouseMessageListQuery.load(limit, reverse, '', (_message, error) => {
        if (error) {
          console.log('Get Message List Error');
        }
      });
    return messageList;
  });
  const sbSendTextMessage = (
    openChannel: SendBird.GroupChannel,
    textMessage,
    callback,
  ): SendBird.UserMessage => {
    return openChannel.sendUserMessage(textMessage, (message, error) => {
      if (error) {
        console.log('Send Text Message Error', error);
      } else {
        callback(message);
      }
    });
  };
  const sbSendFileMessage = (openChannel: SendBird.GroupChannel, uri: string, callback): void => {
    const sb = SendBird.getInstance();
    const fileMessageParams: SendBird.FileMessageParams = new sb.FileMessageParams();
    const type = mime.lookup(uri);
    fileMessageParams.file = {
      uri,
      name: '사진.jpg',
      type,
    };

    openChannel.sendFileMessage(fileMessageParams, (message, error) => {
      if (error) {
        console.log('Send File Message Error', error);
      } else {
        callback(message);
      }
    });
  };
  const sbMarkAsRead = (openChannel: SendBird.GroupChannel): void => {
    openChannel.markAsRead();
  };
  // 메시지 삭제
  const sbDeleteMessage = flow(function* sbDeleteMessage(groupChannel, message) {
    yield groupChannel.deleteMessage(message);
  });
  return {
    sbCreatePreviousMessageListQuery,
    sbGetMessageList,
    sbSendTextMessage,
    sbSendFileMessage,
    sbMarkAsRead,
    sbDeleteMessage,
  };
});

export default ChatStore;
