import { useActionSheet } from '@expo/react-native-action-sheet';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Alert, Platform } from 'react-native';
import styled from 'styled-components/native';

import IconEmpty from '@/assets/ic_empty.svg';
import COLOR from '@/constant/color';
import { IChannel } from '@/models/Channel';
import { RootNavigationProp } from '@/navigation/types';
import rootStore from '@/stores';

const ChannelSwipeoutContainer = styled.View`
  padding: 0px 16px;
  background-color: #fff;
`;

const ChannelContainer = styled.TouchableOpacity`
  flex-direction: row;
  padding: 14px 0px;
  align-items: center;
`;

const ChannelProfileImageContainer = styled.View`
  width: 50px;
  height: 50px;
  border-radius: 25px;
  border: 0.5px solid #8c8f98;
  overflow: hidden;
`;

const ChannelProfileImage = styled.Image`
  width: 50px;
  height: 50px;
`;

const ChannelDivider = styled.View`
  background-color: ${COLOR.GRAY50};
  height: 1px;
  padding: 0px 16px;
`;

const ChannelTextContainer = styled.View`
  flex: 1;
  margin-left: 10px;
`;

const ChannelUnreadContainer = styled.View`
  width: 26px;
  justify-content: center;
`;

const ChannelUnreadView = styled.View`
  width: 32px;
  height: 32px;
  border-radius: 20px;
  background-color: ${COLOR.BLUE700};
  justify-content: center;
  align-items: center;
`;

const ChannelUnreadText = styled.Text`
  font-weight: 600;
  font-size: 14px;
  color: ${COLOR.WHITE};
`;

const TitleContainer = styled.View`
  flex-direction: row;
`;

const MemberText = styled.Text`
  color: ${COLOR.GRAY900};
  font-weight: 700;
  font-size: 15px;
  line-height: 20px;
  margin-right: 8px;
`;

const TimeDiffText = styled.Text`
  color: ${COLOR.GRAY500};
  font-size: 13px;
  line-height: 20px;
`;

const TitleText = styled.Text`
  color: ${COLOR.GRAY500};
  font-size: 14px;
  line-height: 20px;
`;

const LastMessageText = styled.Text`
  color: ${COLOR.GRAY900};
  font-size: 15px;
  line-height: 19px;
`;

const SwipeContainer = styled.View`
  flex: 1;
  align-items: flex-end;
`;

const SwipeButton = styled.TouchableOpacity`
  flex: 1;
  width: 75px;
  background-color: ${COLOR.RED};
  align-items: center;
  justify-content: center;
`;

const SwipeButtonText = styled.Text`
  font-weight: 700;
  font-size: 15px;
  color: ${COLOR.WHITE};
`;

interface Props {
  channelData: IChannel;
}

export function ChannelItem({ channelData }: Props): React.ReactElement {
  const { channelStore } = rootStore.sendbirdStore;
  const navigation = useNavigation<RootNavigationProp>();

  const enterGroupChannel = (): void => {
    navigation.navigate('Chat', {
      channelTitle: channelData.title,
      channelUrl: channelData.url,
    });
  };

  // 채널 관리 창
  const { showActionSheetWithOptions } = useActionSheet();
  const openActionSheet = (): void => {
    if (Platform.OS === 'android') {
      const options = ['나가기', '닫기'];

      const destructiveButtonIndex = 0;
      const cancelButtonIndex = options.length - 1;

      showActionSheetWithOptions(
        {
          options,
          cancelButtonIndex,
          destructiveButtonIndex,
        },
        (buttonIndex) => {
          switch (buttonIndex) {
            case 0:
              Alert.alert(
                '채팅방 나가기',
                '나가기를 하면 대화내용이 모두 삭제되고 채팅목록에서도 삭제됩니다.',
                [
                  {
                    text: '취소',
                    style: 'cancel',
                  },
                  {
                    text: '나가기',
                    onPress: () => {
                      channelStore.sbLeaveGroupChannel(channelData.url);
                    },
                  },
                ],
              );
              break;
            default:
          }
        },
      );
    }
  };

  return (
    <ChannelSwipeoutContainer key={channelData.url}>
      <ChannelContainer onLongPress={openActionSheet} onPress={enterGroupChannel}>
        {channelData.profileUrl ? (
          <ChannelProfileImageContainer>
            <ChannelProfileImage
              source={{
                uri: channelData.profileUrl,
              }}
            />
          </ChannelProfileImageContainer>
        ) : (
          <IconEmpty width={50} height={50} />
        )}

        <ChannelTextContainer>
          <TitleContainer>
            <MemberText>{channelData.title}</MemberText>

            <TimeDiffText>{channelData.timeDiffString}</TimeDiffText>
          </TitleContainer>

          <TitleText numberOfLines={1}>{channelData.name}</TitleText>

          <LastMessageText numberOfLines={1}>{channelData.lastMessage?.message}</LastMessageText>
        </ChannelTextContainer>

        <ChannelUnreadContainer>
          {channelData.unreadMessageCount > 0 && (
            <ChannelUnreadView>
              <ChannelUnreadText>{channelData.unreadMessageCount}</ChannelUnreadText>
            </ChannelUnreadView>
          )}
        </ChannelUnreadContainer>
      </ChannelContainer>

      <ChannelDivider />
    </ChannelSwipeoutContainer>
  );
}

export function ChannelHiddenItem({ channelData }: Props): React.ReactElement {
  const { channelStore } = rootStore.sendbirdStore;
  const leaveChannel = (): void => {
    channelStore.sbLeaveGroupChannel(channelData.url);
  };

  return (
    <SwipeContainer>
      <SwipeButton onPress={leaveChannel}>
        <SwipeButtonText>나가기</SwipeButtonText>
      </SwipeButton>
    </SwipeContainer>
  );
}
