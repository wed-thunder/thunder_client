import * as React from 'react';

import JumpNumberInputRound, {
  JumpNumberInputProps,
} from './JumpNumberInputRound';

function JumpRateInputRound(props: JumpNumberInputProps): React.ReactElement {
  return <JumpNumberInputRound suffix="%" {...props} />;
}

export default JumpRateInputRound;
