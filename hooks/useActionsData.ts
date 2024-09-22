import { useState, useEffect, useRef } from 'react';
import { ScatterData, Layout, Shape, Datum } from 'plotly.js';
import { parseCsvData } from '@/utils/csvUtils';
import { icons } from '@/components/constants';
import { LayoutWithNamedImage, ImageWithName } from '@/types';

export const useActionsData = (selectedMarkers: string[]) => {
    const [actionsData, setActionsData] = useState<Array<Partial<ScatterData>>>([]);
    const [actionsLayout, setActionsLayout] = useState<Partial<Layout>>({});
    const [phaseErrorImages, setPhaseErrorImages] = useState<Partial<ImageWithName>[]>([]);
    const parsedDataRef = useRef<{
        actionsScatterData: Partial<ScatterData>;
        compressionLines: Array<Partial<ScatterData>>;
        layoutConfig: Partial<LayoutWithNamedImage>;
        phaseErrorImages: Partial<ImageWithName>[];
    } | null>(null);

    useEffect(() => {
        parseCsvData(
            // 'https://raw.githubusercontent.com/thedevagyasharma/mteam-dashboard/main/src/Data_sample2/timeline-multiplayer%20(32).csv',
            'data/timeline-multiplayer-new-csv-1.csv',
            (actionsScatterData, compressionLines, layoutConfig, phaseErrorImages) => {
                parsedDataRef.current = {
                    actionsScatterData,
                    compressionLines,
                    layoutConfig,
                    phaseErrorImages
                };
                setActionsLayout(layoutConfig);
                setPhaseErrorImages(phaseErrorImages);
                updateActionsData(actionsScatterData, layoutConfig, compressionLines, selectedMarkers, phaseErrorImages);
            }
        );
    }, []);

    useEffect(() => {
        if (parsedDataRef.current) {
            updateActionsData(
                Object.assign({}, parsedDataRef.current.actionsScatterData),
                Object.assign({}, parsedDataRef.current.layoutConfig),
                parsedDataRef.current.compressionLines,
                selectedMarkers,
                phaseErrorImages
            );
        }
    }, [selectedMarkers]);

    const updateActionsData = (
        actionsScatterData: Partial<ScatterData>,
        layoutConfig: Partial<LayoutWithNamedImage>,
        compressionLines: Array<Partial<ScatterData>>,
        selectedMarkers: string[],
        phaseErrorImages: Partial<ImageWithName>[]
    ) => {

        const filteredData = filterActionsData(actionsScatterData, layoutConfig, selectedMarkers);

        const updatedImages = [
            ...(filteredData.layoutConfig.images || []), 
            ...phaseErrorImages
        ];

        setActionsData([filteredData.scatterData, ...compressionLines]);
        setActionsLayout({ ...filteredData.layoutConfig, images: updatedImages });
    };

    const filterActionsData = (
        actionsScatterData: Partial<ScatterData>,
        layoutConfig: Partial<LayoutWithNamedImage>,
        selectedMarkers: string[]
    ): { scatterData: Partial<ScatterData>; layoutConfig: Partial<Layout> } => {
        const { x, y, text, ids, hovertext } = actionsScatterData;

        if (!x || !y) {
            return { scatterData: {}, layoutConfig: {} };
        }

        // Map selected markers to their corresponding icons
        const selectedIcons = selectedMarkers.map((marker) => icons[marker].name);

        const filteredIndices = ids?.reduce<number[]>((acc, value, index) => {
            if (selectedIcons.includes(value)) {
                acc.push(index);
            }
            return acc;
        }, []);

        const filteredImages = layoutConfig.images?.filter((image) => image.name && selectedIcons.includes(image.name));

        return {
            scatterData: {
                ...actionsScatterData,
                x: filteredIndices?.map((index) => x[index]) as Array<Datum>,
                y: filteredIndices?.map((index) => y[index]) as Array<Datum>,
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
