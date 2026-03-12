import '@esri/calcite-components/components/calcite-panel';
import '@esri/calcite-components/components/calcite-list';
import '@esri/calcite-components/components/calcite-list-item';
import '@esri/calcite-components/components/calcite-notice';
import '@esri/calcite-components/components/calcite-block';
import '@esri/calcite-components/components/calcite-shell';
import '@esri/calcite-components/components/calcite-sheet';
import '@esri/calcite-components/components/calcite-action';
import '@esri/calcite-components/components/calcite-tooltip';

import { useEffect, useState } from 'react';
import { LayerListItem } from './LayerListItem';

import {
  getLayerColor,
  computeOutOfScale,
  handleZoomToNorthwest,
} from '../utils/mapUtilsUi';
import { LayerGraphic } from './LayerGraphic';
import {
  type RecreationType,
  useLayersActions,
  useLayersState,
} from '../context/LayersContext';
import { useUIState } from '../context/UIContext';
import { DisclaimerNotice } from '../components/DisclaimerNotice';

const RECREATIONITEMS: {
  key: RecreationType;
  label: string;
  value: RecreationType;
}[] = [
  {
    key: 'trailhead',
    label: 'Trailheads',
    value: 'trailhead',
  },
  {
    key: 'campground',
    label: 'Campgrounds',
    value: 'campground',
  },
];

export function LayersPanel(): React.JSX.Element {
  const {
    fireYears,
    activeFireYears,
    perimeterLayers,
    roadAndTrailLayers,
    recreationSitesLayers,
    driveTimeLayers,
    activeRoadTrailLayerIds,
    activeRecreationTypes,
    activeDriveTimeLayerIds,
  } = useLayersState();
  const {
    handleFireYearSelection,
    handleRoadTrailSelection,
    handleRecreationTypeSelection,
    handleDriveTimeSelection,
  } = useLayersActions();

  const [outOfScaleLayerIds, setOutOfScaleLayerIds] = useState<string[]>([]);
  const { isSmallScreen } = useUIState();

  useEffect(() => {
    const mapElement = document.getElementById('morel-map') as
      | (HTMLElement & {
          view?: {
            scale?: number;
            watch?: (
              prop: string,
              callback: (...args: unknown[]) => void,
            ) => { remove: () => void } | undefined;
          };
        })
      | null;

    const view = mapElement?.view;
    if (!view || typeof view.scale !== 'number') {
      return;
    }

    const layersToTrack = [
      ...perimeterLayers,
      ...roadAndTrailLayers,
      ...recreationSitesLayers,
      ...driveTimeLayers,
    ];

    const compute = (): void => {
      const currentScale = view.scale ?? 0;
      const nextIds = computeOutOfScale(
        layersToTrack as {
          id?: string;
          minScale?: number;
          maxScale?: number;
        }[],
        currentScale,
      );

      setOutOfScaleLayerIds(nextIds);
    };

    compute();

    const handle =
      typeof view.watch === 'function'
        ? view.watch('scale', () => {
            compute();
          })
        : undefined;

    return () => {
      if (handle && typeof handle.remove === 'function') {
        handle.remove();
      }
    };
  }, [
    perimeterLayers,
    roadAndTrailLayers,
    recreationSitesLayers,
    driveTimeLayers,
  ]);

  const perimeterColor =
    perimeterLayers.length > 0 ? getLayerColor(perimeterLayers[0]) : undefined;

  const renderFireYearItems = (): React.JSX.Element[] =>
    fireYears.map((year, index) => {
      const isSelected = activeFireYears.includes(year);
      const selectionBorderColor = perimeterColor
        ? `color-mix(in srgb, ${perimeterColor} calc(100% - ${(index - 1) * 20}%), transparent)`
        : undefined;

      const perimeterLayerId = perimeterLayers[0]?.id;
      const isOutOfScale = perimeterLayerId
        ? outOfScaleLayerIds.includes(perimeterLayerId)
        : false;

      return (
        <calcite-list-item
          key={year}
          label={`${year} Fire Occurrence`}
          value={year}
          selected={isSelected}
          disabled={isOutOfScale}
          icon-end={isOutOfScale ? 'layer-hide' : undefined}
          oncalciteListItemSelect={handleFireYearSelection}
          style={{
            '--calcite-list-selection-border-color': selectionBorderColor,
          }}
        >
          {perimeterColor && (
            <LayerGraphic
              color={perimeterColor}
              isSelected={isSelected}
              extraStyles={{
                opacity: `calc(100% - ${(index - 1) * 20}%)`,
              }}
            />
          )}
        </calcite-list-item>
      );
    });

  const renderRoadAndTrailItems = (): React.JSX.Element[] =>
    roadAndTrailLayers.map((layer) => {
      const layerColor = getLayerColor(layer);
      const isSelected = activeRoadTrailLayerIds.includes(layer.id);
      const isOutOfScale = outOfScaleLayerIds.includes(layer.id);

      const rawTitle = (layer.title ?? '').toLowerCase();
      const displayLabel = rawTitle.includes('region6fireclosureline')
        ? 'Currently closed areas'
        : rawTitle.includes('trailnfspublish')
          ? 'Forest Service trails'
          : (layer.title ?? 'USFS layer');

      return (
        <LayerListItem
          key={layer.id}
          itemKey={layer.id}
          label={displayLabel}
          value={layer.id}
          selected={isSelected}
          disabled={isOutOfScale}
          onSelect={handleRoadTrailSelection}
          borderColor={layerColor}
          iconEnd={isOutOfScale ? 'layer-hide' : undefined}
        >
          <LayerGraphic color={layerColor} isSelected={isSelected} />
        </LayerListItem>
      );
    });

  const renderRecreationItems = (): React.JSX.Element[] | null => {
    const baseLayer = recreationSitesLayers[0];

    const baseColor = getLayerColor(baseLayer);

    const recreationLayerId = baseLayer.id;
    const isOutOfScale = recreationLayerId
      ? outOfScaleLayerIds.includes(recreationLayerId)
      : false;

    return RECREATIONITEMS.map((item) => {
      const isSelected = activeRecreationTypes.includes(item.value);

      const itemColor = baseColor;

      const graphicType =
        item.value === 'trailhead' ? 'trailhead' : 'campground';

      return (
        <LayerListItem
          key={item.key}
          itemKey={item.key}
          label={item.label}
          value={item.value}
          selected={isSelected}
          disabled={isOutOfScale}
          onSelect={handleRecreationTypeSelection}
          borderColor={itemColor}
          iconEnd={isOutOfScale ? 'layer-hide' : undefined}
        >
          <LayerGraphic
            graphicType={graphicType}
            graphicColor={itemColor}
            isSelected={isSelected}
          />
        </LayerListItem>
      );
    });
  };

  const renderDriveTimeItems = (): React.JSX.Element[] =>
    driveTimeLayers.map((layer) => {
      const layerColor = getLayerColor(layer);
      const isSelected = activeDriveTimeLayerIds.includes(layer.id);
      const isTwoHour = (layer.title ?? '')
        .toLowerCase()
        .includes('2 hours from portland');

      const isOutOfScale = outOfScaleLayerIds.includes(layer.id);

      return (
        <LayerListItem
          key={layer.id}
          itemKey={layer.id}
          label={layer.title ?? 'Drive time'}
          value={layer.id}
          selected={isSelected}
          disabled={isOutOfScale}
          onSelect={handleDriveTimeSelection}
          borderColor={layerColor}
          iconEnd={isOutOfScale ? 'layer-hide' : undefined}
        >
          <LayerGraphic
            color={layerColor}
            isSelected={isSelected}
            extraStyles={{
              borderColor: 'rgba(20,20,20,0.4)',
              boxShadow:
                isTwoHour && isSelected
                  ? `0 0 7px 0 rgba(20,20,20,0.4)`
                  : 'none',
            }}
          />
        </LayerListItem>
      );
    });

  return (
    <calcite-panel
      heading="Will I Find Morels?"
      className={`content-panel layers-panel ${isSmallScreen ? 'layers-panel--small-screen' : ''}`}
    >
      <calcite-action
        slot="header-actions-end"
        icon="zoom-to-object"
        text="Zoom to map focus area"
        onClick={handleZoomToNorthwest}
        id="zoom-to-action"
      ></calcite-action>

      <calcite-tooltip reference-element="zoom-to-action" placement="bottom">
        Zoom to map focus area
      </calcite-tooltip>

      {!isSmallScreen && <DisclaimerNotice slot="footer" />}

      <calcite-block
        icon-start="flag-f"
        heading="Has it burned recently?"
        expanded={!isSmallScreen}
        collapsible={isSmallScreen}
      >
        <calcite-list
          label="Fire occurrence by year"
          selection-mode="multiple"
          selection-appearance="border"
        >
          {renderFireYearItems()}
        </calcite-list>
      </calcite-block>

      {roadAndTrailLayers.length > 0 && (
        <calcite-block
          icon-start="walking"
          heading="Can I access it?"
          expanded={!isSmallScreen}
          collapsible={isSmallScreen}
        >
          <calcite-list
            label="Access filters"
            selection-mode="multiple"
            selection-appearance="border"
          >
            {renderDriveTimeItems()}
            {renderRecreationItems()}
            {renderRoadAndTrailItems()}
          </calcite-list>
        </calcite-block>
      )}
    </calcite-panel>
  );
}
