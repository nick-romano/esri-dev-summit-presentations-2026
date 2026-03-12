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
  elevationProfileComponentOpen: boolean;
};

type UIActions = {
  closePopup: () => void;
  openPopup: () => void;
  closeElevationProfileComponent: () => void;
  openElevationProfileComponent: () => void;
  handleFeaturesSheetClose: (event: CustomEvent) => void;
};

const UIStateContext = createContext<UIState | null>(null);
const UIActionsContext = createContext<UIActions | null>(null);

export function UIProvider(props: PropsWithChildren): React.JSX.Element {
  const isSmallScreen = useIsBelowScreenSize(700);
  const [isFiltersSheetOpen, setIsFiltersSheetOpen] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [elevationProfileComponentOpen, setElevationProfileComponentOpen] =
    useState(false);

  const openPopup = useCallback(() => setIsPopupOpen(true), []);
  const closePopup = useCallback(() => setIsPopupOpen(false), []);
  const openElevationProfileComponent = useCallback(
    () => setElevationProfileComponentOpen(true),
    [],
  );
  const closeElevationProfileComponent = useCallback(
    () => setElevationProfileComponentOpen(false),
    [],
  );

  useEffect(() => {
    if (!isSmallScreen) {
      setIsFiltersSheetOpen(false);
    }
  }, [isSmallScreen]);

  const state: UIState = useMemo(
    () => ({
      isSmallScreen,
      isFiltersSheetOpen,
      isPopupOpen,
      elevationProfileComponentOpen,
    }),
    [
      isSmallScreen,
      isFiltersSheetOpen,
      isPopupOpen,
      elevationProfileComponentOpen,
    ],
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
      openElevationProfileComponent,
      closeElevationProfileComponent,
      handleFeaturesSheetClose,
    }),
    [
      openPopup,
      closePopup,
      openElevationProfileComponent,
      closeElevationProfileComponent,
      handleFeaturesSheetClose,
    ],
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
