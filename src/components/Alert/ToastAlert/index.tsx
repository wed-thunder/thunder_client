import React, { useEffect, useRef } from 'react';
import { Animated, View } from 'react-native';
import styled from 'styled-components/native';

import COLOR from '@/constant/color';

const ToastContainer = styled(Animated.View)`
  position: absolute;
  align-self: center;
  top: 40%;
  border-radius: 15px;
  width: 90%;
  background-color: ${COLOR.BLACK};
`;

const ToastText = styled.Text`
  padding: 10px 15px;
  color: ${COLOR.WHITE};
  font-size: 15px;
`;

interface Props {
  visible: boolean;
  bodyText: string;
  closeToast: () => void;
}

function ToastAlert({ visible, bodyText, closeToast }: Props): React.ReactElement {
  const fadeOpacity = useRef(new Animated.Value(0)).current;

  const fadeOutToast = Animated.timing(fadeOpacity, {
    toValue: 0,
    duration: 1500,
    useNativeDriver: true,
  });

  const fadeInToast = Animated.timing(fadeOpacity, {
    toValue: 1,
    duration: 500,
    useNativeDriver: true,
  });

  useEffect(() => {
    if (visible) {
      fadeInToast.start(() => {
        fadeOutToast.start(() => {
          closeToast();
        });
      });
    }
  }, [visible, bodyText]);

  if (!visible) {
    return <View />;
  }

  return (
    <ToastContainer style={{ opacity: fadeOpacity }}>
      <ToastText>{bodyText}</ToastText>
    </ToastContainer>
  );
}

export default ToastAlert;
