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

export function getFirstTextAttribute(
  attributes: Record<string, unknown> | null | undefined,
  candidateFieldNames: string[],
): string | null {
  if (!attributes) {
    return null;
  }

  for (const fieldName of candidateFieldNames) {
    const raw = attributes[fieldName];
    if (typeof raw === 'string') {
      const trimmed = raw.trim();
      if (trimmed) {
        return trimmed;
      }
    }
  }

  for (const raw of Object.values(attributes)) {
    if (typeof raw === 'string') {
      const trimmed = raw.trim();
      if (trimmed) {
        return trimmed;
      }
    }
  }

  return null;
}

export function formatNameOrUnknown(
  label: string,
  value: string | null,
): string {
  return value ? `${label}: ${value}` : `${label}: Unknown`;
}

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

export function isDriveTimeLayer(layer: FeatureLayer): boolean {
  const title = (layer.title ?? '').toLowerCase();
  return title.includes('2 hours from portland');
}
export function filterRelevantLayers(layers: FeatureLayer[]): FeatureLayer[] {
  return layers.filter(
    (layer) =>
      isPerimeterLayer(layer) ||
      isRoadLayer(layer) ||
      isTrailLayer(layer) ||
      isRecreationSitesLayer(layer) ||
      isDriveTimeLayer(layer),
  );
}

export function computeOutOfScale(
  layersToTrack: { id?: string; minScale?: number; maxScale?: number }[],
  currentScale: number,
): string[] {
  const nextIds: string[] = [];

  layersToTrack.forEach((layer) => {
    const id = layer.id;
    if (!id) {
      return;
    }

    const minScale = layer.minScale ?? 0;
    const maxScale = layer.maxScale ?? 0;

    let isOutOfScale = false;

    if (minScale > 0 && currentScale > minScale) {
      isOutOfScale = true;
    }

    if (maxScale > 0 && currentScale < maxScale) {
      isOutOfScale = true;
    }

    if (isOutOfScale) {
      nextIds.push(id);
    }
  });

  return nextIds;
}

export function handleZoomToNorthwest(): void {
  const mapElement = document.getElementById('morel-map') as
    | (HTMLElement & {
        view?: {
          goTo?: (target: unknown, options?: unknown) => void;
        };
      })
    | null;

  const view = mapElement?.view;
  if (!view || typeof view.goTo !== 'function') {
    return;
  }

  (async () => {
    try {
      const maybe = (view.goTo as unknown as (...args: unknown[]) => unknown)(
        {
          center: [-122, 45.5],
          zoom: 6,
        },
        {
          duration: 3000,
        },
      );

      if (maybe && typeof (maybe as Promise<unknown>).then === 'function') {
        await (maybe as Promise<unknown>);
      }
    } catch {
      // ignore errors when zooming
    }
  })();
}
