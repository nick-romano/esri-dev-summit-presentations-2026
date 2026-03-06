import '@arcgis/map-components/components/arcgis-map';
import '@arcgis/map-components/components/arcgis-elevation-profile';
import '@arcgis/map-components/components/arcgis-zoom';
import '@esri/calcite-components/components/calcite-shell';
import '@esri/calcite-components/components/calcite-navigation';
import '@esri/calcite-components/components/calcite-navigation-logo';

import { LayersPanel } from './components/LayersPanel';
import { MorelPanel } from './components/MorelPanel';
import { useLayersActions } from './context/LayersContext';
import { useResultsActions } from './context/ResultsContext';

const mapItemId = 'ecaf67baea484e99b1b499131ae8e179';

export function App(): React.JSX.Element {
  const { handleViewReady } = useLayersActions();
  const { handleMapClick, registerElevationProfileElement } =
    useResultsActions();

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
      </calcite-navigation>
      <arcgis-map
        id="morel-map"
        item-id={mapItemId}
        onarcgisViewReadyChange={handleViewReady}
        onarcgisViewClick={handleMapClick}
        popup-disabled
        ground="world-elevation"
      >
        <div slot="top-left">
          <LayersPanel />
        </div>
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
    </calcite-shell>
  );
}
