import '@esri/calcite-components/components/calcite-meter';
import '@esri/calcite-components/components/calcite-tile';
import '@esri/calcite-components/components/calcite-button';

import type React from 'react';

type CalciteTileIcon = React.JSX.IntrinsicElements['calcite-tile']['icon'];

export type MorelTileMeterProps = {
  label: string;
  min: number;
  max: number;
  value: number | null | undefined;
  placeholder?: React.ReactNode;
  className?: string;
};

export type MorelTileProps = {
  heading: string;
  icon: Exclude<CalciteTileIcon, undefined>;
  description?: string;
  className?: string;
  blurb?: React.ReactNode;
  meter?: MorelTileMeterProps;
  action?: {
    label: string;
    onClick: () => void;
    disabled?: boolean;
  };
  children?: React.ReactNode;
};

export function MorelTile({
  heading,
  icon,
  description,
  className,
  blurb,
  meter,
  action,
  children,
}: MorelTileProps): React.JSX.Element {
  return (
    <calcite-tile
      className={className}
      icon={icon}
      description={description}
      heading={heading}
    >
      {blurb != null ? (
        <div className="big-number" slot="content-top">
          {blurb}
        </div>
      ) : null}

      {meter ? (
        meter.value == null ? (
          <div className="big-number" slot="content-top">
            {meter.placeholder ?? '—'}
          </div>
        ) : (
          <calcite-meter
            scale="s"
            className={meter.className}
            slot="content-top"
            label={meter.label}
            min={meter.min}
            max={meter.max}
            value={meter.value}
          ></calcite-meter>
        )
      ) : null}

      {action ? (
        <calcite-button
          slot="content-bottom"
          appearance="outline"
          scale="s"
          width="full"
          disabled={action.disabled}
          onClick={action.onClick}
        >
          {action.label}
        </calcite-button>
      ) : null}

      {children}
    </calcite-tile>
  );
}
