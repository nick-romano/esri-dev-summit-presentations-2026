import type FeatureLayer from '@arcgis/core/layers/FeatureLayer';

type RendererSymbol = {
  color?: unknown;
  outline?: { color?: unknown };
};

type RendererLike = {
  symbol?: RendererSymbol;
  defaultSymbol?: RendererSymbol;
  uniqueValueInfos?: { symbol?: RendererSymbol }[];
};

export function getLayerColor(layer: FeatureLayer): string | undefined {
  const renderer = (layer as { renderer?: RendererLike }).renderer;

  if (!renderer) {
    return undefined;
  }

  const symbol =
    renderer.symbol ??
    renderer.defaultSymbol ??
    renderer.uniqueValueInfos?.[0]?.symbol;

  const color = symbol?.color ?? symbol?.outline?.color;

  const colorWithToCss = color as {
    toCss?: (includeAlpha?: boolean) => string;
  } | null;

  if (!colorWithToCss || typeof colorWithToCss.toCss !== 'function') {
    return undefined;
  }

  return colorWithToCss.toCss(true);
}

export function isPerimeterLayer(layer: FeatureLayer): boolean {
  const title = (layer.title ?? '').toLowerCase();
  return title.includes('fireoccurrence');
}

export function isRoadLayer(layer: FeatureLayer): boolean {
  const title = (layer.title ?? '').toLowerCase();
  return title.includes('fireclosureline');
}

export function isTrailLayer(layer: FeatureLayer): boolean {
  const title = (layer.title ?? '').toLowerCase();
  return title.includes('trailnfspublish');
}

export function isRecreationSitesLayer(layer: FeatureLayer): boolean {
  const title = (layer.title ?? '').toLowerCase();
  return title.includes('recreationopportunities');
}

export function filterRelevantLayers(layers: FeatureLayer[]): FeatureLayer[] {
  return layers.filter(
    (layer) =>
      isPerimeterLayer(layer) ||
      isRoadLayer(layer) ||
      isTrailLayer(layer) ||
      isRecreationSitesLayer(layer),
  );
}
