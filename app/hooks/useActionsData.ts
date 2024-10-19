import {useEffect, useState} from 'react';
import {Data, ScatterData} from 'plotly.js';
import {parseCsvData} from '@/app/lib/csv/actionCsvParser';
import {ImageToggleItem, LayoutWithNamedImage} from '@/types';
import {actionsDictionary} from '@/app/ui/components/constants';

const files = [
  'vj6wm2c30u3qqk5kbuj9v/timeline-multiplayer-06102024.csv?rlkey=ztegai6tskj3jgbxjbwz5l393&st=ofuo2z4c&dl=0',
  'tjl0wfx0nebdkx0w7al6w/timeline-multiplayer-08052024.csv?rlkey=kh4h2s09ombtkbu1iqpp6b7pg&st=b9hozrus&dl=0',
  '6os941r9qnk19nkd22415/timeline-multiplayer-09182024.csv?rlkey=4lpfpmkf62fnua597t7bh3p17&st=1v2zw6n3&dl=0',
  '1ls2txjhf6y1yqeab37i9/timeline-multiplayer-09302024.csv?rlkey=3opuazpyvp606md15pnjaxm3q&st=dvi2kwwd&dl=0'
];

const fileLink = `https://dl.dropboxusercontent.com/scl/fi/${files[2]}`;

export const useActionsData = () => {
  const [actionGroupIcons, setActionGroupIcons] = useState<ImageToggleItem[]>([]);
  const [actionsData, setActionsData] = useState<Data[]>([]);
  const [actionsLayout, setActionsLayout] = useState<LayoutWithNamedImage>({images: []});

  useEffect(() => {
    parseCsvData(fileLink, (plotData, layoutConfig, actionGroupIconMap) => {
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

  const filterActionsData = (
    plotData: Data[],
    layoutConfig: LayoutWithNamedImage,
    selectedActionGroups: string[]
  ): {plotData: Data[]; layoutConfig: LayoutWithNamedImage} => {
    if (!plotData[0]) {
      return {plotData: [], layoutConfig: {images: []}};
    }

    const actionsScatterData = plotData[0] as ScatterData;
    const selectedActions = actionsDictionary.getActionNamesByGroups(selectedActionGroups);

    const filtered = actionsScatterData.customdata.reduce(
      (acc, value) => {
        if (selectedActions.includes(value as string)) {
          acc.textColor.push('rgba(0,0,0,1)');
          acc.hoverinfo.push('text');
          acc.opacity.push(1);
        } else {
          acc.textColor.push('rgba(0,0,0,0)');
          acc.hoverinfo.push('none');
          acc.opacity.push(0);
        }
        return acc;
      },
      {textColor: [] as string[], opacity: [] as number[], hoverinfo: [] as string[]}
    );

    return {
      plotData: [
        {
          ...actionsScatterData,
          marker: {
            ...actionsScatterData.marker,
            color: actionsScatterData.marker?.color,
            opacity: filtered.opacity
          },
          textfont: {
            ...actionsScatterData.textfont,
            color: filtered.textColor
          },
          // plotly.js doesn't give a mechanism to hide hovertext on a per-point basis but the below seemed to
          // work even when typescript type didn't allow and documentation didn't state. That means we can get rid off
          // ref variable to store initial state of scatterData and create a filtered set from it or replace fields within it to update the state.
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          hoverinfo: filtered.hoverinfo
        },
        ...plotData.slice(1)
      ],
      layoutConfig: {
        ...layoutConfig,
        images: layoutConfig.images.map((image, idx) => {
          return (image.y as number) > 0 ? {...image, opacity: filtered.opacity[idx]} : image;
        })
      }
    };
  };

  return {actionsData, actionsLayout, actionGroupIcons, updateActionsData};
};
