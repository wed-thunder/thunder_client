import * as React from 'react';

import JumpNumberInputRound, {
  JumpNumberInputProps,
} from './JumpNumberInputRound';

import { numberToKorean } from '@/utils';

function JumpMoneyInputRound({
  value,
  ...props
}: JumpNumberInputProps): React.ReactElement {
  return (
    <JumpNumberInputRound
      suffix="원"
      keyboardType="number-pad"
      footerMessage={numberToKorean(value)}
      {...props}
    />
  );
}

export default JumpMoneyInputRound;
