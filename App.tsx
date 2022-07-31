import * as eva from '@eva-design/eva';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import notifee from '@notifee/react-native';
import { ApplicationProvider } from '@ui-kitten/components';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import * as Updates from 'expo-updates';
import { observer } from 'mobx-react';
import React, { ReactElement, useEffect } from 'react';
import { Alert, AppState, AppStateStatus, Platform } from 'react-native';
import { QueryClientProvider, QueryClient, focusManager } from 'react-query';
import * as Sentry from 'sentry-expo';

import ToastAlert from '@/components/Alert/ToastAlert';
import Router from '@/navigation';
import rootStore from '@/stores';
import { onNotificationAndroid } from '@/utils/notifyAndroid';

Sentry.init({
  // dsn: 'https://90fe24d5d4f847819c52af9d54a8e16e@o494846.ingest.sentry.io/6417354',
  enableInExpoDevelopment: true,
  debug: false,
  environment: process.env.NODE_ENV,
  release: Updates.runtimeVersion,
});

async function checkUpdate(): Promise<void> {
  if (__DEV__) {
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

SplashScreen.preventAutoHideAsync();

// Create a query client
const queryClient = new QueryClient();

export function App(): ReactElement {
  async function onAppStateChange(status: AppStateStatus): Promise<void> {
    // Refetch on App focus
    if (Platform.OS !== 'web') {
      focusManager.setFocused(status === 'active');
    }
    checkUpdate();
  }

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
      <StatusBar style="auto" backgroundColor="#FFFFFF" translucent={false} />
      <ApplicationProvider {...eva} theme={{ ...eva.light }}>
        <ActionSheetProvider>
          <>
            <Router />
            <GlobalToastAlert />
          </>
        </ActionSheetProvider>
      </ApplicationProvider>
    </QueryClientProvider>
  );
}

export default observer(App);

notifee.onBackgroundEvent(onNotificationAndroid);
