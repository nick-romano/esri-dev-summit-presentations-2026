import '@arcgis/map-components/components/arcgis-map';
import '@arcgis/map-components/components/arcgis-zoom';
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
        item-id={mapItemId}
        onarcgisViewReadyChange={handleViewReady}
        popup-disabled
        ground="world-elevation"
      >
        {!isSmallScreen && (
          <div slot="top-left" className="layout-slot">
            <LayersPanel />
          </div>
        )}

        <div slot="top-right" className="layout-slot">
          <calcite-panel
            heading="Nearby info (placeholder)"
            className="panel-right"
          >
            <div className="layout-panel-content">
              <p className="layout-panel-lede">
                This is where we’ll show details about the clicked location.
              </p>
              <ul className="layout-panel-list">
                <li>Fire recency score</li>
                <li>Elevation</li>
                <li>Access via nearby roads/trails</li>
              </ul>
            </div>
          </calcite-panel>
        </div>

        <arcgis-zoom slot="bottom-right" />
      </arcgis-map>

      {isSmallScreen && (
        <calcite-sheet
          label="Map filters"
          position="inline-end"
          open={isFiltersSheetOpen}
          oncalciteSheetClose={closeFilters}
        >
          <LayersPanel />
        </calcite-sheet>
      )}
    </calcite-shell>
  );
}
