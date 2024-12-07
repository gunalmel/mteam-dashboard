import {Image, Layout, PlotMouseEvent} from 'plotly.js';

export type ImageWithName = Image & {
  name: string;
};

export type LayoutWithNamedImage = Omit<Partial<Layout>, 'images'> & {
  images: Partial<ImageWithName>[];
};

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

export interface ActionImage {
  url: string;
  name: string;
  group: string;
  y: number;
}
export interface GazeData {
  time: number; // Unix timestamp in seconds
  category?: string|null;
  object?: string|null;
}

export interface GazeDataStack {
  time: string;
  counts: Record<GazeData.category, number>;
  totalCount: number;
}
