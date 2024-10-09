import {Image, Layout} from 'plotly.js';
import {explanationItems} from '@/app/ui/components/constants';

export type ImageWithName = Image & {
    name: string;
};

export type LayoutWithNamedImage = Omit<Layout, 'images'> & {
    images: Partial<ImageWithName>[];
};


export interface ImageToggleProps{
  iconUrl: string;
  text: string;
  isChecked: boolean;
  onToggle: () => void;
}

export interface ToggleGridProps {
  allItems: typeof explanationItems;
  selectedItems: string[];
  onSelectAll: (selectAll: boolean) => void;
  onToggleMarker: (markers: string[]) => void;
}
