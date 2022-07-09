import { NavigationContainer, NavigationContainerRef } from '@react-navigation/native';
import { observer } from 'mobx-react';
import React, { useRef, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import PrivateRootStackNavigator from './private';
import PublicRootStackNavigator from './public';
import { PrivateRootSTackParamList } from './types';

import authStorage from '@/storage/auth';
import rootStore from '@/stores';

function Router(): React.ReactElement {
  const navigationRef = useRef<NavigationContainerRef<PrivateRootSTackParamList>>(null);
  const [navigationLoading, setNavigationLoading] = useState(false);
  const { authStore } = rootStore;

  return (
    <SafeAreaProvider>
      <NavigationContainer
        ref={navigationRef}
        onReady={() => {
          setNavigationLoading(true);
        }}>
        {authStore.isLogin ? <PrivateRootStackNavigator /> : <PublicRootStackNavigator />}
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default observer(Router);
