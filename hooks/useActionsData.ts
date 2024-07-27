import { useState, useEffect, useRef } from 'react';
import { ScatterData, Layout, Shape, Annotations } from 'plotly.js';
import { parseCsvData } from '@/utils/csvUtils';
import { icons } from '@/components/constants';

export const useActionsData = (selectedMarkers: string[]) => {
    const [actionsData, setActionsData] = useState<Array<Partial<ScatterData>>>([]);
    const [actionsLayout, setActionsLayout] = useState<Partial<Layout>>({});
    const [requiredActionsAnnotations, setRequiredActionsAnnotations] = useState<Partial<Annotations>[]>([]);
    const [requiredActionsShapes, setRequiredActionsShapes] = useState<Partial<Shape>[]>([]);
    const parsedDataRef = useRef<{
        actionsScatterData: Partial<ScatterData>;
        layoutConfig: Partial<Layout>;
        requiredActionIcons: Partial<Annotations>[];
        requiredActionsShapes: Partial<Shape>[];
    } | null>(null);

    useEffect(() => {
        parseCsvData(
            'https://raw.githubusercontent.com/thedevagyasharma/mteam-dashboard/main/src/Data_sample2/timeline-multiplayer%20(32).csv',
            (actionsScatterData, layoutConfig, requiredActionIcons, requiredActionsShapes) => {
                parsedDataRef.current = {
                    actionsScatterData,
                    layoutConfig,
                    requiredActionIcons,
                    requiredActionsShapes,
                };
                setActionsLayout(layoutConfig);
                setRequiredActionsAnnotations(requiredActionIcons);
                setRequiredActionsShapes(requiredActionsShapes);
                updateActionsData(actionsScatterData, selectedMarkers);
            }
        );
    }, []);

    useEffect(() => {
        if (parsedDataRef.current) {
            updateActionsData(parsedDataRef.current.actionsScatterData, selectedMarkers);
        }
    }, [selectedMarkers]);

    const updateActionsData = (actionsScatterData: Partial<ScatterData>, selectedMarkers: string[]) => {
        const filteredData = filterActionsData(actionsScatterData, selectedMarkers);
        setActionsData([filteredData]);
    };

    const filterActionsData = (actionsScatterData: Partial<ScatterData>, selectedMarkers: string[]): Partial<ScatterData> => {
        const x = actionsScatterData.x as string[] | undefined;
        const y = actionsScatterData.y as number[] | undefined;
        const text = actionsScatterData.text as string[] | undefined;
        const hovertext = actionsScatterData.hovertext as string[] | undefined;

        if (!x || !y || !text || !hovertext) {
            return {};
        }

        // Map selected markers to their corresponding icons
        const selectedIcons = selectedMarkers.map(marker => icons[marker].unicode);

        const filteredIndices = text.reduce<number[]>((acc, value, index) => {
            if (selectedIcons.includes(value)) {
                acc.push(index);
            }
            return acc;
        }, []);

        return {
            x: filteredIndices.map(index => x[index]),
            y: filteredIndices.map(index => y[index]),
            text: filteredIndices.map(index => text[index]),
            hovertext: filteredIndices.map(index => hovertext[index]),
            mode: 'text',
            type: 'scatter',
            textposition: 'top center',
            textfont: { size: 16 },
        };
    };

    return { actionsData, actionsLayout, requiredActionsAnnotations, requiredActionsShapes };
};
