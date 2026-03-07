import '@esri/calcite-components/components/calcite-panel';
import '@esri/calcite-components/components/calcite-list';
import '@esri/calcite-components/components/calcite-list-item';
import '@esri/calcite-components/components/calcite-notice';
import '@esri/calcite-components/components/calcite-block';
import '@esri/calcite-components/components/calcite-shell';
import '@esri/calcite-components/components/calcite-sheet';
import '@esri/calcite-components/components/calcite-slider';

import { getLayerColor } from '../utils/mapUtils';
import { useLayersActions, useLayersState } from '../context/LayersContext';

export function LayersPanel(): React.JSX.Element {
  const {
    fireYears,
    activeFireYears,
    perimeterLayers,
    roadAndTrailLayers,
    activeRoadTrailLayerIds,
  } = useLayersState();
  const { handleFireYearSelection, handleRoadTrailSelection } =
    useLayersActions();

  const perimeterColor =
    perimeterLayers.length > 0 ? getLayerColor(perimeterLayers[0]) : undefined;

  return (
    <calcite-panel heading="Will I Find Morels?" className="panel-layers">
      <calcite-notice slot="footer" open color="brand" kind="warning">
        <div slot="message">
          For illustration purposes only. Always follow local guidelines and
          regulations when foraging.
        </div>
      </calcite-notice>

      <calcite-block
        icon-end="drive-time"
        heading="Has it burned recently?"
        expanded
      >
        <calcite-list
          label="Fire occurrence by year"
          selection-mode="multiple"
          selection-appearance="border"
        >
          {fireYears.map((year, index) => {
            const isSelected = activeFireYears.includes(year);
            return (
              <calcite-list-item
                key={year}
                label={`${year} Fire Occurrence`}
                value={year}
                selected={isSelected}
                oncalciteListItemSelect={handleFireYearSelection}
                style={{
                  '--calcite-list-selection-border-color': `color-mix(in srgb, ${perimeterColor} calc(100% - ${(index - 1) * 20}%), transparent)`,
                }}
              >
                {perimeterColor && (
                  <div
                    slot="content-end"
                    style={{
                      width: '1rem',
                      height: '1rem',
                      borderRadius: '999px',
                      backgroundColor: isSelected
                        ? perimeterColor
                        : 'transparent',
                      borderColor: isSelected ? 'transparent' : perimeterColor,
                      border: '1px solid transparent',
                      // todo - get unique feature type opacity from layer instead of doing this manually
                      opacity: `calc(100% - ${(index - 1) * 20}%)`,
                    }}
                  ></div>
                )}
              </calcite-list-item>
            );
          })}
        </calcite-list>
      </calcite-block>

      <calcite-block
        icon-end="altitude"
        heading="Is the elevation right?"
        expanded
        className="block-elevation"
      >
        <calcite-label>
          <calcite-slider
            minValue={2000}
            maxValue={6000}
            max={10000}
            min={0}
            groupSeparator
            labelHandles
            precise
          ></calcite-slider>
        </calcite-label>
      </calcite-block>

      {roadAndTrailLayers.length > 0 && (
        <calcite-block icon-end="walking" heading="Can I access it?" expanded>
          <calcite-list
            label="Roads and trails"
            selection-mode="multiple"
            selection-appearance="border"
          >
            {roadAndTrailLayers.map((layer) => {
              const layerColor = getLayerColor(layer);
              const isSelected = activeRoadTrailLayerIds.includes(layer.id);

              return (
                <calcite-list-item
                  key={layer.id}
                  label={layer.title ?? 'USFS layer'}
                  value={layer.id}
                  selected={isSelected}
                  oncalciteListItemSelect={handleRoadTrailSelection}
                  style={{
                    '--calcite-list-selection-border-color': layerColor,
                  }}
                >
                  {layerColor && (
                    <div
                      slot="content-end"
                      style={{
                        width: '1rem',
                        height: '1rem',
                        borderRadius: '999px',
                        backgroundColor: isSelected
                          ? layerColor
                          : 'transparent',
                        borderColor: isSelected ? 'transparent' : layerColor,
                        border: '1px solid transparent',
                      }}
                    ></div>
                  )}
                </calcite-list-item>
              );
            })}
          </calcite-list>
        </calcite-block>
      )}
    </calcite-panel>
  );
}
