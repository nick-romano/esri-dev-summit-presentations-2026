import { useEffect, useState } from 'react';

// Individual imports for each Map, Chart and Calcite component
import '@arcgis/map-components/components/arcgis-map';
import '@arcgis/map-components/components/arcgis-zoom';
import '@esri/calcite-components/components/calcite-shell';
import '@esri/calcite-components/components/calcite-navigation';
import '@esri/calcite-components/components/calcite-navigation-logo';

import {
  getAccessAtPoint,
  getBurnStatusAtPoint,
  filterRelevantLayers,
  isPerimeterLayer,
  isRoadLayer,
  isTrailLayer,
} from './utils/mapUtils';

import type WebMap from '@arcgis/core/WebMap';
import type FeatureLayer from '@arcgis/core/layers/FeatureLayer';

import { LayersPanel } from './components/LayersPanel';
import { MorelPanel } from './components/MorelPanel';

const FIREYEARS = [2025, 2024, 2023, 2022, 2021, 2020];

export function App(): React.JSX.Element {
  const [featureLayers, setFeatureLayers] = useState<FeatureLayer[]>([]);
  const [activeFireYears, setActiveFireYears] = useState<number[]>([
    ...FIREYEARS,
  ]);
  const [activeRoadTrailLayerIds, setActiveRoadTrailLayerIds] = useState<
    string[]
  >([]);
  const [burnStatusValue, setBurnStatusValue] = useState(0);
  const [burnStatusLabel, setBurnStatusLabel] = useState('Tap map');
  const [elevationValue, setElevationValue] = useState<number | null>(null);
  const [suitabilityValue, setSuitabilityValue] = useState(0);
  const [suitabilityLabel, setSuitabilityLabel] = useState('Tap map');
  const [burnDetail, setBurnDetail] = useState(
    'Click the map to see burn history.',
  );
  const [accessDetail, setAccessDetail] = useState(
    'Click the map to see distance to closure lines.',
  );

  const handleViewReady = (event: CustomEvent): void => {
    const viewElement = event.target as HTMLArcgisMapElement;
    const map = viewElement.map as WebMap;
    const layers = map.allLayers.filter(
      (layer): layer is FeatureLayer => layer.type === 'feature',
    );

    const filteredLayers = filterRelevantLayers(layers.toArray());
    setFeatureLayers(filteredLayers);

    const initialRoadTrailIds = filteredLayers
      .filter((layer) => isRoadLayer(layer) || isTrailLayer(layer))
      .map((layer) => layer.id);
    setActiveRoadTrailLayerIds(initialRoadTrailIds);
  };

  const handleFireYearSelection = (event: CustomEvent): void => {
    const item = event.target as HTMLCalciteListItemElement | null;

    if (!item) {
      return;
    }

    const yearNumber = Number(item.value);
    if (!yearNumber || Number.isNaN(yearNumber)) {
      return;
    }

    setActiveFireYears((currentYears) => {
      const exists = currentYears.includes(yearNumber);
      const nextYears = exists
        ? currentYears.filter((year) => year !== yearNumber)
        : [...currentYears, yearNumber];

      item.selected = !exists;
      return nextYears;
    });
  };

  const handleListSelection = (event: CustomEvent): void => {
    const item = event.target as HTMLCalciteListItemElement | null;

    if (!item) {
      return;
    }

    const id = String(item.value ?? '');

    if (!id) {
      return;
    }

    setActiveRoadTrailLayerIds((current) => {
      const exists = current.includes(id);
      const next = exists
        ? current.filter((layerId) => layerId !== id)
        : [...current, id];

      item.selected = !exists;
      return next;
    });
  };

  const perimeterLayers = featureLayers.filter((layer) =>
    isPerimeterLayer(layer),
  );

  const roadClosureLayers = featureLayers.filter((layer) => isRoadLayer(layer));

  const roadAndTrailLayers = featureLayers.filter(
    (layer) => isRoadLayer(layer) || isTrailLayer(layer),
  );

  const handleMapClick = async (
    event: HTMLArcgisMapElement['arcgisViewClick'],
  ): Promise<void> => {
    const mapPoint = event.detail.mapPoint;

    // Burn status: whether click is inside any final fire perimeter
    const burnStatus = await getBurnStatusAtPoint(mapPoint, perimeterLayers);
    setBurnStatusValue(burnStatus.score);
    setBurnStatusLabel(burnStatus.label);
    setBurnDetail(burnStatus.detail);

    // 2) Elevation todo
    setElevationValue(null);

    // 3) Suitability based on proximity to closure lines (no score meter)
    const accessStatus = await getAccessAtPoint(mapPoint, roadClosureLayers);
    setSuitabilityValue(accessStatus.score);
    setSuitabilityLabel(accessStatus.label);
    setAccessDetail(accessStatus.detail);

    // todo find a "suitability score" for all three (or whatever number of) factors
  };

  useEffect(() => {
    const years = activeFireYears.sort((a, b) => a - b);
    featureLayers
      .filter((layer) => isPerimeterLayer(layer))
      .forEach((layer) => {
        if (years.length === 0) {
          layer.visible = false;
          layer.definitionExpression = '1 = 0';
        } else {
          layer.visible = true;
          const yearList = years.join(',');
          layer.definitionExpression = `FIREYEAR IN (${yearList})`;
        }
      });
  }, [featureLayers, activeFireYears]);

  useEffect(() => {
    featureLayers
      .filter((layer) => isRoadLayer(layer) || isTrailLayer(layer))
      .forEach((layer) => {
        layer.visible = activeRoadTrailLayerIds.includes(layer.id);
      });
  }, [featureLayers, activeRoadTrailLayerIds]);

  return (
    // The Shell component is used as a layout for this template
    <calcite-shell>
      <calcite-navigation slot="header">
        {/* Heading and description dynamically populated */}
        <calcite-navigation-logo
          heading="Morel of the Story"
          description="Potential gathering spots"
          slot="logo"
        ></calcite-navigation-logo>
      </calcite-navigation>
      {/* The Map component fits to the size of the parent element  */}
      <arcgis-map
        item-id="ecaf67baea484e99b1b499131ae8e179"
        onarcgisViewReadyChange={handleViewReady}
        onarcgisViewClick={handleMapClick}
      >
        <arcgis-zoom slot="top-left" />
        {/* We'll use the map slots to position additional components */}
        <div slot="bottom-right">
          <LayersPanel
            fireYears={FIREYEARS}
            activeFireYears={activeFireYears}
            onFireYearSelect={handleFireYearSelection}
            roadAndTrailLayers={roadAndTrailLayers}
            activeRoadTrailLayerIds={activeRoadTrailLayerIds}
            onRoadTrailSelect={handleListSelection}
          />
        </div>
        <div slot="top-right">
          <MorelPanel
            burnStatusLabel={burnStatusLabel}
            burnStatusValue={burnStatusValue}
            burnDetail={burnDetail}
            elevationValue={elevationValue}
            suitabilityLabel={suitabilityLabel}
            suitabilityValue={suitabilityValue}
            accessDetail={accessDetail}
          />
        </div>
      </arcgis-map>
    </calcite-shell>
  );
}
