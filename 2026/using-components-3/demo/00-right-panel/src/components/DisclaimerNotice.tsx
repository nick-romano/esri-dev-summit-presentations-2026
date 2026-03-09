import '@esri/calcite-components/components/calcite-notice';
import React from 'react';

type Props = {
  slot?: string;
};

export function DisclaimerNotice({ slot }: Props): React.JSX.Element {
  return (
    <calcite-notice slot={slot} open color="brand" kind="warning" width="full">
      <div slot="message">
        For illustration purposes only. Always follow local guidelines and
        regulations when foraging.
      </div>
    </calcite-notice>
  );
}
