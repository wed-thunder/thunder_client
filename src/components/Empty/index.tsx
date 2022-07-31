import React from 'react';
// import { View } from 'react-native';
import styled from 'styled-components/native';

// import IconBuilding from '@/assets/ic_building.svg';
// import IconChat from '@/assets/ic_empty_chat.svg';
// import IconPeople from '@/assets/ic_empty_people.svg';
import { COLOR } from '@/constant/color';

const Container = styled.View`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${COLOR.WHITE};
`;

const Text = styled.Text`
  font-size: 16px;
  line-height: 24px;
  text-align: center;
  color: ${COLOR.GRAY600};
  margin-top: 23px;
`;

interface Props {
  text: string;
  type?: string;
  children?: React.ReactElement;
}

export default function Empty({ text, type = 'building', children }: Props): React.ReactElement {
  const renderIcon = (): React.ReactElement => {
    switch (type) {
      case 'building':
        return <Text>sorry</Text>;
      // return <IconBuilding width={80} height={80} />;
      case 'chat':
        return <Text>sorry</Text>;
      // return <IconChat width={80} height={80} />;
      case 'People':
        return <Text>sorry</Text>;
      // return <IconPeople width={80} height={80} />;
      default:
        return <Text>sorry</Text>;
      // return <View>nope</View>;
    }
  };

  return (
    <Container>
      {renderIcon()}
      <Text>{text}</Text>
      {children}
    </Container>
  );
}
