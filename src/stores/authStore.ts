import { flow, types } from 'mobx-state-tree';

import { authService } from '@/apis';
import { Token } from '@/apis/privateApi';
import { Auth, AuthUser } from '@/models';
import authStorage from '@/storage/auth';
import userStorage from '@/storage/user';

const AuthStore = Auth.named('AuthStore')
  .props({
    isLogin: types.optional(types.boolean, false),
    user: types.maybeNull(AuthUser),
  })
  .actions((self) => {
    // AuthUser 정보 세팅
    const setUser = flow(function* setUser(user) {
      const newUser = {
        ...user,
        // notificationApprovedAt: service?.notificationApprovedAt,
        // nightNotificationApprovedAt: service?.nightNotificationApprovedAt,
      };
      self.user = AuthUser.create(newUser);
      yield userStorage.store(user);
    });

    // Token 정보 세팅
    const setToken = (accessToken: string, refreshToken: string): void => {
      self.accessToken = accessToken;
      self.refreshToken = refreshToken;
      authStorage.store({ accessToken, refreshToken });
    };
    const login = flow(function* login() {
      // const Profile: Profile = yield customerService.getProfile();
      yield setUser({});

      try {
        // Expo Token 저장
        // const token = (yield Notifications.getExpoPushTokenAsync()).data;
        // yield registerExpoPushToken(token, Device.osName);
      } catch (e) {
        // Ignore get expo push token in simulator
        console.log(e);
      }
      self.isLogin = true;
    });

    const logout = flow(function* logout() {
      self.isLogin = false;
      self.user = null;

      // const token = (yield Notifications.getExpoPushTokenAsync()).data;
      // yield deleteExpoPushToken(token);

      yield userStorage.clear();
      yield authStorage.clear();
      // yield sendbirdStorage.clear();
    });
    // localStorage 의 AuthUser 정보 로드
    const loadUser = flow(function* loadUser() {
      const user = yield userStorage.read();
      if (user) {
        setUser(user);
        yield login();
      }
    });
    // localStorage의 Token 정보 로드
    const loadToken = flow(function* loadToken() {
      const auth = yield authStorage.read();
      if (auth) {
        const { accessToken, refreshToken } = auth;
        self.accessToken = accessToken;
        self.refreshToken = refreshToken;
      }
    });
    // 초기화
    const init = flow(function* init() {
      yield loadUser();
      yield loadToken();
    });
    // 인증번호 요청
    const getAuthCode = flow(function* getAuthCode(phone: string) {
      const authCode: boolean = yield authService.authenticatePhone(phone);
      return authCode;
    });
    // 인증번호 확인
    const confirmAuthCode = flow(function* verifyPhone(phone: string, authCode: string) {
      try {
        const response = yield authService.verifyPhone(phone, authCode);
        // 가입되어 있는 경우
        return {
          accessToken: response.accessToken,
          refreshToken: response.refreshToken,
        };
      } catch (err) {
        console.debug('verifyPhone error', err.response.data);
        return null;
      }
    });
    // 회원가입
    const signUp = flow(function* signUp(name, password, uid, token) {
      // 회원가입
      let response: Token = null;
      try {
        response = yield authService.signUp(name, password, uid, token);
      } catch (err) {
        console.debug('signUp', err.response.data);
        // Sentry.Native.captureException(err);
        return null;
      }

      return response;
    });
    // 회원정보 업데이트
    // const updateProfile = flow(function* updateProfile())

    return {
      init,
      setUser,
      setToken,
      login,
      logout,
      getAuthCode,
      confirmAuthCode,
      signUp,
    };
  });
export default AuthStore;
