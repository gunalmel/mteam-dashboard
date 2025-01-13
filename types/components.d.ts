import {PlotMouseEvent} from 'plotly.js';
import {DataSources} from '@/types/data-sources';
import {ButtonHTMLAttributes} from 'react';

interface ImageToggleItem {
  source: string;
  value: string;
}

interface ImageToggleProps extends ImageToggleItem {
  checked: boolean;
  onToggle: (selectedItem: string, selected: boolean) => void;
}

interface ToggleGridProps {
  items: ImageToggleItem[];
  onChange: (selectedItems: string[]) => void;
}

interface FilteredActionsProps {
  onClick: (event: Readonly<PlotMouseEvent>) => void;
  currentTime: number;
}

interface DataSourceSelectorProps {
  dataSources: DataSources,
  selectedDataSource: keyof DataSources;
  onDataSourceChange: (date: string) => void;
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
  label: string;
  position: 'first' | 'middle' | 'last';
  selected: boolean;
}

interface SelectorButtonGroupProps {
  selections: [string, string][];
  selectedValue: string;
  onSelect: (selectedValue: string) => void;
}
