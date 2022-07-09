import React from 'react';
import Modal from 'react-native-modal';
import { SafeAreaView } from 'react-native-safe-area-context';
import styled from 'styled-components/native';

import { H4 } from '@/components/Text';
import { COLOR } from '@/constant/color';

const Container = styled(SafeAreaView)`
  display: flex;
  flex-direction: column;
  padding: 30px 24px;
  background: ${COLOR.WHITE};
  box-shadow: 0px -4px 10px rgba(0, 0, 0, 0.1);
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
`;

const Button = styled.TouchableOpacity`
  background-color: ${COLOR.MBLUE};
  align-items: center;
  border-radius: 8px;
  height: 54px;
  justify-content: center;
`;

const ButtonText = styled(H4)`
  color: ${COLOR.WHITE};
  font-weight: bold;
`;

const Title = styled.Text`
  font-weight: bold;
  font-size: 18px;
  line-height: 22px;
  color: #2c2c2c;
  margin-bottom: 16px;
`;

const Text = styled.Text`
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 20px;
  color: #676975;
  margin-bottom: 28px;
`;

interface Props {
  visible: boolean;
  setVisible: (value: boolean) => void;
}

function InfoModal({ visible, setVisible }: Props): React.ReactElement {
  const closeModal = (): void => setVisible(false);

  return (
    <Modal
      isVisible={visible}
      hasBackdrop
      backdropOpacity={0.6}
      onBackButtonPress={closeModal}
      onBackdropPress={closeModal}
      onSwipeComplete={closeModal}
      swipeDirection="down"
      style={{ justifyContent: 'flex-end', margin: 0 }}>
      <Container>
        <Title>인증번호가 안 온다면?</Title>
        <Text>
          {
            '휴대폰 기기 설정이나 스팸 차단 앱에서\n전화번호 1833 - 4545의 수신이 차단되어 있는지\n확인한 후 해제해주세요 !'
          }
        </Text>
        <Button onPress={closeModal}>
          <ButtonText>확인</ButtonText>
        </Button>
      </Container>
    </Modal>
  );
}

export default InfoModal;
