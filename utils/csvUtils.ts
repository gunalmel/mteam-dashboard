import Papa from 'papaparse';
import { ScatterData, Layout, Shape, Annotations } from 'plotly.js';
import { createActionsScatterData, createRequiredActionTransition, processRow, generateLayout, generateRequiredActionsData } from '@/utils/dataUtils';
import { phaseColors } from '@/components/constants';
import { LayoutWithNamedImage, ImageWithName } from '@/types';

export const parseCsvData = (
    url: string,
    onComplete: (actionsScatterData: Partial<ScatterData>, compressionLines: Array<Partial<ScatterData>>, layoutConfig: Partial<LayoutWithNamedImage>, requiredActionImages: Partial<ImageWithName>[]) => void
) => {
    const phaseMap: { [key: string]: { start: string, end: string } } = {};
    const timestampsInDateString: string[] = [];
    const yValues: number[] = [];
    const subActions: string[] = [];
    const actionAnnotations: string[] = [];
    let compressionLine: { seconds: string[], hoverText: string[] } = { seconds: [], hoverText: [] };
    const compressionLines: Array<Partial<ScatterData>> = [];
    const uniqueActions: { [key: string]: Set<string> } = {};

    Papa.parse(url, {
        download: true,
        header: true,
        step: function (row: Papa.ParseStepResult<{ [key: string]: string }>) {
            processRow(row.data, phaseMap, timestampsInDateString, yValues, subActions, actionAnnotations, compressionLine, compressionLines, uniqueActions);
        },
        complete: function () {
            const plotDataPoints = createActionsScatterData(timestampsInDateString, yValues, subActions, actionAnnotations);
            const actionsScatterData = plotDataPoints.scatterData;
            const layoutConfig = generateLayout(phaseMap, timestampsInDateString);
            const requiredActionImages = generateRequiredActionsData(uniqueActions, phaseMap);

            layoutConfig.images = [
                ...(layoutConfig.images || []),
                ...plotDataPoints.images,
                ...requiredActionImages
            ];

            onComplete(actionsScatterData, compressionLines, layoutConfig, requiredActionImages);
        }
    });
};
