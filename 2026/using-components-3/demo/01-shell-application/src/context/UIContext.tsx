import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react';

import { useIsBelowScreenSize } from '../hooks/useScreenSize';

type UIState = {
  isSmallScreen: boolean;
  isFiltersSheetOpen: boolean;
  isPopupOpen: boolean;
};

type UIActions = {
  closePopup: () => void;
  openPopup: () => void;
  handleFeaturesSheetClose: (event: CustomEvent) => void;
};

const UIStateContext = createContext<UIState | null>(null);
const UIActionsContext = createContext<UIActions | null>(null);

export function UIProvider(props: PropsWithChildren): React.JSX.Element {
  const isSmallScreen = useIsBelowScreenSize(700);
  const [isFiltersSheetOpen, setIsFiltersSheetOpen] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const openPopup = useCallback(() => setIsPopupOpen(true), []);
  const closePopup = useCallback(() => setIsPopupOpen(false), []);

  useEffect(() => {
    if (!isSmallScreen) {
      setIsFiltersSheetOpen(false);
    }
  }, [isSmallScreen]);

  const state: UIState = useMemo(
    () => ({ isSmallScreen, isFiltersSheetOpen, isPopupOpen }),
    [isSmallScreen, isFiltersSheetOpen, isPopupOpen],
  );

  const handleFeaturesSheetClose = useCallback(
    (event: CustomEvent): void => {
      if (event.target === event.currentTarget) {
        closePopup();
      }
    },
    [closePopup],
  );

  const actions: UIActions = useMemo(
    () => ({
      openPopup,
      closePopup,
      handleFeaturesSheetClose,
    }),
    [openPopup, closePopup, handleFeaturesSheetClose],
  );

  return (
    <UIStateContext value={state}>
      <UIActionsContext value={actions}>{props.children}</UIActionsContext>
    </UIStateContext>
  );
}

export function useUIState(): UIState {
  const ctx = useContext(UIStateContext);
  if (!ctx) {
    throw new Error('useUIState must be used within UIProvider');
  }
  return ctx;
}

export function useUIActions(): UIActions {
  const ctx = useContext(UIActionsContext);
  if (!ctx) {
    throw new Error('useUIActions must be used within UIProvider');
  }
  return ctx;
}
