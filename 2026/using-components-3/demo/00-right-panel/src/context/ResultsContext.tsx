import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
  useRef,
  type PropsWithChildren,
} from 'react';

import Graphic from '@arcgis/core/Graphic.js';
import type MapView from '@arcgis/core/views/MapView.js';
import type SceneView from '@arcgis/core/views/SceneView.js';
import type ElevationProfileAnalysisView2D from '@arcgis/core/views/2d/analysis/ElevationProfileAnalysisView2D.js';

import {
  getBurnStatusAtPoint,
  getWalkingAccessAtPoint,
} from '../utils/mapUtils';
import { useLayersState } from './LayersContext';
import { useUIActions } from './UIContext';

const feetPerMeter = 3.28084;

function formatImperialDistance(meters: number): string {
  const safeMeters = Number.isFinite(meters) ? Math.max(meters, 0) : 0;
  const feet = safeMeters * feetPerMeter;

  if (feet < 1000) {
    return `${Math.round(feet)} ft`;
  }

  const miles = feet / 5280;
  const decimals = miles < 10 ? 2 : 1;
  return `${miles.toFixed(decimals)} mi`;
}

function formatNameOrUnknown(
  label: string,
  value: string | null | undefined,
): string {
  return value ? `${label}: ${value}` : `${label}: Unknown`;
}

function formatProfileDistance(distance: number, unit: string): string {
  switch (unit) {
    case 'feet':
    case 'foot':
    case 'ft':
      return `${Math.round(distance)} ft`;
    case 'miles':
    case 'mile':
    case 'mi': {
      const decimals = distance < 10 ? 2 : 1;
      return `${distance.toFixed(decimals)} mi`;
    }
    case 'meters':
    case 'meter':
    case 'm':
      return `${Math.round(distance)} m`;
    case 'kilometers':
    case 'kilometer':
    case 'km': {
      const decimals = distance < 10 ? 2 : 1;
      return `${distance.toFixed(decimals)} km`;
    }
    default:
      return `${distance.toFixed(distance < 10 ? 2 : 1)} ${unit}`;
  }
}

function convertDistanceToMeters(
  distance: number,
  unit: string,
): number | null {
  switch (unit) {
    case 'feet':
    case 'foot':
    case 'ft':
      return distance / feetPerMeter;
    case 'miles':
    case 'mile':
    case 'mi':
      return (distance * 5280) / feetPerMeter;
    case 'meters':
    case 'meter':
    case 'm':
      return distance;
    case 'kilometers':
    case 'kilometer':
    case 'km':
      return distance * 1000;
    default:
      return null;
  }
}

type ResultsState = {
  burnStatusValue: number;
  burnStatusLabel: string;
  burnDetail: string;
  elevationDetail: string;
  elevationScore: number;
  elevationValue: number | null;
  accessLabel: string;
  accessDetail: string;
  accessValue: number;
  locationLabel: string;
  canInspectFeaturesAtLocation: boolean;
};

type ResultsAction =
  | {
      type: 'setAccessStatus';
      label: string;
      detail: string;
      value: number;
    }
  | {
      type: 'setBurnStatus';
      score: number;
      label: string;
      detail: string;
    }
  | { type: 'setCanInspectFeaturesAtLocation'; value: boolean }
  | { type: 'setElevationValue'; value: number | null }
  | { type: 'setLocationLabel'; label: string };

const initialState: ResultsState = {
  burnStatusValue: 0,
  burnStatusLabel: 'Tap map',
  elevationDetail: 'Click the map to see how favorable the elevation is.',
  elevationScore: 0,
  elevationValue: null,
  burnDetail: 'Click the map to see burn history.',
  accessLabel: 'Tap map',
  accessDetail: 'Click the map to see walking distance via nearby trails.',
  accessValue: 0,
  locationLabel: 'Tap map',
  canInspectFeaturesAtLocation: false,
};

function getAccessValueFromMiles(alongTrailMiles: number | null): number {
  if (alongTrailMiles === null || !Number.isFinite(alongTrailMiles)) {
    return 0;
  }

  // Best is within 1 mile; worst is > 10 miles.
  if (alongTrailMiles <= 1) {
    return 100;
  }
  if (alongTrailMiles >= 10) {
    return 0;
  }

  // Linear scale: 1mi => 100, 10mi => 0
  const t = (alongTrailMiles - 1) / 9;
  const value = 100 * (1 - t);
  return Math.min(100, Math.max(0, Math.round(value)));
}

function getElevationScoreFromFeet(elevationFeet: number | null): number {
  if (elevationFeet === null || !Number.isFinite(elevationFeet)) {
    return 0;
  }

  const preferredMinFeet = 2_500;
  const preferredMaxFeet = 6_000;
  if (elevationFeet >= preferredMinFeet && elevationFeet <= preferredMaxFeet) {
    return 100;
  }

  const distanceFromPreferredBand =
    elevationFeet < preferredMinFeet
      ? preferredMinFeet - elevationFeet
      : elevationFeet - preferredMaxFeet;

  // Smooth Gaussian-style falloff outside the preferred band.
  const falloffFeet = 1_300;
  const score = 100 * 0.5 ** ((distanceFromPreferredBand / falloffFeet) ** 2);
  return Math.max(0, Math.min(100, Math.round(score)));
}

function getElevationDetail(
  elevationFeet: number | null,
  elevationScore: number,
): string {
  if (elevationFeet === null || !Number.isFinite(elevationFeet)) {
    return 'Click the map to see how favorable the elevation is.';
  }

  if (elevationScore === 100) {
    return 'This elevation is in the ideal 2500-6000 ft range, great for morels!';
  }

  if (elevationFeet < 2_500) {
    return 'This spot is below the ideal 2500-6000 ft range, but could still produce some morels.';
  }
  if (elevationFeet > 6_000) {
    return 'This spot is above the ideal 2500-6000 ft range, which may be too high for morels, but you might get lucky!';
  }
  return 'This elevation is a bit outside the ideal 2500-6000 ft range, so it may be less favorable for morels.';
}

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
      return {
        ...state,
        elevationValue: action.value,
        elevationScore: getElevationScoreFromFeet(action.value),
        elevationDetail: getElevationDetail(
          action.value,
          getElevationScoreFromFeet(action.value),
        ),
      };
    case 'setAccessStatus':
      return {
        ...state,
        accessLabel: action.label,
        accessDetail: action.detail,
        accessValue: action.value,
      };
    case 'setCanInspectFeaturesAtLocation':
      return { ...state, canInspectFeaturesAtLocation: action.value };
    default:
      return state;
  }
}

type ResultsActions = {
  handleMapClick: (event: HTMLArcgisMapElement['arcgisViewClick']) => void;
  inspectFeaturesAtLocation: () => void;
  registerElevationProfileElement: (
    el: HTMLArcgisElevationProfileElement | null,
  ) => void;
};

const ResultsStateContext = createContext<ResultsState | null>(null);
const ResultsActionsContext = createContext<ResultsActions | null>(null);

export function ResultsProvider(props: PropsWithChildren): React.JSX.Element {
  const [state, dispatch] = useReducer(resultsReducer, initialState);
  const requestIdRef = useRef(0);
  const clickDetailRef = useRef<
    HTMLArcgisMapElement['arcgisViewClick']['detail'] | null
  >(null);
  const elevationProfileElementRef =
    useRef<HTMLArcgisElevationProfileElement | null>(null);

  const {
    perimeterLayers,
    trailLayers,
    recreationSitesLayers,
    clickPinLayer,
    selectedTrailRouteLayer,
  } = useLayersState();

  const { openPopup } = useUIActions();

  const registerElevationProfileElement = useCallback(
    (el: HTMLArcgisElevationProfileElement | null): void => {
      elevationProfileElementRef.current = el;
    },
    [],
  );

  const waitForElevationProfileDone = useCallback(
    async (
      el: HTMLArcgisElevationProfileElement,
      requestId: number,
    ): Promise<void> => {
      if (el.progress === 1) {
        await Promise.resolve();
        return;
      }

      await new Promise<void>((resolve, reject) => {
        const timeoutMs = 15_000;
        const timeoutId = window.setTimeout(() => {
          cleanup();
          reject(new Error('Elevation profile timed out'));
        }, timeoutMs);

        const onChange = (
          event: HTMLArcgisElevationProfileElement['arcgisPropertyChange'],
        ) => {
          if (requestIdRef.current !== requestId) {
            cleanup();
            resolve();
            return;
          }
          if (event.detail.name !== 'progress') {
            return;
          }
          if (el.progress === 1) {
            cleanup();
            resolve();
          }
        };

        const cleanup = () => {
          window.clearTimeout(timeoutId);
          el.removeEventListener(
            'arcgisPropertyChange',
            onChange as unknown as EventListener,
          );
        };

        el.addEventListener(
          'arcgisPropertyChange',
          onChange as unknown as EventListener,
        );
      });
    },
    [],
  );

  const getElevationProfileDistance = useCallback(
    async (
      el: HTMLArcgisElevationProfileElement,
      view: MapView | SceneView,
      requestId: number,
    ): Promise<{
      displayDistance: number;
      displayUnit: string;
      meters: number;
    } | null> => {
      await waitForElevationProfileDone(el, requestId);

      if (requestIdRef.current !== requestId) {
        return null;
      }

      type WhenAnalysisView = (
        analysis: unknown,
      ) => Promise<ElevationProfileAnalysisView2D>;

      const analysisView = await (
        view as unknown as { whenAnalysisView: WhenAnalysisView }
      ).whenAnalysisView(el.analysis);

      const result = analysisView.results[0];
      const displayDistance =
        result.statistics?.maxDistance ??
        result.samples?.[result.samples.length - 1]?.distance;
      const displayUnit = analysisView.effectiveDisplayUnits.distance;

      if (
        typeof displayDistance !== 'number' ||
        !Number.isFinite(displayDistance) ||
        typeof displayUnit !== 'string'
      ) {
        return null;
      }

      const meters = convertDistanceToMeters(displayDistance, displayUnit);
      if (meters === null || !Number.isFinite(meters)) {
        return null;
      }

      return { displayDistance, displayUnit, meters };
    },
    [waitForElevationProfileDone],
  );

  const inspectFeaturesAtLocation = useCallback(async (): Promise<void> => {
    const clickDetail = clickDetailRef.current;
    if (!clickDetail) {
      return;
    }

    const features = document.querySelector('arcgis-features');
    if (!features) {
      return;
    }

    features.clear();
    await features.fetchFeatures(clickDetail);
    features.open = true;
    openPopup();
  }, [openPopup]);

  const handleMapClick = useCallback(
    async (event: HTMLArcgisMapElement['arcgisViewClick']): Promise<void> => {
      const { mapPoint } = event.detail;
      const currentView = event.target.view as MapView | SceneView | undefined;

      // Default to not inspectable until a hitTest proves otherwise.
      clickDetailRef.current = null;
      dispatch({ type: 'setCanInspectFeaturesAtLocation', value: false });

      requestIdRef.current += 1;
      const requestId = requestIdRef.current;

      // Clear prior elevation immediately (avoid stale values while loading).
      dispatch({ type: 'setElevationValue', value: null });

      // Clear any prior route immediately (avoid stale highlights).
      if (selectedTrailRouteLayer) {
        selectedTrailRouteLayer.removeAll();
      }
      if (elevationProfileElementRef.current) {
        elevationProfileElementRef.current.feature = undefined;
      }

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

      try {
        const response = await event.target.view.hitTest(event.detail);
        const hitTestResults = response.results;
        // check if response has results in our filtered layers
        const actionableResults = hitTestResults.filter((result) =>
          [perimeterLayers, trailLayers, recreationSitesLayers]
            .flat()
            .some((layer) => layer === result.layer),
        );

        if (actionableResults.length > 0) {
          clickDetailRef.current = event.detail;
          dispatch({ type: 'setCanInspectFeaturesAtLocation', value: true });
        }
      } catch {
        clickDetailRef.current = null;
      }

      // Add/replace a location pin graphic so users can see what they clicked.
      if (clickPinLayer) {
        clickPinLayer.removeAll();
        clickPinLayer.add(
          new Graphic({
            geometry: mapPoint,
            symbol: {
              type: 'simple-marker',
              size: 12,
            },
          }),
        );
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

      // Query exact elevation at the clicked point from ground data.
      try {
        if (!currentView) {
          throw new Error('No view available for elevation query');
        }

        await currentView.when();

        const map = currentView.map;
        if (!map) {
          throw new Error('No map available for elevation query');
        }

        const elevationResult = await map.ground.queryElevation(mapPoint, {
          demResolution: 'finest-contiguous',
        });

        if (requestIdRef.current !== requestId) {
          return;
        }

        let elevationFeet: number | null = null;
        if (
          typeof elevationResult.geometry.z === 'number' &&
          Number.isFinite(elevationResult.geometry.z)
        ) {
          elevationFeet = elevationResult.geometry.z * feetPerMeter;
        }

        dispatch({ type: 'setElevationValue', value: elevationFeet });
      } catch {
        if (requestIdRef.current !== requestId) {
          return;
        }
        dispatch({ type: 'setElevationValue', value: null });
      }

      const accessStatus = await getWalkingAccessAtPoint(
        mapPoint,
        trailLayers,
        recreationSitesLayers,
        { searchRadiusKilometers: 20 },
      );
      if (requestIdRef.current !== requestId) {
        return;
      }

      const routeGraphic = accessStatus.routeGeometry
        ? new Graphic({
            geometry: accessStatus.routeGeometry,
            symbol: {
              type: 'simple-line',
              width: 4,
            },
          })
        : undefined;

      if (selectedTrailRouteLayer) {
        selectedTrailRouteLayer.removeAll();
        if (routeGraphic) {
          selectedTrailRouteLayer.add(routeGraphic);
        }
      }

      let alongTrailMeters = accessStatus.alongTrailMeters;
      let alongTrailLabel =
        accessStatus.alongTrailMeters !== null
          ? formatImperialDistance(accessStatus.alongTrailMeters)
          : null;

      if (elevationProfileElementRef.current) {
        elevationProfileElementRef.current.feature = routeGraphic;

        if (routeGraphic && currentView) {
          try {
            const profileDistance = await getElevationProfileDistance(
              elevationProfileElementRef.current,
              currentView,
              requestId,
            );

            if (requestIdRef.current !== requestId) {
              return;
            }

            if (profileDistance) {
              alongTrailMeters = profileDistance.meters;
              alongTrailLabel = formatProfileDistance(
                profileDistance.displayDistance,
                profileDistance.displayUnit,
              );
            }
          } catch {
            if (requestIdRef.current !== requestId) {
              return;
            }
          }
        }
      }

      const alongTrailMiles =
        alongTrailMeters !== null
          ? (alongTrailMeters * feetPerMeter) / 5280
          : null;

      const accessLabel =
        accessStatus.offTrailMeters !== null && alongTrailMeters !== null
          ? formatImperialDistance(
              accessStatus.offTrailMeters + alongTrailMeters,
            )
          : accessStatus.label;

      const accessDetail =
        accessStatus.offTrailMeters !== null && alongTrailLabel !== null
          ? `${formatNameOrUnknown('Trail', accessStatus.trailName)} • ${formatNameOrUnknown('Trailhead', accessStatus.trailheadName)} • Off trail: ${formatImperialDistance(accessStatus.offTrailMeters)} • Along trail: ${alongTrailLabel}`
          : accessStatus.detail;

      dispatch({
        type: 'setAccessStatus',
        label: accessLabel,
        detail: accessDetail,
        value: getAccessValueFromMiles(alongTrailMiles),
      });
    },
    [
      clickPinLayer,
      perimeterLayers,
      recreationSitesLayers,
      selectedTrailRouteLayer,
      trailLayers,
    ],
  );

  const actions: ResultsActions = useMemo(
    () => ({
      handleMapClick,
      inspectFeaturesAtLocation,
      registerElevationProfileElement,
    }),
    [
      handleMapClick,
      inspectFeaturesAtLocation,
      registerElevationProfileElement,
    ],
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
