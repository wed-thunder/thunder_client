/* eslint-disable react/no-this-in-sfc */
import _ from 'lodash';
import { runInAction } from 'mobx';
import { observer, useLocalObservable } from 'mobx-react';
import moment from 'moment';
import React, { useRef, useState } from 'react';
import {
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  Keyboard,
  TextInput,
  Alert,
  Animated,
} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import * as Sentry from 'sentry-expo';
import styled from 'styled-components/native';

import InfoModal from './InfoModal';
import SignUpConfirmModal from './SignUpConfirmModal';

import { isNetworkError } from '@/apis';
// import { getNickNameExists } from '@/apis/services/customer.service';
// import CloseIcon from '@/assets/ic_close_circle.svg';
// import DotIcon from '@/assets/ic_dot.svg';
import { ThunderInputRound } from '@/components/ThunderInput';
import COLOR from '@/constant/color';
import rootStore from '@/stores';
import { cleanPhoneNumber } from '@/utils';

const Container = styled.SafeAreaView`
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
`;

const HorizontalView = styled.View`
  display: flex;
  flex-direction: row;
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
  width: 343px;
  height: 54px;
  justify-content: center;
  margin-bottom: 16px; ;
`;

const ButtonText = styled.Text`
  font-weight: bold;
  color: ${COLOR.WHITE};
`;

const AuthText = styled.Text`
  font-size: 14px;
  line-height: 20px;
  color: #8c8f98;
`;

const TimerText = styled.Text`
  font-weight: bold;
  font-size: 16px;
  line-height: 20px;
  position: absolute;
  color: #376dcc;
  top: 24px;
  right: 16px;
`;

const ButtonGroup = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: 6px;
`;

const CloseButton = styled.TouchableOpacity`
  position: absolute;
  right: 16px;
  top: 60px;
`;

const RetryButton = styled.TouchableOpacity`
  justify-content: center;
  align-items: center;
  padding: 6px 12px;
  width: 120px;
  background: #ecf3ff;
  border-radius: 4px;
`;

const RetryText = styled.Text`
  font-size: 14px;
  line-height: 20px;
  align-items: center;
  text-align: center;
  color: #477fe0;
`;

enum STEP {
  PHONE = 0,
  AUTH = 1,
  NICK_NAME = 2,
  SIGN = 3,
}

// enum STEP {
//   PHONE = 0,
//   AUTH = 1,
//   NICK_NAME = 2,
//   SIGN = 3,
// }

type TimeoutId = ReturnType<typeof setInterval>;

function SignUp({ navigation }): React.ReactElement {
  // const { provider } = route.params;
  const { authStore } = rootStore;

  // const fadeAnim = Array(4).fill(useRef(new Animated.Value(0)).current);
  // const refInput = Array(4).fill(useRef(null));

  // const fadeInAnim = (stepIndex: STEP): void => {
  //   setStep(stepIndex);
  //   Animated.timing(fadeAnim[stepIndex], {
  //     toValue: 1,
  //     duration: 500,
  //     useNativeDriver: true,
  //   }).start(() => {
  //     refInput[stepIndex].current?.focus();
  //   });
  // };

  const refInput: Array<React.RefObject<TextInput>> = [];
  refInput[0] = useRef(null);
  refInput[1] = useRef(null);
  refInput[2] = useRef(null);
  refInput[3] = useRef(null);

  const [infoModalVisible, setInfoModalVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [token, setToken] = useState<string>();
  const [step, setStep] = useState(STEP.PHONE);
  const fadeAnimAuth = useRef(new Animated.Value(0)).current;
  const fadeAnimName = useRef(new Animated.Value(0)).current;
  const fadeAnimBirth = useRef(new Animated.Value(0)).current;

  const fadeInAuth = (): void => {
    setStep(STEP.AUTH);
    Animated.timing(fadeAnimAuth, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      refInput[0].current?.focus();
    });
  };

  const fadeInName = (): void => {
    setStep(STEP.NICK_NAME);
    Animated.timing(fadeAnimName, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      refInput[1].current?.focus();
    });
  };
  // const fadeInBirth = (): void => {
  //   setStep(STEP.SIGN);
  //   Animated.timing(fadeAnimBirth, {
  //     toValue: 1,
  //     duration: 500,
  //     useNativeDriver: true,
  //   }).start(() => {
  //     refInput[2].current?.focus();
  //   });
  // };

  const signIn = useLocalObservable(() => ({
    authBtnText: '',
    expiredTime: null,
    reserveTime: null,
    phone: '',
    code: '',
    password: '',
    name: '',
    birthDay: '',
    gender: '',
    codeError: '',
    isAuthButtonEnabled: false,
    isCodeButtonEnabled: false,
    isNickNameButtonEnabled: false,
    isBirthButtonEnabled: false,
    isAuthInputWaiting: false,
    isAuthLoading: false,
    isSignInLoading: false,
    timeoutId: null as TimeoutId,

    setSignInLoading(value: boolean) {
      this.isSignInLoading = value;
    },

    startTimer() {
      this.isAuthLoading = false;
      this.isAuthInputWaiting = true;
      this.isSignInLoading = false;
      this.authBtnText = '인증번호 재요청';

      this.timeoutId = setInterval(() => {
        this.decreseTimer();
      }, 1000);
    },

    clearTimer() {
      if (this.timeoutId !== null) {
        clearInterval(this.timeoutId);
        this.timeoutId = null;
        this.isAuthInputWaiting = false;
        this.authBtnText = '';
      }
    },

    decreseTimer() {
      if (this.expiredTime === null) {
        this.expiredTime = new Date().getTime() + 1000 * 60 * 2;
      }
      this.reserveTime = _.floor((this.expiredTime - new Date().getTime()) / 1000);

      if (this.reserveTime === 0) {
        clearInterval(this.timeoutId);
        this.timeoutId = null;
        this.authBtnText = '인증번호 재요청';
        this.isAuthInputWaiting = false;
        this.isAuthButtonEnabled = true;
        this.isSignInLoading = false;
        this.isCodeButtonEnabled = false;
        this.expiredTime = null;
        this.reserveTime = null;
        this.codeError = '';
      }
    },
  }));

  // 전화번호 변경
  const handleChangePhone = (value: string): void => {
    const regPhone = /^((01[1|6|7|8|9])[1-9]+[0-9]{6,7})|(010[1-9][0-9]{7})$/;
    runInAction(() => {
      signIn.phone = value
        .replace(/[^0-9]/g, '')
        .replace(/^(\d{2,3})(\d{3,4})(\d{4})$/, '$1-$2-$3');
      const phoneNumber = cleanPhoneNumber(signIn.phone);
      if (signIn.phone.length === 13) {
        Keyboard.dismiss();
      }
      if (regPhone.test(phoneNumber)) {
        signIn.isAuthButtonEnabled = true;
      } else {
        signIn.isAuthButtonEnabled = false;
      }
    });
  };

  // 인증번호 요청
  const handleRequestAuthCode = async (): Promise<void> => {
    const cleanPhone: string = cleanPhoneNumber(signIn.phone);
    runInAction(async () => {
      signIn.isAuthButtonEnabled = false;
      signIn.isAuthInputWaiting = true;
      signIn.isSignInLoading = true;
      signIn.code = '';

      try {
        signIn.isAuthLoading = true;
        const data: boolean = await authStore.getAuthCode(cleanPhone);

        if (data) {
          fadeInAuth();
          signIn.startTimer();
        } else {
          Alert.alert('네트워크 연결이 원할하지 않습니다. 잠시 후 다시 시도해주세요.');
        }
      } catch (err) {
        console.log('authenticated phone ', err.response.data);
        if (isNetworkError(err)) {
          signIn.isAuthButtonEnabled = true;
          Alert.alert('네트워크 연결이 원할하지 않습니다. 잠시 후 다시 시도해주세요.');
        } else {
          Alert.alert('전화번호를 확인 후 다시 시도해 주세요.');
        }
        signIn.isAuthLoading = false;
        signIn.isAuthInputWaiting = false;
        signIn.isSignInLoading = false;
      }
    });
  };

  // 인증번호 확인
  const handleConfirmAuthCode = async (): Promise<void> => {
    const cleanPhone: string = cleanPhoneNumber(signIn.phone);
    if (signIn.code && signIn.code.length === 6) {
      signIn.setSignInLoading(true);
      Keyboard.dismiss();

      try {
        const result = await authStore.confirmAuthCode(cleanPhone, signIn.code);

        if (result) {
          // 해당 번호로 Customer가 있는 경우
          if (result.accessToken) {
            Alert.alert('Thunder 통합 알림', 'Thunder 통합아이디가 있습니다.', [
              {
                text: '취소',
                style: 'cancel',
              },
              {
                text: '확인',
                onPress: async (): Promise<void> => {
                  const service = result.accessToken?.services.find((x) => x.service === 'p-check');
                  if (service) {
                    // 프리미엄 체크가 가입되어 있는경우
                    await authStore.setToken(result.accessToken, result.refreshToken);
                    // await authStore.socialConnect(provider);
                    await authStore.login();
                  } else {
                    // 프리미엄 체크가 가입이 안되어 있는경우
                    navigation.navigate('SignUpNickName', {
                      // provider,
                      accessToken: result.accessToken,
                      refreshToken: result.refreshToken,
                    });
                  }
                },
                style: 'default',
              },
            ]);
          }

          setToken(result?.accessToken);
          signIn.clearTimer();

          // if (!result.profile) {
          if (!result.accessToken) {
            fadeInName();
          }
        }
      } catch (error) {
        if (error.response?.data?.code === 'AUTH_OAUTH_001') {
          Alert.alert('이미 다른 아이디와 연결된 SNS계정입니다.');
        } else {
          Alert.alert('인증번호를 확인 후 다시 시도해 주세요.');
          Sentry.Native.captureException(error);
        }
      }
    }

    signIn.setSignInLoading(false);
  };

  // 닉네임 변경
  const handleChangeNickName = async (value: string): Promise<void> => {
    runInAction(() => {
      if (value?.length <= 15) {
        signIn.name = value;
        signIn.isNickNameButtonEnabled = value?.length >= 2;
      }
    });
  };

  // 인증번호 변경
  const handleChangeCode = (value: string): void => {
    const regNumber = /[0-9]{6}$/;
    runInAction(() => {
      if (signIn.code.length === 5) {
        Keyboard.dismiss();
      }

      signIn.code = value;

      signIn.isCodeButtonEnabled = regNumber.test(value);
    });
  };

  // 생일변경
  const handleChangeBirthDay = (value: string): void => {
    const regNumber = /([0-9]{2}(0[1-9]|1[0-2])(0[1-9]|[1,2][0-9]|3[0,1]))/;

    runInAction(() => {
      signIn.birthDay = value.length > 6 ? signIn.birthDay : value;

      if (signIn.birthDay.length === 5 && regNumber.test(value)) {
        refInput[3].current?.focus();
      }

      signIn.isBirthButtonEnabled = regNumber.test(value) && signIn.gender.length === 1;
    });
  };

  // 성별 변경
  const handleChangeGender = (value: string): void => {
    const regNumber = /[1-4]$/;
    const regBirth = /([0-9]{2}(0[1-9]|1[0-2])(0[1-9]|[1,2][0-9]|3[0,1]))/;
    runInAction(() => {
      signIn.gender = value.length > 1 ? signIn.gender : value;
      if (
        signIn.gender.length === 1 &&
        regNumber.test(signIn.gender) &&
        regBirth.test(signIn.birthDay)
      ) {
        signIn.isBirthButtonEnabled = true;
        Keyboard.dismiss();
      } else {
        signIn.isBirthButtonEnabled = false;
      }
    });
  };

  const TimerLabel = observer(() => {
    if (!signIn.isAuthInputWaiting) {
      return null;
    }
    return <TimerText>{moment.utc(signIn.reserveTime * 1000).format('mm:ss')}</TimerText>;
  });

  // 회원가입
  const handleSignUp = async (): Promise<void> => {
    const phoneNumber: string = cleanPhoneNumber(signIn.phone);

    if (phoneNumber && signIn.name && signIn.code && token) {
      try {
        const result = await authStore.signUp(
          signIn.name,
          signIn.password,
          // convertBirthDate(signIn.birthDay, signIn.gender),
          // signIn.gender === '1' || signIn.gender === '3' ? 'male' : 'female',
          signIn.code,
          token,
        );
        if (result) {
          Alert.alert('회원 가입', '회원 가입을 축하드립니다.', [
            {
              text: '확인',
              onPress: async (): Promise<void> => {
                await authStore.setToken(result.accessToken, result.refreshToken);
                // await authStore.socialConnect(provider);
                await authStore.login();
              },
              style: 'default',
            },
          ]);
        } else {
          Alert.alert('다시 시도해 주세요.');
        }
      } catch (err) {
        Alert.alert('회원가입에 실패하였습니다.');
      }
    }
  };

  const renderTitle = (): React.ReactElement => {
    switch (step) {
      case STEP.PHONE:
        return <Title>{'프리미엄체크 시작하기 !\n휴대폰 번호를 입력해주세요.'}</Title>;
      case STEP.AUTH:
        return <Title>인증번호를 입력해주세요.</Title>;
      case STEP.NICK_NAME:
        return <Title>닉네임을 입력해주세요.</Title>;
      case STEP.SIGN:
        return <Title>주민등록번호를 입력해주세요.</Title>;
      default:
        return <Title />;
    }
  };

  const renderButton = (): React.ReactElement => {
    switch (step) {
      case STEP.PHONE:
        return (
          <Button
            canClick={signIn.isAuthButtonEnabled}
            disabled={!signIn.isAuthButtonEnabled}
            onPress={handleRequestAuthCode}>
            <ButtonText>{signIn.isAuthButtonEnabled ? '인증번호 요청' : '확인'}</ButtonText>
          </Button>
        );
      case STEP.AUTH:
        return (
          <Button
            canClick={signIn.isCodeButtonEnabled}
            disabled={!signIn.isCodeButtonEnabled}
            onPress={handleConfirmAuthCode}>
            <ButtonText>확인하기</ButtonText>
          </Button>
        );
      case STEP.NICK_NAME:
        return (
          <Button
            canClick={signIn.isNickNameButtonEnabled}
            disabled={!signIn.isNickNameButtonEnabled}
            onPress={() => {
              console.log('wow');
            }}>
            <ButtonText>다음</ButtonText>
          </Button>
        );
      case STEP.SIGN:
        return (
          <Button
            canClick={signIn.isBirthButtonEnabled}
            disabled={!signIn.isBirthButtonEnabled}
            onPress={handleSignUp}>
            <ButtonText>확인</ButtonText>
          </Button>
        );
      default:
        return <Button canClick={false} />;
    }
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <Container>
        <Spinner visible={signIn.isSignInLoading} />

        <Vertical>
          {renderTitle()}
          {step > STEP.NICK_NAME && (
            <Animated.View style={[{ opacity: fadeAnimBirth }]}>
              <HorizontalView>
                <HorizontalView style={{ marginRight: 12 }}>
                  <ThunderInputRound
                    textInputRef={refInput[2]}
                    containerStyle={{ width: 165 }}
                    labelStyle={{ height: 0 }}
                    textInputStyle={{
                      fontSize: 16,
                      fontWeight: 'bold',
                    }}
                    textAlign="left"
                    placeholder="생년월일"
                    keyboardType="number-pad"
                    value={signIn.birthDay}
                    forceShow
                    onChangeText={handleChangeBirthDay}
                  />
                </HorizontalView>
                <HorizontalView style={{ alignItems: 'center' }}>
                  <ThunderInputRound
                    textInputRef={refInput[3]}
                    containerStyle={{ width: 42, marginRight: 21 }}
                    labelStyle={{ height: 0 }}
                    textInputStyle={{
                      fontSize: 16,
                      fontWeight: 'bold',
                    }}
                    textAlign="center"
                    placeholder="-"
                    keyboardType="number-pad"
                    clearButtonMode="never"
                    value={signIn.gender}
                    forceShow
                    onChangeText={handleChangeGender}
                  />
                  {/* <View style={{ marginRight: 8 }}>
                    <DotIcon width={7} height={7} />
                  </View>
                  <View style={{ marginRight: 8 }}>
                    <DotIcon width={7} height={7} />
                  </View>
                  <View style={{ marginRight: 8 }}>
                    <DotIcon width={7} height={7} />
                  </View>
                  <View style={{ marginRight: 8 }}>
                    <DotIcon width={7} height={7} />
                  </View>
                  <View style={{ marginRight: 8 }}>
                    <DotIcon width={7} height={7} />
                  </View>
                  <View style={{ marginRight: 8 }}>
                    <DotIcon width={7} height={7} />
                  </View> */}
                </HorizontalView>
              </HorizontalView>
            </Animated.View>
          )}

          {step > STEP.AUTH && (
            <Animated.View style={[{ opacity: fadeAnimName }]}>
              <ThunderInputRound
                textInputRef={refInput[1]}
                labelStyle={{ height: 0 }}
                textInputStyle={{
                  fontSize: 16,
                  fontWeight: 'bold',
                }}
                textAlign="left"
                placeholder="닉네임"
                editable={step === STEP.NICK_NAME}
                value={signIn.name}
                forceShow
                onChangeText={handleChangeNickName}
                onSubmitEditing={() => {
                  Keyboard.dismiss();
                }}
                returnKeyType="done"
              />
            </Animated.View>
          )}

          {step > STEP.PHONE && (
            <Animated.View style={[{ opacity: fadeAnimAuth }]}>
              <View>
                <ThunderInputRound
                  textInputRef={refInput[0]}
                  labelStyle={{ height: 0 }}
                  textInputStyle={{
                    fontSize: 16,
                    fontWeight: 'bold',
                  }}
                  keyboardType="number-pad"
                  clearButtonMode="never"
                  textAlign="left"
                  placeholder="인증번호"
                  editable={step === STEP.AUTH}
                  value={signIn.code}
                  forceShow
                  onChangeText={handleChangeCode}
                />
                <TimerLabel />
              </View>
            </Animated.View>
          )}

          <ThunderInputRound
            labelStyle={{ height: 0 }}
            textInputStyle={{
              fontSize: 16,
              fontWeight: 'bold',
            }}
            keyboardType="phone-pad"
            textAlign="left"
            placeholder="휴대폰 번호"
            editable={step === STEP.PHONE}
            value={signIn.phone}
            forceShow
            onChangeText={handleChangePhone}
          />
          {signIn.authBtnText ? (
            <ButtonGroup>
              <TouchableOpacity
                onPress={() => setInfoModalVisible(true)}
                style={{
                  borderBottomWidth: 0.5,
                  borderBottomColor: '#8c8f98',
                }}>
                <AuthText>인증번호가 안 온다면?</AuthText>
              </TouchableOpacity>

              <RetryButton onPress={handleRequestAuthCode}>
                <RetryText>인증번호 재요청</RetryText>
              </RetryButton>
            </ButtonGroup>
          ) : null}
        </Vertical>

        <CloseButton
          onPress={() =>
            Alert.alert(
              '',
              '지금 종료할 경우 처음부터 다시 시작하셔야 해요 ~ 😳',
              [
                {
                  text: '다음에 하기',
                  // onPress: () => navigation.goBack(),
                  style: 'cancel',
                },
                {
                  text: '계속하기',
                },
              ],
              { cancelable: false },
            )
          }>
          {/* <CloseIcon width={24} height={24} /> */}
        </CloseButton>

        {renderButton()}

        <SignUpConfirmModal
          visible={modalVisible}
          setVisible={setModalVisible}
          handleSignUp={handleSignUp}
        />

        <InfoModal visible={infoModalVisible} setVisible={setInfoModalVisible} />
      </Container>
    </TouchableWithoutFeedback>
  );
}

export default observer(SignUp);
