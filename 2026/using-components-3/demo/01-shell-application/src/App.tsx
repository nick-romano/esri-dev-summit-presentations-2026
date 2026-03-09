// Individual imports for each Map, Chart and Calcite component
import '@arcgis/map-components/components/arcgis-map';
import '@arcgis/map-components/components/arcgis-elevation-profile';
import '@arcgis/map-components/components/arcgis-features';
import '@esri/calcite-components/components/calcite-shell';
import '@esri/calcite-components/components/calcite-navigation';
import '@esri/calcite-components/components/calcite-navigation-logo';
import '@esri/calcite-components/components/calcite-action';
import '@esri/calcite-components/components/calcite-sheet';
import '@esri/calcite-components/components/calcite-shell-panel';

import { useLayersActions } from './context/LayersContext';
import { useResultsActions } from './context/ResultsContext';
import { useUIActions, useUIState } from './context/UIContext';

import { LayersPanel } from './components/LayersPanel';
import { MorelPanel } from './components/MorelPanel';
import { DisclaimerNotice } from './components/DisclaimerNotice';

const mapItemId = 'ecaf67baea484e99b1b499131ae8e179';
export function App(): React.JSX.Element {
  const { handleViewReady } = useLayersActions();
  const { handleMapClick, registerElevationProfileElement } =
    useResultsActions();
  const { isSmallScreen, isPopupOpen } = useUIState();
  const { handleFeaturesSheetClose } = useUIActions();
  return (
    // The Shell component is used as a layout for this template
    <calcite-shell>
      <calcite-navigation slot="header">
        <calcite-navigation-logo
          heading="Morel of the Story"
          description="Potential gathering spots"
          slot="logo"
        ></calcite-navigation-logo>
      </calcite-navigation>
      {/* The Map component fits to the size of the parent element  */}
      <arcgis-map
        id="morel-map"
        itemId={mapItemId}
        onarcgisViewReadyChange={handleViewReady}
        onarcgisViewClick={handleMapClick}
        popupDisabled
        ground="world-elevation"
      >
        {/* We'll use the map slots to position additional components */}
        {!isSmallScreen && (
          <div slot="top-left">
            <LayersPanel />
          </div>
        )}

        <div slot="top-right">
          <MorelPanel />
        </div>

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
        <calcite-shell-panel label="Map filters" slot="panel-top">
          <LayersPanel />
        </calcite-shell-panel>
      )}

      {isSmallScreen && (
        <calcite-panel slot="footer">
          <DisclaimerNotice />
        </calcite-panel>
      )}

      <calcite-sheet
        resizable
        label="popup"
        open={isPopupOpen}
        slot="sheets"
        oncalciteSheetClose={handleFeaturesSheetClose}
      >
        <calcite-panel heading="Morel Details 🍄" className="popup-panel">
          <div className="popup-content" id="popup-content">
            <arcgis-features
              referenceElement="morel-map"
              hideCloseButton
              highlightDisabled
            ></arcgis-features>
          </div>
        </calcite-panel>
      </calcite-sheet>
    </calcite-shell>
  );
}
