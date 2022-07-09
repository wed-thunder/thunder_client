import * as React from 'react';
import { StyleProp, TextStyle, ViewStyle } from 'react-native';

import JumpInputRound, { JumpInputProps } from './JumpInputRound';

export interface JumpNumberInputProps extends JumpInputProps {
  syntax?: boolean;
}

function JumpItemInfoRound({
  textInputStyle,
  containerStyle,
  ...props
}: JumpNumberInputProps): React.ReactElement {
  const defaultTextInputStyle: StyleProp<TextStyle> = { fontSize: 15 };
  const defaultContainerStyle: StyleProp<ViewStyle> = {
    marginTop: 0,
    marginBottom: 0,
  };

  return (
    <JumpInputRound
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

export default JumpItemInfoRound;
