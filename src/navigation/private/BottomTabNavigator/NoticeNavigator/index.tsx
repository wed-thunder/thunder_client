import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import { NoticeParamList } from '@/navigation/types';
import Channel from '@/screens/Channel';

const Stack = createStackNavigator<NoticeParamList>();
function NoticeNavigator(): React.ReactElement {
  return (
    <Stack.Navigator initialRouteName="Notice">
      <Stack.Screen
        name="Notice"
        component={Channel}
        options={{
          title: '알림',
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}

export default NoticeNavigator;
