import * as React from 'react';
import { StyleProp, TextStyle, ViewStyle } from 'react-native';

import ThunderInputRound, { ThunderInputProps } from './ThunderInputRound';

export interface ThunderNumberInputProps extends ThunderInputProps {
  syntax?: boolean;
}

function ThunderItemInfoRound({
  textInputStyle,
  containerStyle,
  ...props
}: ThunderNumberInputProps): React.ReactElement {
  const defaultTextInputStyle: StyleProp<TextStyle> = { fontSize: 15 };
  const defaultContainerStyle: StyleProp<ViewStyle> = {
    marginTop: 0,
    marginBottom: 0,
  };

  return (
    <ThunderInputRound
      verticalLabel={false}
      textAlign="right"
      labelStyle={{ fontWeight: null }}
      containerStyle={Object.assign(defaultContainerStyle, containerStyle)}
      textInputStyle={Object.assign(defaultTextInputStyle, textInputStyle)}
      editable={false}
      {...props}
    />
  );
}

export default ThunderItemInfoRound;
