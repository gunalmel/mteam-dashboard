import {useEffect, useRef, useState} from 'react';
import {Data, Datum, Layout, ScatterData} from 'plotly.js';
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
    const [actionsLayout, setActionsLayout] = useState<Partial<Layout>>({});

    const parsedDataRef = useRef<{
        plotData: Partial<ScatterData>[];
        layoutConfig: LayoutWithNamedImage;
    } >({ plotData: [], layoutConfig: {images:[]} });

    useEffect(() => {
        parseCsvData( fileLink,
           (plotData,
                       layoutConfig,
                       actionGroupIconMap) => {
                          parsedDataRef.current = { plotData, layoutConfig };
                          setActionGroupIcons(Object.entries(actionGroupIconMap).map((entry)=>({value:entry[0],source:entry[1]})));
                          setActionsData(plotData);
                          setActionsLayout(layoutConfig);
                      }
        );
    }, []);

  const updateActionsData = (selectedMarkers: string[]) => {
    const filteredData = filterActionsData(parsedDataRef.current.plotData, parsedDataRef.current.layoutConfig, selectedMarkers);

    setActionsData(filteredData.plotData);
    setActionsLayout({ ...filteredData.layoutConfig, images: filteredData.layoutConfig.images });
  };


    const filterActionsData = (plotData: Data[],
                               layoutConfig: LayoutWithNamedImage,
                               selectedActionGroups: string[]): { plotData: Data[]; layoutConfig: Partial<Layout> } => {
      const actionsScatterData = plotData[0] as ScatterData;
      const {x, y, text, customdata, hovertext} = (actionsScatterData ?? {}) as ScatterData;
      if (!x || !y) {
        return {plotData: [], layoutConfig: {}};
      }

      const selectedActions = actionsDictionary.getActionNamesByGroups(selectedActionGroups);


      const filtered = customdata?.reduce((acc, value, index) => {
            if (selectedActions.includes(value as string)) {
              acc.x.push(x[index] as Datum);
              acc.y.push(y[index] as Datum);
              acc.color.push((actionsScatterData.marker?.color as string[])[index]);
              if (text) {
                acc.text.push(text[index] as string);
              }
              if (hovertext) {
                acc.hovertext.push(hovertext[index] as string);
              }
            }
            return acc;
        }, {x:[] as Datum[], y:[] as Datum[], color:[] as string[], text:[] as string[], hovertext:[] as string[]});

        //error images are on the negative y-axis, don't filter them
        const filteredImages = layoutConfig.images?.filter((image) => (image.y as number) < 0 || image.name && selectedActions.includes(image.name));

        return {
            plotData: [{
                ...actionsScatterData,
                x: filtered?.x,
                y: filtered?.y,
                marker: {
                    size: 18,
                    symbol: 'square',
                    color: filtered?.color,
                },
                text: filtered?.text,
                hovertext: filtered?.hovertext,
            }, plotData[1]],
            layoutConfig: {
                ...layoutConfig,
                images: filteredImages
            },
        };
    };

    return { actionsData, actionsLayout, actionGroupIcons, updateActionsData };
};
