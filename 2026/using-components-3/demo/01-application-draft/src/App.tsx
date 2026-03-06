import '@arcgis/map-components/components/arcgis-map';
import '@arcgis/map-components/components/arcgis-zoom';
import '@esri/calcite-components/components/calcite-shell';
import '@esri/calcite-components/components/calcite-navigation';
import '@esri/calcite-components/components/calcite-navigation-logo';

import { MorelPanel } from './components/MorelPanel';

const mapItemId = 'ecaf67baea484e99b1b499131ae8e179';

export function App(): React.JSX.Element {
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
      <arcgis-map id="morel-map" item-id={mapItemId}>
        <div slot="top-left">top-left slot</div>
        <div slot="top-right">
          <MorelPanel />
        </div>
        <arcgis-zoom slot="bottom-right" />
      </arcgis-map>
    </calcite-shell>
  );
}
