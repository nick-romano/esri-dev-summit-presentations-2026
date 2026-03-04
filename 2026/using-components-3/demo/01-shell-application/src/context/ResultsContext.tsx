import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
  useRef,
  type PropsWithChildren,
} from 'react';

import { getAccessAtPoint, getBurnStatusAtPoint } from '../utils/mapUtils';
import { useLayersState } from './LayersContext';

type ResultsState = {
  burnStatusValue: number;
  burnStatusLabel: string;
  burnDetail: string;
  elevationValue: number | null;
  suitabilityValue: number;
  suitabilityLabel: string;
  accessDetail: string;
  locationLabel: string;
};

type ResultsAction =
  | {
      type: 'setAccessStatus';
      score: number;
      label: string;
      detail: string;
    }
  | {
      type: 'setBurnStatus';
      score: number;
      label: string;
      detail: string;
    }
  | { type: 'setElevationValue'; value: number | null }
  | { type: 'setLocationLabel'; label: string };

const initialState: ResultsState = {
  burnStatusValue: 0,
  burnStatusLabel: 'Tap map',
  elevationValue: null,
  suitabilityValue: 0,
  suitabilityLabel: 'Tap map',
  burnDetail: 'Click the map to see burn history.',
  accessDetail: 'Click the map to see distance to closure lines.',
  locationLabel: 'Tap map',
};

function resultsReducer(
  state: ResultsState,
  action: ResultsAction,
): ResultsState {
  switch (action.type) {
    case 'setLocationLabel':
      return { ...state, locationLabel: action.label };
    case 'setBurnStatus':
      return {
        ...state,
        burnStatusValue: action.score,
        burnStatusLabel: action.label,
        burnDetail: action.detail,
      };
    case 'setElevationValue':
      return { ...state, elevationValue: action.value };
    case 'setAccessStatus':
      return {
        ...state,
        suitabilityValue: action.score,
        suitabilityLabel: action.label,
        accessDetail: action.detail,
      };
    default:
      return state;
  }
}

type ResultsActions = {
  handleMapClick: (event: HTMLArcgisMapElement['arcgisViewClick']) => void;
};

const ResultsStateContext = createContext<ResultsState | null>(null);
const ResultsActionsContext = createContext<ResultsActions | null>(null);

export function ResultsProvider(props: PropsWithChildren): React.JSX.Element {
  const [state, dispatch] = useReducer(resultsReducer, initialState);
  const requestIdRef = useRef(0);

  const { perimeterLayers, roadClosureLayers } = useLayersState();

  const handleMapClick = useCallback(
    async (event: HTMLArcgisMapElement['arcgisViewClick']): Promise<void> => {
      const { mapPoint } = event.detail;

      requestIdRef.current += 1;
      const requestId = requestIdRef.current;

      if (
        typeof mapPoint.latitude === 'number' &&
        typeof mapPoint.longitude === 'number'
      ) {
        const latitude = mapPoint.latitude.toFixed(4);
        const longitude = mapPoint.longitude.toFixed(4);
        dispatch({
          type: 'setLocationLabel',
          label: `${latitude}, ${longitude}`,
        });
      } else {
        dispatch({ type: 'setLocationLabel', label: 'Tap map' });
      }

      const burnStatus = await getBurnStatusAtPoint(mapPoint, perimeterLayers);
      if (requestIdRef.current !== requestId) {
        return;
      }
      dispatch({
        type: 'setBurnStatus',
        score: burnStatus.score,
        label: burnStatus.label,
        detail: burnStatus.detail,
      });

      // Elevation still TODO
      dispatch({ type: 'setElevationValue', value: null });

      const accessStatus = await getAccessAtPoint(mapPoint, roadClosureLayers);
      if (requestIdRef.current !== requestId) {
        return;
      }
      dispatch({
        type: 'setAccessStatus',
        score: accessStatus.score,
        label: accessStatus.label,
        detail: accessStatus.detail,
      });
    },
    [perimeterLayers, roadClosureLayers],
  );

  const actions: ResultsActions = useMemo(
    () => ({ handleMapClick }),
    [handleMapClick],
  );

  return (
    <ResultsStateContext value={state}>
      <ResultsActionsContext value={actions}>
        {props.children}
      </ResultsActionsContext>
    </ResultsStateContext>
  );
}

export function useResultsState(): ResultsState {
  const ctx = useContext(ResultsStateContext);
  if (!ctx) {
    throw new Error('useResultsState must be used within ResultsProvider');
  }
  return ctx;
}

export function useResultsActions(): ResultsActions {
  const ctx = useContext(ResultsActionsContext);
  if (!ctx) {
    throw new Error('useResultsActions must be used within ResultsProvider');
  }
  return ctx;
}
