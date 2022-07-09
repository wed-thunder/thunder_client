import React, { useEffect, useRef, useState } from 'react';
import { Alert, Animated, Keyboard, TextInput, TouchableWithoutFeedback } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styled from 'styled-components/native';

import { getNickNameExists } from '@/apis/services/customer.service';
import { ThunderInputRound } from '@/components/ThunderInput';
import COLOR from '@/constant/color';
import { SignUpNickNameRouteProps } from '@/navigation/types';
import rootStore from '@/stores';

const Container = styled(SafeAreaView)`
  height: 100%;
  width: 100%;
  background-color: ${COLOR.WHITE};
  align-items: center;
`;

const Vertical = styled.View`
  display: flex;
  flex-direction: column;
  flex: 1;
  width: 100%;
  padding: 0 16px;
  margin-top: 60px;
  align-items: center; ;
`;

const Title = styled.Text`
  font-weight: 700;
  font-size: 22px;
  line-height: 30px;
  color: #383940;
  width: 100%;
  text-align: left;
  margin-bottom: 12px;
`;

const Button = styled.TouchableOpacity<{ canClick: boolean }>`
  background-color: ${(props): string => (props.canClick ? COLOR.MBLUE : '#E5E6EA')};
  align-items: center;
  border-radius: 8px;
  width: 100%;
  height: 54px;
  justify-content: center;
  margin-bottom: 16px; ;
`;

const ButtonText = styled.Text`
  font-weight: bold;
  color: ${COLOR.WHITE};
`;

interface Props {
  route: SignUpNickNameRouteProps;
}

function SignUpNickName({ route }: Props): React.ReactElement {
  const { authStore } = rootStore;
  const { provider, accessToken, refreshToken } = route.params;

  const [nickName, setNickName] = useState<string>('');
  const [nickNameButtonEnabled, setNickNameButtonEnabled] = useState<boolean>(false);

  const refInput: React.RefObject<TextInput> = useRef();
  const fadeAnimName = useRef(new Animated.Value(0)).current;
  const fadeInName = (): void => {
    Animated.timing(fadeAnimName, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      refInput.current?.focus();
    });
  };

  useEffect(() => {
    fadeInName();
  });

  // 닉네임 변경
  const handleChangeNickName = async (value: string): Promise<void> => {
    if (value?.length <= 15) {
      setNickName(value);
      setNickNameButtonEnabled(value?.length >= 2);
    }
  };

  // 닉네임 등록
  const signUpNickName = async (): Promise<void> => {
    const { isExist } = await getNickNameExists(nickName);
    if (isExist) {
      Alert.alert('이미 존재하는 닉네임입니다.');
    } else {
      await authStore.setToken(accessToken, refreshToken);
      await authStore.signUpService(accessToken);
      await authStore.updateProfile({ nickname: nickName });
      await authStore.socialConnect(provider);
      await authStore.login();
    }
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <Container>
        <Vertical>
          <Title>{'프리미엄체크 시작하기 !\n닉네임을 입력해주세요.'}</Title>

          <Animated.View style={[{ opacity: fadeAnimName }]}>
            <ThunderInputRound
              textInputRef={refInput}
              labelStyle={{ height: 0 }}
              textInputStyle={{
                fontSize: 16,
                fontWeight: 'bold',
              }}
              textAlign="left"
              placeholder="닉네임"
              editable
              value={nickName}
              forceShow
              onChangeText={handleChangeNickName}
              onSubmitEditing={() => {
                Keyboard.dismiss();
              }}
              returnKeyType="done"
            />
          </Animated.View>
          <Button
            canClick={nickNameButtonEnabled}
            disabled={!nickNameButtonEnabled}
            onPress={signUpNickName}>
            <ButtonText>가입하기</ButtonText>
          </Button>
        </Vertical>
      </Container>
    </TouchableWithoutFeedback>
  );
}

export default SignUpNickName;
