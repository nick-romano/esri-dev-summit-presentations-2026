import '@esri/calcite-components/components/calcite-panel';
import '@esri/calcite-components/components/calcite-list';
import '@esri/calcite-components/components/calcite-list-item';
import '@esri/calcite-components/components/calcite-notice';

import type FeatureLayer from '@arcgis/core/layers/FeatureLayer';

interface LayersPanelProps {
  fireYears: number[];
  activeFireYears: number[];
  onFireYearSelect: (event: CustomEvent) => void;
  roadAndTrailLayers: FeatureLayer[];
  activeRoadTrailLayerIds: string[];
  onRoadTrailSelect: (event: CustomEvent) => void;
}

export function LayersPanel(props: LayersPanelProps): React.JSX.Element {
  const {
    fireYears,
    activeFireYears,
    onFireYearSelect,
    roadAndTrailLayers,
    activeRoadTrailLayerIds,
    onRoadTrailSelect,
  } = props;

  return (
    <calcite-panel heading="Layers" className="panel-layers">
      <calcite-notice slot="footer" open color="brand" kind="warning">
        <div slot="message">
          For illustration purposes only. Always follow local guidelines and
          regulations when foraging.
        </div>
      </calcite-notice>

      <calcite-list label="Fire occurrence by year" selection-mode="multiple">
        <calcite-list-item-group heading="FIREYEAR 2020–2025">
          {fireYears.map((year) => {
            const isSelected = activeFireYears.includes(year);
            return (
              <calcite-list-item
                key={year}
                label={`${year} Fire Occurrence`}
                iconEnd={isSelected ? 'view-visible' : 'view-hide'}
                scale="s"
                value={year}
                selected={isSelected}
                oncalciteListItemSelect={onFireYearSelect}
              />
            );
          })}
        </calcite-list-item-group>
      </calcite-list>

      {roadAndTrailLayers.length > 0 && (
        <calcite-list label="Roads and trails" selection-mode="multiple">
          <calcite-list-item-group heading="Fire closure lines, roads, and trails">
            {roadAndTrailLayers.map((layer) => (
              <calcite-list-item
                key={layer.id}
                label={layer.title ?? 'USFS layer'}
                iconEnd={
                  activeRoadTrailLayerIds.includes(layer.id)
                    ? 'view-visible'
                    : 'view-hide'
                }
                scale="s"
                value={layer.id}
                selected={activeRoadTrailLayerIds.includes(layer.id)}
                oncalciteListItemSelect={onRoadTrailSelect}
              />
            ))}
          </calcite-list-item-group>
        </calcite-list>
      )}
    </calcite-panel>
  );
}
