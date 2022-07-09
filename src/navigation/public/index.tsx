import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import { PublicRootStackParamList } from '../types';

import SignIn from '@/screens/SignIn';
import SignUp from '@/screens/SignUp';
import SignUpNickName from '@/screens/SignUpNickName';

const Stack = createStackNavigator<PublicRootStackParamList>();

function PublicStackNavigator(): React.ReactElement {
  return (
    <Stack.Navigator>
      <Stack.Screen name="SignIn" component={SignIn} options={{ headerShown: false }} />
      <Stack.Screen
        name="SignUp"
        component={SignUp}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="SignUpNickName"
        component={SignUpNickName}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}

export default PublicStackNavigator;
