import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import { SettingsParamList } from '@/navigation/types';
import Channel from '@/screens/Channel';

const Stack = createStackNavigator<SettingsParamList>();
function SettingsNavigator(): React.ReactElement {
  return (
    <Stack.Navigator initialRouteName="Settings">
      <Stack.Screen
        name="Settings"
        component={Channel}
        options={{
          title: '설정',
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}

export default SettingsNavigator;
