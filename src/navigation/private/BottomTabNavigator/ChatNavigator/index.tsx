import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import { ChatParamList } from '@/navigation/types';
import Channel from '@/screens/Channel';

const Stack = createStackNavigator<ChatParamList>();
function ChatNavigator(): React.ReactElement {
  return (
    <Stack.Navigator initialRouteName="Channel">
      <Stack.Screen
        name="Channel"
        component={Channel}
        options={{
          title: '채팅',
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}

export default ChatNavigator;
