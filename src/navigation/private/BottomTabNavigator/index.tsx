import {
  // BottomTabNavigationOptions,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import React from 'react';
import { FlexStyle, Platform } from 'react-native';

import ChatNavigator from './ChatNavigator';
import FriendNavigator from './FriendNavigator';
import NoticeNavigator from './NoticeNavigator';
import SettingsNavigator from './SettingsNavigator';
import ThunderNavigator from './ThunderNavigator';

import COLOR from '@/constant/color';
import { BottomTabParamList } from '@/navigation/types';

const BottomTab = createBottomTabNavigator<BottomTabParamList>();

// const defaultHeaderOptions: BottomTabNavigationOptions = {
//   headerTitleAlign: 'left',
//   headerShadowVisible: false,
//   headerTitleStyle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//   },
// };
function BottomTabNavigator(): React.ReactElement {
  const tabBarStyle: FlexStyle = {
    paddingTop: 5,
  };

  if (Platform.OS !== 'ios') {
    tabBarStyle.height = 62;
    tabBarStyle.paddingTop = 10;
    tabBarStyle.paddingBottom = 5;
  }

  return (
    <BottomTab.Navigator
      initialRouteName="FriendNavigator"
      screenOptions={{
        tabBarStyle,
        tabBarActiveTintColor: COLOR.BLACK,
        tabBarInactiveTintColor: COLOR.BLACK,
        tabBarLabelStyle: { fontSize: 12, fontWeight: '700' },
      }}>
      <BottomTab.Screen
        name="FriendNavigator"
        component={FriendNavigator}
        // options={({ navigation }) => ({
        //   ...defaultHeaderOptions,
        //   title: '팝니다',

        // })}
      />
      <BottomTab.Screen name="ChatNavigator" component={ChatNavigator} />
      <BottomTab.Screen name="ThunderNavigator" component={ThunderNavigator} />
      <BottomTab.Screen name="NoticeNavigator" component={NoticeNavigator} />
      <BottomTab.Screen name="SettingsNavigator" component={SettingsNavigator} />
    </BottomTab.Navigator>
  );
}

export default BottomTabNavigator;
