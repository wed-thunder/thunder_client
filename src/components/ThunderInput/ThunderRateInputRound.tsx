import * as React from 'react';

import ThunderNumberInputRound, { ThunderNumberInputProps } from './ThunderNumberInputRound';

function ThunderRateInputRound(props: ThunderNumberInputProps): React.ReactElement {
  return <ThunderNumberInputRound suffix="%" {...props} />;
}

export default ThunderRateInputRound;
