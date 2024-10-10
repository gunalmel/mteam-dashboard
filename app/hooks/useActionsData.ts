import {useEffect, useRef, useState} from 'react';
import {Datum, Layout, ScatterData} from 'plotly.js';
import {parseCsvData} from '@/app/lib/csv/actionCsvParser';
import {LayoutWithNamedImage} from '@/types';
import {ACTION_GROUP_MAP} from '@/app/ui/components/constants';

const files = [
  'vj6wm2c30u3qqk5kbuj9v/timeline-multiplayer-06102024.csv?rlkey=ztegai6tskj3jgbxjbwz5l393&st=ofuo2z4c&dl=0',
  'tjl0wfx0nebdkx0w7al6w/timeline-multiplayer-08052024.csv?rlkey=kh4h2s09ombtkbu1iqpp6b7pg&st=b9hozrus&dl=0',
  '6os941r9qnk19nkd22415/timeline-multiplayer-09182024.csv?rlkey=4lpfpmkf62fnua597t7bh3p17&st=1v2zw6n3&dl=0',
  '1ls2txjhf6y1yqeab37i9/timeline-multiplayer-09302024.csv?rlkey=3opuazpyvp606md15pnjaxm3q&st=dvi2kwwd&dl=0'
];

const fileLink = `https://dl.dropboxusercontent.com/scl/fi/${files[2]}`;

export const useActionsData = (selectedMarkers: string[]) => {
    const [actionsData, setActionsData] = useState<Partial<ScatterData>[]>([]);
    const [actionsLayout, setActionsLayout] = useState<Partial<Layout>>({});

    const parsedDataRef = useRef<{
        plotData: Partial<ScatterData>[];
        layoutConfig: Partial<LayoutWithNamedImage>;
        distinctActionsTaken : {url:string, group:string}[]
    } >({ plotData: [], layoutConfig: {}, distinctActionsTaken: [] });
    useEffect(() => {
        parseCsvData(
          fileLink,
            (plotData, layoutConfig, distinctActionsTaken) => {
                parsedDataRef.current = {
                    plotData,
                    layoutConfig,
                    distinctActionsTaken
                };
                setActionsLayout(layoutConfig);
                updateActionsData(plotData, layoutConfig, selectedMarkers);
            }
        );
    }, []);

    useEffect(() => {
        if (parsedDataRef.current) {
            updateActionsData( parsedDataRef.current.plotData,
              parsedDataRef.current.layoutConfig,
                selectedMarkers
            );
        }
    }, [selectedMarkers]);

    const updateActionsData = (
        plotData: Partial<ScatterData>[],
        layoutConfig: Partial<LayoutWithNamedImage>,
        selectedMarkers: string[],
    ) => {
        const filteredData = filterActionsData(plotData, layoutConfig, selectedMarkers);

        setActionsData(filteredData.plotData);
        setActionsLayout({ ...filteredData.layoutConfig, images: filteredData.layoutConfig.images });
    };

    const filterActionsData = (plotData: Partial<ScatterData>[],
                               layoutConfig: Partial<LayoutWithNamedImage>,
                               selectedActionGroups: string[]):
      { plotData: Partial<ScatterData>[]; layoutConfig: Partial<Layout> } => {
        const [actionsScatterData] = plotData;
        const { x, y, text, customdata, hovertext } = actionsScatterData??{};
        const selectedActions = selectedActionGroups.flatMap(group=>ACTION_GROUP_MAP[group].actions);

        if (!x || !y) {
            return { plotData: [], layoutConfig: {} };
        }

        const filteredIndices = customdata?.reduce<number[]>((acc, value, index) => {
            if (selectedActions.includes(value as string)) {
                acc.push(index);
            }
            return acc;
        }, []);

        //error images are on the negative y-axis, don't filter them
        const filteredImages = layoutConfig.images?.filter((image) => (image.y as number) < 0 || image.name && selectedActions.includes(image.name));

        return {
            plotData: [{
                ...actionsScatterData,
                x: filteredIndices?.map((index) => x[index]) as Datum[],
                y: filteredIndices?.map((index) => y[index]) as Datum[],
                marker: {
                    size: 18,
                    symbol: 'square',
                    color: filteredIndices?.map((index) => (actionsScatterData.marker?.color as string[])[index]),
                },
                text: text && filteredIndices?.map((index) => text[index]),
                hovertext: hovertext && filteredIndices?.map((index) => hovertext[index]),
            }, plotData[1]],
            layoutConfig: {
                ...layoutConfig,
                images: filteredImages
            },
        };
    };

    return { actionsData, actionsLayout, distinctActionsTaken:parsedDataRef.current?.distinctActionsTaken };
};
