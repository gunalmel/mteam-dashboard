import { useState, useEffect, useRef } from 'react';
import {ScatterData, Layout, Shape, Annotations, Datum} from 'plotly.js';
import { parseCsvData } from '@/utils/csvUtils';
import {getIcon} from '@/utils/dataUtils';
import { LayoutWithNamedImage } from '@/types';

export const useActionsData = (selectedMarkers: string[]) => {
    const [actionsData, setActionsData] = useState<Array<Partial<ScatterData>>>([]);
    const [actionsLayout, setActionsLayout] = useState<Partial<Layout>>({});
    const [requiredActionsAnnotations, setRequiredActionsAnnotations] = useState<Partial<Annotations>[]>([]);
    const [requiredActionsShapes, setRequiredActionsShapes] = useState<Partial<Shape>[]>([]);
    const parsedDataRef = useRef<{
        actionsScatterData: Partial<ScatterData>;
        compressionLines: Array<Partial<ScatterData>>;
        layoutConfig: Partial<LayoutWithNamedImage>;
        requiredActionIcons: Partial<Annotations>[];
        requiredActionsShapes: Partial<Shape>[];
    } | null>(null);

    useEffect(() => {
        parseCsvData(
            'https://raw.githubusercontent.com/thedevagyasharma/mteam-dashboard/main/src/Data_sample2/timeline-multiplayer%20(32).csv',
            (actionsScatterData, compressionLines, layoutConfig, requiredActionIcons, requiredActionsShapes) => {
                parsedDataRef.current = {
                    actionsScatterData,
                    compressionLines,
                    layoutConfig,
                    requiredActionIcons,
                    requiredActionsShapes,
                };
                setActionsLayout(layoutConfig);
                setRequiredActionsAnnotations(requiredActionIcons);
                setRequiredActionsShapes(requiredActionsShapes);
                updateActionsData(actionsScatterData, layoutConfig, compressionLines, selectedMarkers);
            }
        );
    }, []);

    useEffect(() => {
        if (parsedDataRef.current) {
            updateActionsData(Object.assign({},parsedDataRef.current.actionsScatterData),
                Object.assign({},parsedDataRef.current.layoutConfig),
                parsedDataRef.current.compressionLines, selectedMarkers);
        }
    }, [selectedMarkers]);

    const updateActionsData = (actionsScatterData: Partial<ScatterData>, layoutConfig: Partial<LayoutWithNamedImage>, compressionLines: Array<Partial<ScatterData>>, selectedMarkers: string[]) => {
        const filteredData = filterActionsData(actionsScatterData, layoutConfig, selectedMarkers);
        setActionsData([filteredData.scatterData, ...compressionLines]);
        setActionsLayout(filteredData.layoutConfig);
    };

    const filterActionsData = (actionsScatterData: Partial<ScatterData>, layoutConfig: Partial<LayoutWithNamedImage>, selectedMarkers: string[]): {scatterData: Partial<ScatterData>, layoutConfig: Partial<Layout>} => {
        const {x,y,text,ids,hovertext} = actionsScatterData;

        if (!x || !y) {
            return {scatterData:{}, layoutConfig:{}};
        }

        // Map selected markers to their corresponding icons
        const selectedIcons = selectedMarkers.map(marker => getIcon(marker).name);

        const filteredIndices = ids?.reduce<number[]>((acc, value, index) => {
            if (selectedIcons.includes(value)) {
                acc.push(index);
            }
            return acc;
        }, []);

        layoutConfig.images = layoutConfig.images?.filter(image=>image.name&&selectedIcons.includes(image.name));

        return { scatterData:  {
            ...actionsScatterData,
            x: filteredIndices?.map(index => x[index]) as Array<Datum>,
            y: filteredIndices?.map(index => y[index])as Array<Datum>,
            text: text&&filteredIndices?.map(index => text[index]),
            hovertext: hovertext&&filteredIndices?.map(index => hovertext[index])
        },
            layoutConfig
        };
    };

    return { actionsData, actionsLayout, requiredActionsAnnotations, requiredActionsShapes };
};
