import '@arcgis/map-components/components/arcgis-map';
import '@esri/calcite-components/components/calcite-navigation';
import '@esri/calcite-components/components/calcite-navigation-logo';
import '@esri/calcite-components/components/calcite-action';
import '@esri/calcite-components/components/calcite-panel';
import '@esri/calcite-components/components/calcite-sheet';
import '@esri/calcite-components/components/calcite-shell';

import { LayersPanel } from './components/LayersPanel';
import { useLayersActions } from './context/LayersContext';
import { useUIActions, useUIState } from './context/UIContext';

const mapItemId = 'ecaf67baea484e99b1b499131ae8e179';
export function App(): React.JSX.Element {
  const { handleViewReady } = useLayersActions();
  const { isSmallScreen, isFiltersSheetOpen } = useUIState();
  const { openFilters, closeFilters } = useUIActions();

  return (
    <calcite-shell content-behind>
      <calcite-navigation slot="header">
        <calcite-navigation-logo
          heading="Morel of the Story"
          description="Potential gathering spots"
          slot="logo"
        ></calcite-navigation-logo>

        {isSmallScreen && (
          <calcite-action
            slot="content-end"
            icon="gear"
            text="Filters"
            onClick={openFilters}
          ></calcite-action>
        )}
      </calcite-navigation>
      <arcgis-map
        id="morel-map"
        itemId={mapItemId}
        onarcgisViewReadyChange={handleViewReady}
        ground="world-elevation"
      >
        {!isSmallScreen && (
          <div slot="top-left" className="layout-slot">
            <LayersPanel />
          </div>
        )}

        <calcite-panel
          heading="Top Right Slot"
          icon="dock-right"
          className="content-panel"
          slot="top-right"
        >
          <calcite-notice open slot="content-top">
            <div slot="message">
              We'll populate this slot with content in the next step
            </div>
          </calcite-notice>
          <ul>
            <li>Fire recency</li>
            <li>Elevation</li>
            <li>Trail access</li>
          </ul>
        </calcite-panel>
      </arcgis-map>

      {isSmallScreen && (
        <calcite-sheet
          label="Map filters"
          position="block-end"
          open={isFiltersSheetOpen}
          oncalciteSheetClose={closeFilters}
        >
          <LayersPanel />
        </calcite-sheet>
      )}
    </calcite-shell>
  );
}
