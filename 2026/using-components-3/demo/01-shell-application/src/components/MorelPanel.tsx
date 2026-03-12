import '@esri/calcite-components/components/calcite-tile-group';

import { useResultsActions, useResultsState } from '../context/ResultsContext';
import { useUIActions } from '../context/UIContext';
import { MorelTile } from './MorelTile';
import type { MorelTileProps } from './MorelTile';

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function MorelPanel(): React.JSX.Element {
  const {
    elevationDetail,
    elevationScore,
    elevationValue,
    burnStatusLabel,
    burnStatusValue,
    burnDetail,
    accessLabel,
    accessDetail,
    accessValue,
    locationLabel,
    canInspectFeaturesAtLocation,
  } = useResultsState();
  const { inspectFeaturesAtLocation } = useResultsActions();
  const { openElevationProfileComponent } = useUIActions();

  return (
    <calcite-tile-group
      label="Context tiles"
      layout="vertical"
      selection-mode="none"
      scale="s"
    >
      <MorelTile
        icon="pin"
        description="Latitude and longitude of last map click."
        heading="Location"
        metric={locationLabel}
        action={{
          label: 'Inspect features at location',
          onClick: inspectFeaturesAtLocation,
          disabled: !canInspectFeaturesAtLocation,
        }}
      />
      <MorelTile
        heading="Recent Wildfire"
        icon="drive-time"
        description={burnDetail}
        metric={burnStatusLabel}
        meter={{
          label: 'Burn status',
          min: 0,
          max: 100,
          value: burnStatusValue,
        }}
      />
      <MorelTile
        icon="altitude"
        description={
          elevationValue
            ? elevationDetail
            : 'Click on the map to get elevation details.'
        }
        heading="Elevation"
        metric={
          elevationValue !== null
            ? `${Math.round(elevationValue)} ft`
            : 'Tap map'
        }
        meter={{
          label: 'Elevation',
          min: 0,
          max: 100,
          value: elevationValue !== null ? elevationScore : null,
        }}
        action={{
          label: 'Open elevation profile',
          onClick: openElevationProfileComponent,
        }}
      />
      <MorelTile
        icon="walking"
        description={accessDetail}
        heading="Access"
        metric={accessLabel}
        meter={{
          label: 'Access (distance)',
          min: 0,
          max: 100,
          value: accessValue,
        }}
      />
    </calcite-tile-group>
  );
}
