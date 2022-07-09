import _ from 'lodash';
import * as React from 'react';

import ThunderInputRound, { ThunderInputProps } from './ThunderInputRound';

import { COLOR } from '@/constant/color';
import { numberWithCommas } from '@/utils';

export interface ThunderNumberInputProps extends ThunderInputProps {
  syntax?: boolean;
  footerMessage?: string;
}

function ThunderNumberInputRound({
  syntax,
  textInputStyle,
  ...props
}: ThunderNumberInputProps): React.ReactElement {
  const valueTextInputStyle = {
    color: _.toNumber(props.value) >= 0 ? COLOR.MBLUE : COLOR.JRED,
  };
  const mergedTextInputStyle = Object.assign(valueTextInputStyle, textInputStyle);

  return (
    <ThunderInputRound
      formattedValue={numberWithCommas(props.value)}
      textAlign="right"
      keyboardType="numeric"
      textInputStyle={syntax ? mergedTextInputStyle : textInputStyle}
      {...props}
    />
  );
}

export default ThunderNumberInputRound;
