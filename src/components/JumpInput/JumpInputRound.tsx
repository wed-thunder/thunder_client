import * as React from 'react';
import {
  StyleProp,
  TextInput,
  TextInputProps,
  TextStyle,
  ViewStyle,
} from 'react-native';
import styled from 'styled-components/native';

import { H5 } from '@/components/Text';
import { COLOR } from '@/constant/color';

const Container = styled.View`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0px;
  width: 100%;
  flex: none;
`;

const BodyContainer = styled.View<{ verticalLabel: boolean }>`
  display: flex;
  flex-direction: row;
  margin: ${({ verticalLabel }) => (verticalLabel ? 6 : 0)}px 0px;
`;

type ColorStyle = 'focused' | 'error' | 'normal';
const getColor = (style: ColorStyle, defaultColor?: string): string => {
  switch (style) {
    case 'error':
      return COLOR.JRED;
    case 'focused':
      return COLOR.MBLUE;
    default:
      return defaultColor || COLOR.DGRAY;
  }
};

const LabelContainer = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100px;
`;

const Label = styled.Text<{ colorStyle: ColorStyle }>`
  font-style: normal;
  font-weight: 500;
  font-size: 15px;
  display: flex;
  align-items: center;
  color: ${({ colorStyle }) => getColor(colorStyle)};
`;

const InputBoxContainer = styled.View`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  flex: none;
  flex-grow: 1;
  margin: 0px;
`;

const InputContainer = styled.View<{
  colorStyle?: ColorStyle;
  editable?: boolean;
  forceShow?: boolean;
}>`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  padding: 0px;
  flex: none;
  flex-grow: 0;
  align-self: stretch;
  margin: 0px;
`;

const TextInputItem = styled(TextInput)<{
  colorStyle?: ColorStyle;
}>`
  padding-left: 5px;
  font-size: 16px;
  display: flex;
  align-items: center;
  color: ${COLOR.BLACK};
  padding: 16px 12px;
  background: ${COLOR.WHITE};
  border-radius: 8px;
  flex-grow: 1;
  border-width: 1.5px;
  border: ${({ colorStyle }) => getColor(colorStyle, COLOR.GRAY400)};
`;

const Suffix = styled.Text`
  margin-left: 12px;
  font-size: 16px;
  display: flex;
  align-items: center;
  color: ${COLOR.BLACK};
`;

const FooterMessageContainer = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  padding: 0px;
  width: 100%;
`;

const FooterMessage = styled(H5)<{ colorStyle?: ColorStyle }>`
  display: flex;
  align-items: center;
  text-align: right;
  color: ${({ colorStyle }) => getColor(colorStyle, COLOR.MGRAY)};
  flex: none;
  flex-grow: 0;
  margin-top: 8px;
`;

export interface JumpInputProps extends TextInputProps {
  formattedValue?: string;
  verticalLabel?: boolean;
  label?: string;
  labelRightIcon?: React.ReactElement;
  labelStyle?: StyleProp<TextStyle>;
  labelContainerStyle?: StyleProp<ViewStyle>;
  suffix?: string;
  suffixStyle?: StyleProp<TextStyle>;
  footerMessage?: string;
  footerMessageMode?: 'never' | 'while-editing' | 'unless-editing' | 'always';
  errorMessage?: string;
  textAlign?: 'left' | 'center' | 'right';
  textInputStyle?: StyleProp<TextStyle>;
  textInputLeftIcon?: React.ReactElement;
  textInputRightIcon?: React.ReactElement;
  containerStyle?: StyleProp<ViewStyle>;
  inputContainerStyle?: StyleProp<ViewStyle>;
  forceShow?: boolean;
  textInputRef?: React.RefObject<TextInput>;
}

function JumpInputRound({
  value,
  formattedValue,
  verticalLabel = true,
  label,
  labelRightIcon,
  labelStyle,
  labelContainerStyle,
  suffix,
  suffixStyle,
  footerMessage,
  footerMessageMode = 'always',
  errorMessage,
  textInputStyle,
  textInputLeftIcon,
  textInputRightIcon,
  containerStyle,
  inputContainerStyle,
  forceShow,
  editable = true,
  textInputRef,
  ...props
}: JumpInputProps): React.ReactElement {
  const [focused, setFocused] = React.useState(false);

  const getColorStyle = (): ColorStyle => {
    if (errorMessage) {
      return 'error';
    }
    if (focused) {
      return 'focused';
    }
    return 'normal';
  };

  const colorStyle: ColorStyle = getColorStyle();

  function Footer(): React.ReactElement {
    if (!(errorMessage || footerMessage)) {
      return null;
    }

    if (footerMessageMode === 'never') {
      return null;
    }
    if (footerMessageMode === 'while-editing' && !focused) {
      return null;
    }
    if (footerMessageMode === 'unless-editing' && focused) {
      return null;
    }

    return (
      <FooterMessageContainer>
        <FooterMessage colorStyle={colorStyle}>
          {errorMessage || footerMessage}
        </FooterMessage>
      </FooterMessageContainer>
    );
  }

  return (
    <Container style={containerStyle}>
      {verticalLabel && (
        <LabelContainer style={labelContainerStyle}>
          <Label colorStyle={colorStyle} style={labelStyle}>
            {label || ' '}
          </Label>

          {labelRightIcon}
        </LabelContainer>
      )}

      <BodyContainer verticalLabel={verticalLabel}>
        {!verticalLabel && (
          <LabelContainer style={labelContainerStyle}>
            <Label colorStyle={colorStyle} style={labelStyle}>
              {label || ' '}
            </Label>

            {labelRightIcon}
          </LabelContainer>
        )}

        <InputBoxContainer style={inputContainerStyle}>
          <InputContainer
            colorStyle={colorStyle}
            editable={editable}
            forceShow={forceShow}>
            {textInputLeftIcon}

            <TextInputItem
              ref={textInputRef}
              colorStyle={colorStyle}
              style={textInputStyle}
              value={focused ? value : formattedValue || value}
              autoCorrect={false}
              clearButtonMode="while-editing"
              returnKeyType="done"
              {...props}
              editable={editable}
              placeholderTextColor={COLOR.MGRAY}
              onFocus={(e) => {
                setFocused(true);
                if (props.onFocus) {
                  props.onFocus(e);
                }
              }}
              onBlur={(e) => {
                setFocused(false);
                if (props.onBlur) {
                  props.onBlur(e);
                }
              }}
            />

            {suffix && <Suffix style={suffixStyle}>{suffix}</Suffix>}

            {textInputRightIcon}
          </InputContainer>
        </InputBoxContainer>
      </BodyContainer>
      <Footer />
    </Container>
  );
}

export default JumpInputRound;
