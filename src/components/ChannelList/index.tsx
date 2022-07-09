import { observer } from 'mobx-react';
import React from 'react';
import { Platform } from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';

import { ChannelHiddenItem, ChannelItem } from './Item';

import Empty from '../Empty';

import rootStore from '@/stores';

function ChannelList(): React.ReactElement {
  const { channelStore } = rootStore.sendbirdStore;

  const isIos = Platform.OS === 'ios';

  const renderItem = (rowData): React.ReactElement => {
    return <ChannelItem channelData={rowData.item} />;
  };

  const renderHiddenItem = (rowData): React.ReactElement => {
    return <ChannelHiddenItem channelData={rowData.item} />;
  };

  if (channelStore?.channelList?.length === 0) {
    return <Empty type="chat" text="채팅 내역이 없습니다." />;
  }

  return (
    <SwipeListView
      data={channelStore?.channelList?.slice()}
      renderItem={renderItem}
      renderHiddenItem={renderHiddenItem}
      disableRightSwipe
      disableLeftSwipe={!isIos}
      rightOpenValue={isIos ? -75 : undefined}
      stopRightSwipe={isIos ? -75 : undefined}
      closeOnRowOpen={false}
      keyExtractor={(item) => item.url}
    />
  );
}

export default observer(ChannelList);
