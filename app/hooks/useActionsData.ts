import {useEffect, useRef, useState} from 'react';
import {Datum, Layout, ScatterData} from 'plotly.js';
import {parseCsvData} from '@/app/lib/csv/actionCsvParser';
import {ImageWithName, LayoutWithNamedImage} from '@/types';

const files = [
  'vj6wm2c30u3qqk5kbuj9v/timeline-multiplayer-06102024.csv?rlkey=ztegai6tskj3jgbxjbwz5l393&st=ofuo2z4c&dl=0',
  'tjl0wfx0nebdkx0w7al6w/timeline-multiplayer-08052024.csv?rlkey=kh4h2s09ombtkbu1iqpp6b7pg&st=b9hozrus&dl=0',
  '6os941r9qnk19nkd22415/timeline-multiplayer-09182024.csv?rlkey=4lpfpmkf62fnua597t7bh3p17&st=1v2zw6n3&dl=0',
  '1ls2txjhf6y1yqeab37i9/timeline-multiplayer-09302024.csv?rlkey=3opuazpyvp606md15pnjaxm3q&st=dvi2kwwd&dl=0'
];

const fileLink = `https://dl.dropboxusercontent.com/scl/fi/${files[3]}`;

export const useActionsData = (selectedMarkers: string[]) => {
    const [actionsData, setActionsData] = useState<Partial<ScatterData>[]>([]);
    const [actionsLayout, setActionsLayout] = useState<Partial<Layout>>({});
    const [stageErrorImages, setStageErrorImages] = useState<Partial<ImageWithName>[]>([]);
    const parsedDataRef = useRef<{
        actionsScatterData: Partial<ScatterData>;
        errorsScatterData: Partial<ScatterData>;
        compressionLines: Partial<ScatterData>[];
        layoutConfig: Partial<LayoutWithNamedImage>;
        stageErrorImages: Partial<ImageWithName>[];
    } | null>(null);
    useEffect(() => {
        parseCsvData(
          fileLink,
            (actionsScatterData, errorsScatterData, compressionLines, layoutConfig, stageErrorImages) => {
                parsedDataRef.current = {
                    actionsScatterData,
                    errorsScatterData,
                    compressionLines,
                    layoutConfig,
                    stageErrorImages
                };
                setActionsLayout(layoutConfig);
                setStageErrorImages(stageErrorImages);
                updateActionsData(actionsScatterData, errorsScatterData, layoutConfig, compressionLines, selectedMarkers, stageErrorImages);
            }
        );
    }, []);

    useEffect(() => {
        if (parsedDataRef.current) {
            updateActionsData({...parsedDataRef.current.actionsScatterData},
              {...parsedDataRef.current.errorsScatterData},
              {...parsedDataRef.current.layoutConfig},
                parsedDataRef.current.compressionLines,
                selectedMarkers,
                stageErrorImages
            );
        }
    }, [selectedMarkers]);

    const updateActionsData = (
        actionsScatterData: Partial<ScatterData>,
        errorsScatterData: Partial<ScatterData>,
        layoutConfig: Partial<LayoutWithNamedImage>,
        compressionLines: Partial<ScatterData>[],
        selectedMarkers: string[],
        stageErrorImages: Partial<ImageWithName>[]
    ) => {
        const filteredData = filterActionsData(actionsScatterData, layoutConfig, selectedMarkers);

        const updatedImages = [
            ...(filteredData.layoutConfig.images || []),
            ...stageErrorImages
        ];

        setActionsData([filteredData.scatterData, errorsScatterData, ...compressionLines]);
        setActionsLayout({ ...filteredData.layoutConfig, images: updatedImages });
    };

    const filterActionsData = (actionsScatterData: Partial<ScatterData>,
                               layoutConfig: Partial<LayoutWithNamedImage>,
                               selectedActions: string[]):
      { scatterData: Partial<ScatterData>; layoutConfig: Partial<Layout> } => {
        const { x, y, text, customdata, hovertext } = actionsScatterData;

        if (!x || !y) {
            return { scatterData: {}, layoutConfig: {} };
        }

        const filteredIndices = customdata?.reduce<number[]>((acc, value, index) => {
            if (selectedActions.includes(value as string)) {
                acc.push(index);
            }
            return acc;
        }, []);

        const filteredImages = layoutConfig.images?.filter((image) => image.name && selectedActions.includes(image.name));

        return {
            scatterData: {
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
            },
            layoutConfig: {
                ...layoutConfig,
                images: filteredImages
            },
        };
    };

    return { actionsData, actionsLayout };
};
