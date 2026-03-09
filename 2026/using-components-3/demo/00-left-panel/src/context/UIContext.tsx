import { createContext, useContext, type PropsWithChildren } from 'react';

import { useIsBelowScreenSize } from '../hooks/useScreenSize';

type UIState = {
  isSmallScreen: boolean;
};

const UIStateContext = createContext<UIState | null>(null);

export function UIProvider(props: PropsWithChildren): React.JSX.Element {
  const isSmallScreen = useIsBelowScreenSize(700);

  return (
    <UIStateContext.Provider value={{ isSmallScreen }}>
      {props.children}
    </UIStateContext.Provider>
  );
}

export function useUIState(): UIState {
  const ctx = useContext(UIStateContext);
  if (!ctx) {
    throw new Error('useUIState must be used within UIProvider');
  }
  return ctx;
}
