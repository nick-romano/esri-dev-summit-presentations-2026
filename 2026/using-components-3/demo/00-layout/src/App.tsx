import '@arcgis/map-components/components/arcgis-map';
import '@esri/calcite-components/components/calcite-navigation';
import '@esri/calcite-components/components/calcite-navigation-logo';
import '@esri/calcite-components/components/calcite-panel';
import '@esri/calcite-components/components/calcite-shell';
import { useState } from 'react';

const mapItemId = '20398bf380294ec49cea316c51ea8fc4';

export function App(): React.JSX.Element {
  /* Demo toggle */
  const [demoStep] = useState<1 | 2>(1);

  return (
    <calcite-shell className={`demo-step-${demoStep}`}>
      {/* Shell - Header Slot  */}
      <calcite-navigation slot="header">
        {/* Navigation - Logo Slot  */}
        <calcite-navigation-logo
          heading="App layout"
          description="Navigation Logo"
          icon="ungroup-layout-elements"
          slot="logo"
        ></calcite-navigation-logo>
      </calcite-navigation>

      {/* Shell - Default Content Slot  */}
      <arcgis-map id="morel-map" itemId={mapItemId} ground="world-elevation">
        {/* Map Top Left Slot  */}
        <calcite-panel
          collapsible
          heading="Top Left Slot"
          icon="dock-left"
          className="content-panel"
          slot="top-left"
        >
          <calcite-notice open slot="content-top">
            <div slot="message">
              We'll populate this slot with content in the next step
            </div>
          </calcite-notice>
          <ul>
            <li>Historical fire boundaries</li>
            <li>Public trails</li>
            <li>Trail closures</li>
            <li>Trailheads and campsites</li>
            <li>Drive time from Portland</li>
          </ul>
        </calcite-panel>

        {/* Map Top Right Slot  */}
        <calcite-panel
          collapsible
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
    </calcite-shell>
  );
}
