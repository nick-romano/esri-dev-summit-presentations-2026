import '@arcgis/map-components/components/arcgis-map';
import '@arcgis/map-components/components/arcgis-elevation-profile';
import '@arcgis/map-components/components/arcgis-zoom';
import '@esri/calcite-components/components/calcite-shell';
import '@esri/calcite-components/components/calcite-navigation';
import '@esri/calcite-components/components/calcite-navigation-logo';
import '@esri/calcite-components/components/calcite-action';
import '@esri/calcite-components/components/calcite-sheet';

import { LayersPanel } from './components/LayersPanel';
import { MorelPanel } from './components/MorelPanel';
import { useLayersActions } from './context/LayersContext';
import { useResultsActions } from './context/ResultsContext';
import { useUIActions, useUIState } from './context/UIContext';

const mapItemId = 'ecaf67baea484e99b1b499131ae8e179';

export function App(): React.JSX.Element {
  const { handleViewReady } = useLayersActions();
  const { handleMapClick, registerElevationProfileElement } =
    useResultsActions();
  const { isSmallScreen, isFiltersSheetOpen } = useUIState();
  const { openFilters, closeFilters } = useUIActions();

  return (
    // The Shell component is used as a layout for this template
    <calcite-shell content-behind>
      <calcite-navigation slot="header">
        {/* Heading and description dynamically populated */}
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
        onarcgisViewClick={handleMapClick}
        popup-disabled
        ground="world-elevation"
      >
        {!isSmallScreen && (
          <div slot="top-left">
            <LayersPanel />
          </div>
        )}
        <div slot="top-right">
          <MorelPanel />
        </div>
        <arcgis-zoom slot="bottom-right" />

        {/* Hidden elevation-profile component used for elevation sampling on click. */}
        <arcgis-elevation-profile
          className="elevation-profile-hidden"
          referenceElement="morel-map"
          distanceUnit="imperial"
          elevationUnit="imperial"
          slot="bottom-right"
          hideChart
          hideLegend
          hideSettingsButton
          hideSelectButton
          hideStartButton
          hideClearButton
          hideVisualization
          ref={registerElevationProfileElement}
        ></arcgis-elevation-profile>
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
