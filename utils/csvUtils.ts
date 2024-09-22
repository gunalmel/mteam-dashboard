import Papa from 'papaparse';
import { ScatterData } from 'plotly.js';
import { createActionsScatterData, processRow, generateLayout, generatePhaseErrorImagesData } from '@/utils/dataUtils';
import { LayoutWithNamedImage, ImageWithName } from '@/types';

export const parseCsvData = (
    url: string,
    onComplete: (actionsScatterData: Partial<ScatterData>, compressionLines: Array<Partial<ScatterData>>, layoutConfig: Partial<LayoutWithNamedImage>, phaseErrorImages: Partial<ImageWithName>[]) => void
) => {
    const phaseMap: { [key: string]: { start: string, end: string } } = {};
    const timestampsInDateString: string[] = [];
    const yValues: number[] = [];
    const subActions: string[] = [];
    const actionAnnotations: string[] = [];
    let compressionLine: { seconds: string[], hoverText: string[] } = { seconds: [], hoverText: [] };
    const compressionLines: Array<Partial<ScatterData>> = [];
    const phaseErrors: { [key: string]: Array<{ [key: string]: string }> } = {};

    Papa.parse(url, {
        download: true,
        header: true,
        step: function (row: Papa.ParseStepResult<{ [key: string]: string }>) {
            processRow(row.data, phaseMap, timestampsInDateString, yValues, subActions, actionAnnotations, compressionLine, compressionLines, phaseErrors);
        },
        complete: function () {
            updatePhaseMap(phaseMap); // Update phaseMap to set end of each phase

            const plotDataPoints = createActionsScatterData(timestampsInDateString, yValues, subActions, actionAnnotations);
            const actionsScatterData = plotDataPoints.scatterData;
            const layoutConfig = generateLayout(phaseMap, timestampsInDateString);
            const phaseErrorImages = generatePhaseErrorImagesData(phaseErrors, phaseMap);

            // console.log("phaseErrorImages");
            // console.log(phaseErrorImages);

            layoutConfig.images = [
                ...(layoutConfig.images || []),
                ...plotDataPoints.images,
                ...phaseErrorImages
            ];

            onComplete(actionsScatterData, compressionLines, layoutConfig, phaseErrorImages);
        }
    });
};

// Update phaseMap to set the start time of the first stage to 0 and the end time of a stage to the start of the next stage
const updatePhaseMap = (phaseMap: { [key: string]: { start: string, end: string } }) => {
    const phaseKeys = Object.keys(phaseMap);
    
    if (phaseKeys.length === 0) return; // Exit if there are no phases

    // Set the start time of the first stage to 0
    phaseMap[phaseKeys[0]].start = "2017-01-01 00:00:00"; // Starting from second 0

    for (let i = 0; i < phaseKeys.length - 1; i++) {
        const currentPhase = phaseKeys[i];
        const nextPhase = phaseKeys[i + 1];

        // Set the end time of the current phase to the start time of the next phase
        if (phaseMap[nextPhase]) {
            phaseMap[currentPhase].end = phaseMap[nextPhase].start;
        }
    }
};

