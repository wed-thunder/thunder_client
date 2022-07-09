import React, { useState } from 'react';
import Modal from 'react-native-modal';
import { SafeAreaView } from 'react-native-safe-area-context';
import styled from 'styled-components/native';

import CheckBoxGroup from '@/components/CheckBoxSignupGroup';
import { H4 } from '@/components/Text';
import { COLOR } from '@/constant/color';

const Container = styled(SafeAreaView)`
  display: flex;
  flex-direction: column;
  padding: 29px 29px 21px;
  background: ${COLOR.WHITE};
  box-shadow: 0px -4px 10px rgba(0, 0, 0, 0.1);
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
`;

const Button = styled.TouchableOpacity<{ canClick: boolean }>`
  background-color: ${(props) => (props.canClick ? COLOR.MBLUE : '#E5E6EA')};
  align-items: center;
  border-radius: 8px;
  width: 343px;
  height: 54px;
  justify-content: center;
`;

const ButtonText = styled(H4)`
  color: ${COLOR.WHITE};
  font-weight: bold;
`;

const Text = styled.Text`
  font-size: 12px;
  line-height: 16px;
  align-items: center;
  text-align: center;
  color: #8c8f98;
  margin-top: 24px;
  margin-bottom: 36px;
`;

interface Props {
  visible: boolean;
  setVisible: (value: boolean) => void;
  handleSignUp: (value: boolean) => Promise<void>;
}

function SignUpConfirmModal({ visible, setVisible, handleSignUp }: Props): React.ReactElement {
  const closeModal = (): void => setVisible(false);
  const [checkList, setCheckList] = useState([false, false, false, false]);

  const handleCheckList = (index: number): any => {
    if (index === 0) {
      if (checkList[0]) {
        setCheckList([false, false, false, false]);
      } else {
        setCheckList([true, true, true, true]);
      }
    } else {
      setCheckList((checks) =>
        checks.map((v, i) => {
          if (i !== 0) {
            return i === index ? !v : v;
          }
          return false;
        }),
      );
    }
  };

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
        <CheckBoxGroup selectedKeys={checkList} setSelectedKeys={handleCheckList} />
        <Text>다양한 혜택과 새 기능을 놓치지 않게 알려드릴게요 ! ☺️</Text>
        <Button
          onPress={() => handleSignUp(checkList[3])}
          canClick={checkList[1] && checkList[2]}
          disabled={!(checkList[1] && checkList[2])}>
          <ButtonText>동의하고 시작하기</ButtonText>
        </Button>
      </Container>
    </Modal>
  );
}

export default SignUpConfirmModal;
