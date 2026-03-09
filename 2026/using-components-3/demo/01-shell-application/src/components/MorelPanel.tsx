import '@esri/calcite-components/components/calcite-tile-group';

import { useResultsActions, useResultsState } from '../context/ResultsContext';
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
        blurb={locationLabel}
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
        blurb={burnStatusLabel}
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
        blurb={
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
      />
      <MorelTile
        icon="walking"
        description={accessDetail}
        heading="Access"
        blurb={accessLabel}
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
