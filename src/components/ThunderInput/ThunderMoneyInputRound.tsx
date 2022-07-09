import * as React from 'react';

import ThunderNumberInputRound, { ThunderNumberInputProps } from './ThunderNumberInputRound';

import { numberToKorean } from '@/utils';

function ThunderMoneyInputRound({ value, ...props }: ThunderNumberInputProps): React.ReactElement {
  return (
    <ThunderNumberInputRound
      suffix="원"
      keyboardType="number-pad"
      footerMessage={numberToKorean(value)}
      {...props}
    />
  );
}

export default ThunderMoneyInputRound;
