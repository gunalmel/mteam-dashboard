import {PlotMouseEvent} from 'plotly.js';

export interface ImageToggleItem {
  source: string;
  value: string;
}

export interface ImageToggleProps extends ImageToggleItem {
  checked: boolean;
  onToggle: (selectedItem: string, selected: boolean) => void;
}

export interface ToggleGridProps {
  items: ImageToggleItem[];
  onChange: (selectedItems: string[]) => void;
}

export interface FilteredActionsProps {
  onClick: (event: Readonly<PlotMouseEvent>) => void;
  currentTime: number;
}
