import type { PropsWithChildren } from 'react';

import { LayersProvider } from './LayersContext';
import { UIProvider } from './UIContext';

export function AppProviders(props: PropsWithChildren): React.JSX.Element {
  return (
    <LayersProvider>
      <UIProvider>{props.children}</UIProvider>
    </LayersProvider>
  );
}
