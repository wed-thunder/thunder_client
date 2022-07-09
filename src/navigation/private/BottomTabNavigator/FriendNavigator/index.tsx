import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import { FriendParamList } from '@/navigation/types';
import ChannelScreen from '@/screens/Channel';

const Stack = createStackNavigator<FriendParamList>();
function FriendNavigator(): React.ReactElement {
  return (
    <Stack.Navigator initialRouteName="Friend">
      <Stack.Screen
        name="Friend"
        component={ChannelScreen}
        options={{
          title: '친구',
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}

export default FriendNavigator;
