import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import BottomTabNavigator from './BottomTabNavigator';

import { PrivateRootStackParamList } from '../types';

// const defaultHeaderOptions: StackNavigationOptions = {
//   headerShadowVisible: false,
//   headerBackTitleVisible: false,
//   headerTintColor: COLOR.GRAY900,
//   headerTitleStyle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
//   headerTitleAlign: 'center',
//   headerBackImage: () => <IconBack style={{ marginLeft: 15 }} width={24} height={24} />,
// };

const Stack = createStackNavigator<PrivateRootStackParamList>();

function PrivateStackNavigator(): React.ReactElement {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="BottomTab"
        component={BottomTabNavigator}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

export default PrivateStackNavigator;
