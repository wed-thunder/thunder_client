import _ from 'lodash';
import * as React from 'react';

import JumpInputRound, { JumpInputProps } from './JumpInputRound';

import { COLOR } from '@/constant/color';
import { numberWithCommas } from '@/utils';

export interface JumpNumberInputProps extends JumpInputProps {
  syntax?: boolean;
  footerMessage?: string;
}

function JumpNumberInputRound({
  syntax,
  textInputStyle,
  ...props
}: JumpNumberInputProps): React.ReactElement {
  const valueTextInputStyle = {
    color: _.toNumber(props.value) >= 0 ? COLOR.MBLUE : COLOR.JRED,
  };
  const mergedTextInputStyle = Object.assign(
    valueTextInputStyle,
    textInputStyle,
  );

  return (
    <JumpInputRound
      formattedValue={numberWithCommas(props.value)}
      textAlign="right"
      keyboardType="numeric"
      textInputStyle={syntax ? mergedTextInputStyle : textInputStyle}
      {...props}
    />
  );
}

export default JumpNumberInputRound;
