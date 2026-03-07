import '@arcgis/map-components/components/arcgis-map';
import '@arcgis/map-components/components/arcgis-zoom';
import '@esri/calcite-components/components/calcite-navigation';
import '@esri/calcite-components/components/calcite-navigation-logo';
import '@esri/calcite-components/components/calcite-panel';
import '@esri/calcite-components/components/calcite-shell';

const mapItemId = 'ecaf67baea484e99b1b499131ae8e179';
export function App(): React.JSX.Element {
  return (
    <calcite-shell content-behind>
      <calcite-navigation slot="header">
        <calcite-navigation-logo
          heading="Layout plan (slots)"
          description="Placeholder UI showing where pieces will go"
          slot="logo"
        ></calcite-navigation-logo>
      </calcite-navigation>
      <arcgis-map id="morel-map" itemId={mapItemId} ground="world-elevation">
        <div slot="top-left" className="layout-slot">
          <calcite-panel
            heading="Layers (placeholder)"
            className="panel-layers"
          >
            <div className="layout-panel-content">
              <p className="layout-panel-lede">
                This is where we’ll put layer toggles so users can easily turn
                data on/off while exploring the map.
              </p>
              <ul className="layout-panel-list">
                <li>Recent fires</li>
                <li>Elevation bands</li>
                <li>Public lands</li>
                <li>Trails + access points</li>
              </ul>
            </div>
          </calcite-panel>
        </div>

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
    </calcite-shell>
  );
}
