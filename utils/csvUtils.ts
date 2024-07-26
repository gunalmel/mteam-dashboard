import Papa from 'papaparse';
import { ScatterData, Layout, Shape, Annotations } from 'plotly.js';
import { createActionsScatterData, createRequiredActionTransition, processRow, generateLayout, generateRequiredActionsData } from '@/utils/dataUtils';
import { phaseColors } from '@/components/constants';

export const parseCsvData = (
    url: string,
    onComplete: (actionsScatterData: Partial<ScatterData>, layoutConfig: Partial<Layout>, requiredActionIcons: Partial<Annotations>[], requiredActionsShapes: Partial<Shape>[]) => void
) => {
    const phaseMap: { [key: string]: { start: string, end: string } } = {};
    const timestampsInDateString: string[] = [];
    const yValues: number[] = [];
    const subActions: string[] = [];
    const actionAnnotations: string[] = [];
    let compressionLine: { seconds: string[], hoverText: string[] } = { seconds: [], hoverText: [] };
    const compressionLines: Partial<ScatterData>[] = [];
    const uniqueActions: { [key: string]: Set<string> } = {};

    Papa.parse(url, {
        download: true,
        header: true,
        step: function (row: Papa.ParseStepResult<{ [key: string]: string }>) {
            processRow(row.data, phaseMap, timestampsInDateString, yValues, subActions, actionAnnotations, compressionLine, compressionLines, uniqueActions);
        },
        complete: function () {
            const actionsScatterData = createActionsScatterData(timestampsInDateString, yValues, subActions, actionAnnotations);
            const layoutConfig = generateLayout(phaseMap, timestampsInDateString);
            const requiredActionIcons = generateRequiredActionsData(uniqueActions, phaseMap);

            const requiredActionsShapes = Object.keys(phaseMap).map((action, index) =>
                createRequiredActionTransition(
                    action,
                    phaseMap[action].start,
                    phaseMap[action].end,
                    phaseColors[index % phaseColors.length] + '33'
                )
            );

            onComplete(actionsScatterData, layoutConfig, requiredActionIcons, requiredActionsShapes);
        }
    });
};
