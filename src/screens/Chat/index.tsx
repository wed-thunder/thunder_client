import React from 'react';
import styled from 'styled-components/native';

import COLOR from '@/constant/color';
import { ChatScreenProps } from '@/navigation/types';

const Text = styled.Text`
  font-size: 16px;
  line-height: 24px;
  text-align: center;
  color: ${COLOR.GRAY600};
  margin-top: 23px;
`;

function ChatScreen({ navigation, route }: ChatScreenProps): React.ReactElement {
  console.log(route);
  return <Text>{navigation}</Text>;
}

export default ChatScreen;
