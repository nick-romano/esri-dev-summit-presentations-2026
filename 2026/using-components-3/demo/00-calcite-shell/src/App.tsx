// Individual imports for each Map, Chart and Calcite component
import '@arcgis/map-components/components/arcgis-map';
import '@arcgis/map-components/components/arcgis-zoom';
import '@esri/calcite-components/components/calcite-shell';
import '@esri/calcite-components/components/calcite-shell-panel';
import '@esri/calcite-components/components/calcite-block';
import '@esri/calcite-components/components/calcite-navigation';
import '@esri/calcite-components/components/calcite-navigation-logo';
import '@esri/calcite-components/components/calcite-action';
import '@esri/calcite-components/components/calcite-sheet';
import '@esri/calcite-components/components/calcite-alert';

const mapItemId = 'ecaf67baea484e99b1b499131ae8e179';

export function App(): React.JSX.Element {
  return (
    // The Shell component is used as a layout for this template
    <calcite-shell content-behind>
      <calcite-navigation slot="header">
        {/* Heading and description dynamically populated */}
        <calcite-navigation-logo
          heading="Title!"
          description="Description"
          slot="logo"
        ></calcite-navigation-logo>
      </calcite-navigation>
      {/* <calcite-shell-panel
        slot="panel-start"
      >
        <calcite-panel heading="Left Panel">
          <calcite-block
            collapsible
            heading="Symbology"
            description="Select type, color, and transparency"
            icon-start="map-pin"
          >
          </calcite-block>
        </calcite-panel>
      </calcite-shell-panel> */}
      {/* The Map component fits to the size of the parent element  */}
      {/* <arcgis-map item-id={mapItemId}></arcgis-map> */}
      {/* <calcite-alert slot="alerts" icon="rangefinder" kind="brand" open label="A report alert">
        <div slot="title">Alert! Alert! </div>
    </calcite-alert>
    <calcite-alert slot="alerts" icon="rangefinder" kind="danger" open label="A report alert">
        <div slot="title">Alert! Alert! </div>
    </calcite-alert>
    <calcite-alert slot="alerts" icon="rangefinder" kind="warning" open label="A report alert">
        <div slot="title">Alert! Alert! </div>
    </calcite-alert> */}
    </calcite-shell>
  );
}
