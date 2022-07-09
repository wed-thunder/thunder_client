import { CheckBox as KittenCheckBox } from '@ui-kitten/components';
import React from 'react';
import { View } from 'react-native';
import styled from 'styled-components/native';

import { COLOR } from '@/constant/color';

const Container = styled.TouchableOpacity`
  padding: 14px 0;
`;

const CheckBox = styled(KittenCheckBox)`
  margin-right: 12px;
`;

const CheckBoxTitle = styled.Text`
  font-size: 16px;
  font-weight: bold;
  line-height: 19px;
  align-items: center;
  color: ${COLOR.GRAY500};
`;

const CheckBoxText = styled(CheckBoxTitle)`
  font-size: 15px;
  font-weight: normal;
`;

function CheckBoxGroup({ selectedKeys, setSelectedKeys }): React.ReactElement {
  return (
    <View>
      <Container disabled>
        <CheckBox checked={selectedKeys[0]} onChange={() => setSelectedKeys(0)}>
          <CheckBoxTitle>모두 동의하기</CheckBoxTitle>
        </CheckBox>
      </Container>

      <Container>
        <CheckBox checked={selectedKeys[1]} onChange={() => setSelectedKeys(1)}>
          <CheckBoxText>서비스 이용약관 동의</CheckBoxText>
        </CheckBox>
      </Container>

      <Container>
        <CheckBox checked={selectedKeys[2]} onChange={() => setSelectedKeys(2)}>
          <CheckBoxText>개인정보처리방침 동의</CheckBoxText>
        </CheckBox>
      </Container>

      <Container>
        <CheckBox checked={selectedKeys[3]} onChange={() => setSelectedKeys(3)}>
          <CheckBoxText>마케팅 활용 동의하기(선택)</CheckBoxText>
        </CheckBox>
      </Container>
    </View>
  );
}

export default CheckBoxGroup;
