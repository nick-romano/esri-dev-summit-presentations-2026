import '@arcgis/map-components/components/arcgis-map';
import '@esri/calcite-components/components/calcite-navigation';
import '@esri/calcite-components/components/calcite-navigation-logo';
import '@esri/calcite-components/components/calcite-action';
import '@esri/calcite-components/components/calcite-popover';
import '@esri/calcite-components/components/calcite-panel';
import '@esri/calcite-components/components/calcite-shell';
import '@esri/calcite-components/components/calcite-shell-panel';
import { LayersPanel } from './components/LayersPanel';
import { useLayersActions } from './context/LayersContext';
import { useUIState } from './context/UIContext';
import { useState } from 'react';
import { DisclaimerNotice } from './components/DisclaimerNotice';

const mapItemId = 'ecaf67baea484e99b1b499131ae8e179';

export function App(): React.JSX.Element {
  const { handleViewReady } = useLayersActions();

  /* Toggle for changing view */
  const { isSmallScreen } = useUIState();

  /* Demo toggle */
  const [demoStep] = useState<1 | 2 | 3 | 4>(1);

  return (
    <calcite-shell className={`demo-step-${demoStep}`}>
      {/* Shell - Header Slot  */}
      <calcite-navigation slot="header">
        {/* Navigation - Logo Slot  */}
        <calcite-navigation-logo
          heading="Morel of the Story"
          description="Potential gathering spots"
          slot="logo"
        ></calcite-navigation-logo>
      </calcite-navigation>

      {/* Shell - Default Content Slot  */}
      <arcgis-map
        id="morel-map"
        itemId={mapItemId}
        onarcgisViewReadyChange={handleViewReady}
        ground="world-elevation"
      >
        {/* Map Top Left Slot  */}
        {demoStep >= 3 && !isSmallScreen && (
          <div slot="top-left" className="layout-slot">
            <LayersPanel />
          </div>
        )}

        {(demoStep === 1 || (demoStep === 2 && !isSmallScreen)) && (
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
        )}

        {/* Map Top Right Slot  */}
        <calcite-panel
          heading="Top Right Slot"
          icon="dock-right"
          className="content-panel"
          slot="top-right"
          collapsible
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

      {/* Shell Panel Top Slot  */}
      {demoStep === 2 && isSmallScreen && (
        <calcite-shell-panel label="Map filters" slot="panel-top">
          <calcite-panel heading="Content Top Slot" icon="maximize" collapsible>
            <calcite-notice open slot="content-top" width="full">
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
        </calcite-shell-panel>
      )}

      {demoStep >= 3 && isSmallScreen && (
        <calcite-shell-panel label="Map filters" slot="panel-top">
          <LayersPanel />
        </calcite-shell-panel>
      )}

      {/* Shell Panel Bottom Slot  */}
      {demoStep >= 3 && isSmallScreen && (
        <calcite-panel slot="footer">
          <DisclaimerNotice />
        </calcite-panel>
      )}
    </calcite-shell>
  );
}
