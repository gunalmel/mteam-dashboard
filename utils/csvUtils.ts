import Papa from 'papaparse';
import { ScatterData } from 'plotly.js';
import {
    createActionsScatterData,
    createStageErrorsScatterData,
    processRow,
    generateLayout,
    generatePhaseErrorImagesData
} from '@/utils/dataUtils';
import {LayoutWithNamedImage, ImageWithName, ErrorAction} from '@/types';

export const parseCsvData = (
    url: string,
    onComplete: (actionsScatterData: Partial<ScatterData>, errorsScatterData: Partial<ScatterData>, compressionLines: Array<Partial<ScatterData>>, layoutConfig: Partial<LayoutWithNamedImage>, phaseErrorImages: Partial<ImageWithName>[]) => void
) => {
    const error: ErrorAction = { triggered: false, name: '', time:0 };
    const phaseMap: { [key: string]: { start: string, end: string } } = {};
    const timestampsInDateString: string[] = [];
    const actionColors: string[] = [];
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
            processRow(row.data, error, phaseMap, timestampsInDateString, actionColors, yValues, subActions, actionAnnotations, compressionLine, compressionLines, phaseErrors);
        },
        complete: function () {
            updatePhaseMap(phaseMap); // Update phaseMap to set end of each phase

            const actionsData = createActionsScatterData(timestampsInDateString, actionColors, yValues, subActions, actionAnnotations);
            const actionsScatterData = actionsData.scatterData;
            const layoutConfig = generateLayout(phaseMap, timestampsInDateString);
            const phaseErrorImages = generatePhaseErrorImagesData(phaseErrors, phaseMap);

            // working on this one now.
            const errorsData = createStageErrorsScatterData(phaseErrorImages);
            const errorsScatterData = errorsData.scatterData;

            //console.log("errorsData");
            // console.log(errorsData);

            console.log("actionsData");
            console.log(actionsData);

            layoutConfig.images = [
                ...(layoutConfig.images || []),
                ...actionsData.images,
                ...errorsData.images
                // ...phaseErrorImages
            ];

            onComplete(actionsScatterData, errorsScatterData, compressionLines, layoutConfig, errorsData.images /*phaseErrorImages*/);
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

