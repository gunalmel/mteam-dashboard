import {useEffect, useState} from 'react';
import {Data} from 'plotly.js';
import {parseCsvData} from '@/app/lib/csv/actionCsvParser';
import {ImageToggleItem, LayoutWithNamedImage} from '@/types';
import PlotsFileSource from '@/app/utils/plotSourceProvider';
import {filterActionsData} from '@/app/lib/filterActionsData';

export const useActionsData = () => {
  const [actionGroupIcons, setActionGroupIcons] = useState<ImageToggleItem[]>([]);
  const [actionsData, setActionsData] = useState<Data[]>([]);
  const [actionsLayout, setActionsLayout] = useState<LayoutWithNamedImage>({images: []});

  useEffect(() => {
    parseCsvData(PlotsFileSource.actions['09182024'].url, (plotData, layoutConfig, actionGroupIconMap) => {
      setActionGroupIcons(Object.entries(actionGroupIconMap).map((entry) => ({value: entry[0], source: entry[1]})));
      setActionsData(plotData);
      setActionsLayout(layoutConfig);
    });
  }, []);

  const updateActionsData = (selectedMarkers: string[]) => {
    const filteredData = filterActionsData(actionsData, actionsLayout, selectedMarkers);

    setActionsData(filteredData.plotData);
    setActionsLayout(filteredData.layoutConfig);
  };

  return {actionsData, actionsLayout, actionGroupIcons, updateActionsData};
};
