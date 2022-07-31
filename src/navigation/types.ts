// import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import {
  // CompositeNavigationProp,
  NavigatorScreenParams,
  RouteProp,
  // RouteProp,
} from '@react-navigation/native';
import { StackScreenProps, StackNavigationProp } from '@react-navigation/stack';

// import { User } from '@/models';

/**
 * Public Stack
 */
export type PublicRootStackParamList = {
  SignIn: undefined;
  SignUp: { provider: string };
  SignUpNickName: {
    provider?: string;
    accessToken?: string;
    refreshToken?: string;
  };
};

export type PublicNavigationProp = StackNavigationProp<PublicRootStackParamList>;

export type SignUpScreenProp = StackScreenProps<PublicRootStackParamList, 'SignUp'>;

export type SignUpNickNameRouteProps = RouteProp<PublicRootStackParamList, 'SignUpNickName'>;

/**
 * private Stack
 */
export type PrivateRootStackParamList = {
  BottomTab: NavigatorScreenParams<BottomTabParamList>;
  Chat: {
    channelTitle?: string;
    channelUrl?: string;
    sendbirdId?: string[];
    channelData?: string;
  };
};

export type ChatScreenProps = StackScreenProps<PrivateRootStackParamList, 'Chat'>;

export type RootNavigationProp = StackNavigationProp<PrivateRootStackParamList>;

/**
 * Bottom Tab
 */
export type BottomTabParamList = {
  FriendNavigator: undefined;
  ChatNavigator: undefined;
  ThunderNavigator: undefined;
  NoticeNavigator: undefined;
  SettingsNavigator: undefined;
};

export type RightButtonParamList = {
  move: undefined;
};

export type BottomNavigationProp = StackNavigationProp<BottomTabParamList>;

export type RightButtonNavigationProp = StackNavigationProp<RightButtonParamList>;

/**
 * Chat Tab
 */
export type ChatParamList = {
  Channel: undefined;
  Chat: undefined;
};

/**
 * Friend Tab
 */
export type FriendParamList = {
  Friend: undefined;
};

/**
 * Thunder Tab
 */
export type ThunderParamList = {
  Thunder: undefined;
};

/**
 * Notice Tab
 */

export type NoticeParamList = {
  Notice: undefined;
};

/**
 * Settings Tab
 */
export type SettingsParamList = {
  Settings: undefined;
};
