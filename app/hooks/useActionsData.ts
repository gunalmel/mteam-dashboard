import {useEffect, useRef, useState} from 'react';
import {Layout, ScatterData} from 'plotly.js';
import {parseCsvData} from '@/app/lib/csv/actionCsvParser';
import {LayoutWithNamedImage} from '@/types';
import {ACTION_GROUP_MAP} from '@/app/ui/components/constants';
import {PlotlyScatterData} from '@/app/utils/plotly/PlotlyScatterData';

const files = [
  'vj6wm2c30u3qqk5kbuj9v/timeline-multiplayer-06102024.csv?rlkey=ztegai6tskj3jgbxjbwz5l393&st=ofuo2z4c&dl=0',
  'tjl0wfx0nebdkx0w7al6w/timeline-multiplayer-08052024.csv?rlkey=kh4h2s09ombtkbu1iqpp6b7pg&st=b9hozrus&dl=0',
  '6os941r9qnk19nkd22415/timeline-multiplayer-09182024.csv?rlkey=4lpfpmkf62fnua597t7bh3p17&st=1v2zw6n3&dl=0',
  '1ls2txjhf6y1yqeab37i9/timeline-multiplayer-09302024.csv?rlkey=3opuazpyvp606md15pnjaxm3q&st=dvi2kwwd&dl=0'
];

const fileLink = `https://dl.dropboxusercontent.com/scl/fi/${files[2]}`;

export const useActionsData = (selectedActionGroups: string[]) => {
  const [actionsData, setActionsData] = useState<Partial<ScatterData>[]>([]);
  const [actionsLayout, setActionsLayout] = useState<Partial<Layout>>({});
  const [distinctActionsTaken, setDistinctActionsTaken] = useState<{url: string, group: string}[]>([]);

  const parsedDataRef = useRef<{
    plotData: Partial<ScatterData>[];
    layoutConfig: Partial<LayoutWithNamedImage>;
    distinctActionsTaken: {url: string, group: string}[]
  }>({plotData: [], layoutConfig: {}, distinctActionsTaken: []});

  useEffect(() => {
    parseCsvData(
      fileLink,
      (plotData, layoutConfig, distinctActionsTaken) => {
        parsedDataRef.current = {
          plotData,
          layoutConfig,
          distinctActionsTaken
        };
        setActionsData(plotData);
        setActionsLayout(layoutConfig);
        setDistinctActionsTaken(distinctActionsTaken);
      }
    );
  }, []);

  useEffect(() => {
    if (parsedDataRef.current.plotData && parsedDataRef.current.plotData.length > 0) {
      updateActionsData(
        parsedDataRef.current.plotData,
        parsedDataRef.current.layoutConfig,
        selectedActionGroups
      );
    }
  }, [selectedActionGroups]);

  const updateActionsData = (
    plotData: Partial<ScatterData>[],
    layoutConfig: Partial<LayoutWithNamedImage>,
    selectedMarkers: string[]
  ) => {
    const filteredData = filterActionsData(plotData, layoutConfig, selectedMarkers);

    setActionsData(filteredData.plotData);
    setActionsLayout({...filteredData.layoutConfig, images: filteredData.layoutConfig.images});
  };

  const filterActionsData = (plotData: Partial<ScatterData>[],
                             layoutConfig: Partial<LayoutWithNamedImage>,
                             filterActionGroups: string[]):
    {plotData: Partial<ScatterData>[]; layoutConfig: Partial<Layout>} => {
    const [actionsScatterData, errorScatterData] = plotData;
    const {
      x = [], y = [], text = [],
      customdata = [], hovertext = [], marker = {color: []}
    } = actionsScatterData;

    const selectedActions = filterActionGroups.flatMap(group => ACTION_GROUP_MAP[group].actions);

    if (!x || !y) {
      return {plotData: [], layoutConfig: {}};
    }

    const filtered = customdata.reduce<{
      x: string[],
      y: number[],
      customdata: string[],
      text: string[],
      hovertext: string[],
      color: string[]
    }>((acc, value, index) => {
      if (selectedActions.includes(value as string)) {
        acc.x.push(x[index] as string);
        acc.y.push(y[index] as number);
        acc.customdata.push(value as string);
        acc.text.push(text[index] as string);
        acc.hovertext.push(hovertext[index] as string);
        acc.color.push((marker.color as string[])[index]);
      }
      return acc;
    }, {x: [], y: [], customdata: [], text: [], hovertext: [], color: []});

    //error images are on the negative y-axis, don't filter them
    const filteredImages = layoutConfig.images?.filter((image) => (image.y as number) < 0 || image.name && selectedActions.includes(image.name));

    const filteredPlotData = [
      new PlotlyScatterData(filtered.x, filtered.y, filtered.text, filtered.hovertext,
        filtered.customdata, filtered.color).toPlotlyFormat(),
      errorScatterData
    ];

    return {
      plotData: filteredPlotData,
      layoutConfig: {
        ...layoutConfig,
        images: filteredImages
      }
    };
  };

  return {actionsData, actionsLayout, distinctActionsTaken};
};
