// import * as eva from '@eva-design/eva';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
// import { ApplicationProvider } from '@ui-kitten/components';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import * as Updates from 'expo-updates';
import { observer } from 'mobx-react';
import React, { ReactElement, useEffect } from 'react';
import { Alert, AppState, AppStateStatus, Platform } from 'react-native';
import { QueryClientProvider, QueryClient, focusManager } from 'react-query';
import * as Sentry from 'sentry-expo';

import { registerExpoPushToken } from '@/apis/services/exponent.service';
import ToastAlert from '@/components/Alert/ToastAlert';
import Router from '@/navigation';
import userStorage from '@/storage/user';
import rootStore from '@/stores';

Sentry.init({
  dsn: 'https://90fe24d5d4f847819c52af9d54a8e16e@o494846.ingest.sentry.io/6417354',
  enableInExpoDevelopment: true,
  debug: false,
  environment: process.env.NODE_ENV,
  release: Updates.runtimeVersion,
});

Notifications.setNotificationHandler({
  handleNotification: async (notification) => {
    const { channelStore } = rootStore.sendbirdStore;
    const triggers: any = notification?.request.trigger;

    if (!triggers) {
      return {
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
      };
    }

    let sendbirdData = null;
    if (Platform.OS === 'ios') {
      const data = triggers.payload;
      if (data.sendbird) {
        sendbirdData = data.sendbird;
      }
    } else {
      const { data } = triggers.remoteMessage;
      if (data.sendbird) {
        sendbirdData = JSON.parse(data.sendbird);
      }
    }

    if (sendbirdData?.channel?.channel_url === channelStore.openChannelUrl) {
      return null;
    }

    return {
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    };
  },
});

async function checkUpdate(): Promise<void> {
  // eslint-disable-next-line no-undef
  if (__DEV__) {
    // skip in development
    return;
  }

  try {
    const update = await Updates.checkForUpdateAsync();
    if (update.isAvailable) {
      await Updates.fetchUpdateAsync();

      Alert.alert(
        '업데이트를 위해 앱을 재시작합니다.',
        null,
        [{ text: '확인', onPress: () => Updates.reloadAsync() }],
        { cancelable: false },
      );
    }
  } catch (e) {
    // handle or log error
  }
}

function onAppStateChange(status: AppStateStatus): void {
  // Refetch on App focus
  if (Platform.OS !== 'web') {
    focusManager.setFocused(status === 'active');
  }

  checkUpdate();
}

SplashScreen.preventAutoHideAsync();

// Create a query client
const queryClient = new QueryClient();

export default function App(): ReactElement {
  useEffect(() => {
    const registerForPushNotificationsAsync = async (): Promise<void> => {
      if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }
        if (finalStatus !== 'granted') {
          return;
        }

        // Expo Token 저장
        const token = (await Notifications.getExpoPushTokenAsync()).data;
        const user = await userStorage.read();
        if (user) {
          try {
            await registerExpoPushToken(token, Device.osName);
          } catch (e) {
            Sentry.Native.captureException(e);
          }
        }

        if (Platform.OS === 'android') {
          Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
          });
        }
      }
    };
    registerForPushNotificationsAsync();
  }, []);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', onAppStateChange);
    return () => subscription.remove();
  }, []);

  const GlobalToastAlert = observer(() => {
    const { toastAlertStore } = rootStore;
    return <ToastAlert closeToast={toastAlertStore.closeToast} {...toastAlertStore} />;
  });

  return (
    <QueryClientProvider client={queryClient}>
      <StatusBar style="auto" backgroundColor="#FFF" translucent={false} />

      <ActionSheetProvider>
        <>
          <Router />
          <GlobalToastAlert />
        </>
      </ActionSheetProvider>
    </QueryClientProvider>
  );
}
