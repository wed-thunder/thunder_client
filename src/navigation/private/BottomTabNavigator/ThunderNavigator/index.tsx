import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import { ThunderParamList } from '@/navigation/types';
import Channel from '@/screens/Channel';

const Stack = createStackNavigator<ThunderParamList>();
function ThunderNavigator(): React.ReactElement {
  return (
    <Stack.Navigator initialRouteName="Thunder">
      <Stack.Screen
        name="Thunder"
        component={Channel}
        options={{
          title: '번개',
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}

export default ThunderNavigator;
