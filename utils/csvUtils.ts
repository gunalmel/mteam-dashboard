import Papa from 'papaparse';
import { ScatterData } from 'plotly.js';
import {
    createActionsScatterData,
    createStageErrorsScatterData,
    processRow,
    generateLayout,
    generatePhaseErrorImagesData
} from '@/utils/dataUtils';
import { LayoutWithNamedImage, ImageWithName, ErrorAction } from '@/types';

export const parseCsvData = (
    url: string,
    onComplete: (actionsScatterData: Partial<ScatterData>, errorsScatterData: Partial<ScatterData>, compressionLines: Array<Partial<ScatterData>>, layoutConfig: Partial<LayoutWithNamedImage>, phaseErrorImages: Partial<ImageWithName>[]) => void
) => {
    const error: ErrorAction = { triggered: false, name: '', time: 0 };
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
            updatePhaseNames(phaseMap); // Update phase names based on mapping
            updatePhaseMap(phaseMap); // Update phaseMap to set end of each phase
            updatePhaseErrorKeys(phaseErrors); // Update phaseErrors keys to match phaseMap

            const actionsData = createActionsScatterData(timestampsInDateString, actionColors, yValues, subActions, actionAnnotations);
            const actionsScatterData = actionsData.scatterData;
            const layoutConfig = generateLayout(phaseMap, timestampsInDateString);
            const phaseErrorImages = generatePhaseErrorImagesData(phaseErrors, phaseMap);

            // Working on this one now.
            const errorsData = createStageErrorsScatterData(phaseErrorImages);
            const errorsScatterData = errorsData.scatterData;

            layoutConfig.images = [
                ...(layoutConfig.images || []),
                ...actionsData.images,
                ...errorsData.images
            ];

            onComplete(actionsScatterData, errorsScatterData, compressionLines, layoutConfig, errorsData.images);
        }
    });
};

const stageNameMapping: { [key: string]: string } = {
    "(1)V-Tach 2D(action)": "V Tach WITH Pulse",
    "(2)V-Tach 2A.1(action)": "V Tach NO Pulse.A",
    "(3)V-Tach 2B.1(action)": "V Tach NO Pulse.B",
    "(4)Asystole 1D No.1(action)": "Asystole",
    "(5)V-Fib 4C.1 - AMIO(action)": "VF -V FIB",
    "(6)ROSC 5B - Stemi(action)": "ROSC"
};

// Function to update keys in phaseErrors to match phaseMap naming conventions
const updatePhaseErrorKeys = (phaseErrors: { [key: string]: Array<{ [key: string]: string }> }) => {
    const updatedPhaseErrors: { [key: string]: Array<{ [key: string]: string }> } = {};

    Object.keys(phaseErrors).forEach(key => {
        const newKey = stageNameMapping[key] || key; // Use new key or keep the same if not found
        updatedPhaseErrors[newKey] = phaseErrors[key]; // Assign the errors to the new key
    });

    // Replace the old phaseErrors with the updated ones
    Object.assign(phaseErrors, updatedPhaseErrors);
};

// Function to update phase names in the phaseMap
const updatePhaseNames = (phaseMap: { [key: string]: { start: string, end: string } }) => {
    // Rename stages based on the mapping
    for (const key in phaseMap) {
        if (stageNameMapping[key]) {
            phaseMap[stageNameMapping[key]] = phaseMap[key]; // Set the new name with the old values
            delete phaseMap[key]; // Remove the old key
        }
    }
};

// Update phaseMap to set the start time of the first stage to 0, 
// the end time of a stage to the start of the next stage.
const updatePhaseMap = (phaseMap: { [key: string]: { start: string, end: string } }) => {
    const phaseKeys = Object.keys(phaseMap);

    if (phaseKeys.length === 0) {
        alert("Phase Map is empty. Exiting update.");
        return;
    }

    if (phaseKeys.length > 0) {
        // Set the start time of the first stage to 0
        phaseMap[phaseKeys[0]].start = "2017-01-01 00:00:00"; // Starting from second 0
    }

    for (let i = 0; i < phaseKeys.length - 1; i++) {
        const currentPhase = phaseKeys[i];
        const nextPhase = phaseKeys[i + 1];

        // Set the end time of the current phase to the start time of the next phase
        if (phaseMap[nextPhase]) {
            phaseMap[currentPhase].end = phaseMap[nextPhase].start;
        }
    }
};
