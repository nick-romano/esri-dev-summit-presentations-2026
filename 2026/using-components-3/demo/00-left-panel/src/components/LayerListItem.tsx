import type { CSSProperties, ReactNode } from 'react';

export type LayerListItemProps = {
  itemKey: React.Key;
  label: string;
  value: number | string;
  selected: boolean;
  disabled: boolean;
  onSelect: (event: CustomEvent) => void;
  borderColor?: string | null;
  iconEnd?: string;
  children?: ReactNode;
};

export function LayerListItem({
  itemKey,
  label,
  value,
  selected,
  disabled,
  onSelect,
  borderColor,
  iconEnd,
  children,
}: Readonly<LayerListItemProps>): React.JSX.Element {
  return (
    <calcite-list-item
      key={itemKey}
      label={label}
      value={value}
      selected={selected}
      disabled={disabled}
      oncalciteListItemSelect={onSelect}
      icon-end={iconEnd}
      style={
        {
          '--calcite-list-selection-border-color': borderColor,
        } as CSSProperties
      }
    >
      {children}
    </calcite-list-item>
  );
}
