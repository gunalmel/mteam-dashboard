import {Image, Layout} from 'plotly.js';

export type ImageWithName = Image & {
    name: string;
};

export type LayoutWithNamedImage = Omit<Layout, 'images'> & {
    images: Partial<ImageWithName>[];
};

export interface ImageToggleProps {
  iconUrl: string;
  text: string;
  isChecked: boolean;
  onToggle: () => void;
}

export interface ToggleGridProps {
  allItems: {url: string, group: string}[];
  selectedItems: string[];
  onSelectAll: (selectAll: boolean) => void;
  onToggleMarker: (marker: string) => void;
}


export interface ActionImage {url: string; name: string; group: string; y: number}
