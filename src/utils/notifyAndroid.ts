import notifee, { EventType, AndroidImportance } from '@notifee/react-native';
// import messaging from '@react-native-firebase/messaging';
import { AppState } from 'react-native';

import rootStore from '@/stores';

// 푸시 알람 터치 핸들러
export const onNotificationAndroid = async (event): Promise<void> => {
  // console.log(event);
  if (event.type === EventType.PRESS) {
    const { pushStore } = rootStore;
    pushStore.setPushNotification(event.detail.notification?.data);
  }
};

// 공지사항
export const displayNotify = async (message): Promise<void> => {
  const { pushStore } = rootStore;
  const { data } = message;
  const channelId = await notifee.createChannel({
    id: 'NOTIFICATION',
    name: 'NOTIFICATION',
    importance: AndroidImportance.HIGH,
  });

  const pushData: {
    buyResaleArticleId?: string;
    sellResaleArticleId?: string;
  } = {};

  if (data.body) {
    const notifeeData = JSON.parse(data.body);
    if ('buyResaleArticleId' in notifeeData) {
      pushData.buyResaleArticleId = `${notifeeData.buyResaleArticleId}`;
    }
    if ('sellResaleArticleId' in notifeeData) {
      pushData.sellResaleArticleId = `${notifeeData.sellResaleArticleId}`;
    }
  }

  await notifee.displayNotification({
    id: message.messageId,
    title: data.title,
    body: data.message,
    data: pushData,
    android: {
      channelId,
      importance: AndroidImportance.HIGH,
      pressAction: {
        id: 'default',
      },
    },
  });
  pushStore.plusUnreadNoti();
};

// // 샌드버드
export const displaySendbirdNotify = async (message): Promise<void> => {
  const { channelStore } = rootStore.sendbirdStore;

  const { data } = message;
  const sendbirdData = JSON.parse(data.sendbird);
  const channelUrl = sendbirdData.channel.channel_url;
  const channelId = await notifee.createChannel({
    id: 'SENDBIRD',
    name: channelUrl,
    importance: AndroidImportance.HIGH,
  });

  if (AppState.currentState !== 'background' && channelUrl === channelStore?.openChannelUrl) {
    return;
  }
  const { pushStore } = rootStore;
  const notifees = await notifee.getDisplayedNotifications();
  notifees.forEach(async (item) => {
    if (item.notification?.data?.channelUrl === channelUrl) {
      await notifee.cancelNotification(item.id);
    }
  });
  const pushData = {
    sendbird: 'true',
    channelUrl,
    channelTitle: sendbirdData.sender.name,
  };
  await notifee.displayNotification({
    id: message.messageId,
    title: sendbirdData.channel.name,
    body: data.message,
    data: pushData,
    android: {
      channelId,
      importance: AndroidImportance.HIGH,
      pressAction: {
        id: 'default',
      },
    },
  });
  pushStore.plusUnreadPush();
};

// 안드로이드 푸쉬 처리
export const registerNotifyAndroid = (): void => {
  // Foreground Notification
  // messaging().onMessage(async (message) => {
  //   const isSendbirdNotification = Boolean(message.data.sendbird);
  //   if (!isSendbirdNotification) {
  //     // 공지사항
  //     displayNotify(message);
  //   } else {
  //     // 샌드버드
  //     displaySendbirdNotify(message);
  //   }
  // });
};

// Background Notification
// messaging().setBackgroundMessageHandler(async (message) => {
//   const isSendbirdNotification = Boolean(message.data.sendbird);
//   if (!isSendbirdNotification) {
//     // 공지사항
//     displayNotify(message);
//   } else {
//     // 샌드버드
//     displaySendbirdNotify(message);
//   }

// });
