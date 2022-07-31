import * as Device from 'expo-device';
import React from 'react';
import { SafeAreaView } from 'react-native';
import styled from 'styled-components/native';

import COLOR from '@/constant/color';
// import { PublicNavigationProp } from '@/navigation/types';
import rootStore from '@/stores';

const Container = styled(SafeAreaView)`
  height: 100%;
  background-color: ${COLOR.MBLUE};
  align-items: center;
`;

const Vertical = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const LogoTitle = styled.Text`
  font-size: 35px;
  font-weight: bold;
  color: ${COLOR.GRAY50};
`;

const LogoText = styled.Text`
  margin-top: 20px;
  font-size: 16px;
  line-height: 24px;
  color: ${COLOR.GRAY50};
`;

const KakaoButton = styled.TouchableOpacity`
  display: flex;
  flex-direction: row;
  background: #fee500;
  border-radius: 6px;
  margin-bottom: 12px;
  justify-content: center;
  padding: 15px 0;
  width: 295px;
`;

const AppleButton = styled.TouchableOpacity`
  display: flex;
  flex-direction: row;
  background: #ffffff;
  border-radius: 6px;
  margin-bottom: 12px;
  justify-content: center;
  padding: 15px 0;
  width: 295px;
`;

const AuthText = styled.Text`
  font-style: normal;
  font-weight: bold;
  font-size: 15px;
  line-height: 19px;
  text-align: center;
  color: #000000;
`;

// interface Props {
//   navigation: PublicNavigationProp;
// }

function SignIn(): React.ReactElement {
  const { authStore } = rootStore;

  // const onClickLogin = async

  const onClickSocialStart = async (type: string): Promise<void> => {
    const result = type === 'kakao' ? await authStore.login() : await authStore.login();
    console.log(result);
    // if (!result) {
    //   Alert.alert(`${type} 계정 연동이 원활하지 않습니다. 잠시후 다시 시도해 주세요.`);
    // }

    // if (result.isLogin) {
    //   // 해당 소셜 토큰이 있고 프리미엄 체크 아이디가 있는경우
    //   return;
    // }

    // if (result.accessToken) {
    //   // 소셜 토큰이 연결되어 있지만, 프리미엄 체크는 없는 경우
    //   Alert.alert('Thunder 통합 알림', 'Thunder 통합아이디가 있습니다.', [
    //     {
    //       text: '취소',
    //       style: 'cancel',
    //     },
    //     {
    //       text: '확인',
    //       onPress: async (): Promise<void> => {
    //         navigation.navigate('SignUpNickName', {
    //           provider: type,
    //           accessToken: result.accessToken,
    //           refreshToken: result.refreshToken,
    //         });
    //       },
    //       style: 'default',
    //     },
    //   ]);
    // } else {
    //   navigation.navigate('SignUp', { provider: type });
    // }
  };

  return (
    <Container>
      <Vertical>
        {/* <Logo /> */}
        <LogoTitle>썬더</LogoTitle>
        <LogoText>번개모임을 더 간편하게</LogoText>
      </Vertical>
      <KakaoButton onPress={(): Promise<void> => onClickSocialStart('kakao')}>
        <AuthText>카카오톡으로 시작하기</AuthText>
      </KakaoButton>
      {(Device.osName === 'iOS' || Device.osName === 'iPadOS') && (
        <AppleButton onPress={(): Promise<void> => onClickSocialStart('apple')}>
          <AuthText>Apple로 시작하기</AuthText>
        </AppleButton>
      )}
    </Container>
  );
}

export default SignIn;
