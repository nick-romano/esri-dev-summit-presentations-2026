import '@esri/calcite-components/components/calcite-tile-group';

import { useResultsActions, useResultsState } from '../context/ResultsContext';
import { MorelTile } from './MorelTile';
import type { MorelTileProps } from './MorelTile';

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function MorelPanel(): React.JSX.Element {
  const {
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

  const resultsTiles: (MorelTileProps & { key: string })[] = [
    {
      key: 'elevation',
      icon: 'altitude',
      heading: 'Elevation',
      description:
        elevationValue !== null
          ? 'Elevation at clicked location.'
          : 'Click the map to see elevation.',
      blurb:
        elevationValue !== null
          ? `${Math.round(elevationValue)} ft`
          : 'Tap map',
      meter: {
        label: 'Elevation',
        min: 0,
        max: 4000,
        value: elevationValue !== null ? clamp(elevationValue, 0, 4000) : null,
      },
      // action: {
      //   label: 'Optional action',
      //   onClick: () => {},
      // },
    },
    // {
    //   key: 'location',
    //   icon: 'pin',
    //   description: 'Latitude and longitude of last map click.',
    //   heading: 'Location',
    //   blurb: locationLabel,
    //   action: {
    //     label: 'Inspect features at location',
    //     onClick: inspectFeaturesAtLocation,
    //     disabled: !canInspectFeaturesAtLocation,
    //   },
    // },
    // {
    //   key: 'burn',
    //   icon: 'drive-time',
    //   description: burnDetail,
    //   heading: 'Recent Wildfire',
    //   blurb: burnStatusLabel,
    //   meter: {
    //     label: 'Burn status',
    //     min: 0,
    //     max: 100,
    //     value: burnStatusValue,
    //     className: 'big-number',
    //   },
    // },
    // {
    //   key: 'elevation',
    //   className: 'danger',
    //   icon: 'altitude',
    //   description:
    //     elevationValue !== null
    //       ? 'Elevation at clicked location.'
    //       : 'Click the map to see elevation.',
    //   heading: 'Elevation',
    //   blurb:
    //     elevationValue !== null
    //       ? `${Math.round(elevationValue)} ft`
    //       : 'Tap map',
    //   meter: {
    //     label: 'Elevation',
    //     min: 0,
    //     max: 4000,
    //     value: elevationValue !== null ? clamp(elevationValue, 0, 4000) : null,
    //   },
    // },
    // {
    //   key: 'access',
    //   icon: 'walking',
    //   description: accessDetail,
    //   heading: 'Access',
    //   blurb: accessLabel,
    //   meter: {
    //     label: 'Access (distance)',
    //     min: 0,
    //     max: 100,
    //     value: accessValue,
    //   },
    // },
  ];

  return (
    <calcite-tile-group
      label="Context tiles"
      layout="vertical"
      selection-mode="none"
      scale="s"
    >
      {resultsTiles.map(({ key, ...tileProps }) => (
        <MorelTile key={key} {...tileProps} />
      ))}
    </calcite-tile-group>
  );
}
