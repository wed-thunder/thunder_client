import React from 'react';
import styled from 'styled-components/native';

import ChannelList from '@/components/ChannelList';

const Container = styled.SafeAreaView`
  flex: 1;
  background-color: #fff;
`;

function ChannelScreen(): React.ReactElement {
  return (
    <Container>
      <ChannelList />
    </Container>
  );
}
export default ChannelScreen;
