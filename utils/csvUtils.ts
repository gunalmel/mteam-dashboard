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
import SequentialTimePeriods from "@/utils/SequentialTimePeriods";
import CompressionLines from "@/utils/CompressionLines";

export const parseCsvData = (
    url: string,
    onComplete: (actionsScatterData: Partial<ScatterData>, errorsScatterData: Partial<ScatterData>, compressionLines: Array<Partial<ScatterData>>, layoutConfig: Partial<LayoutWithNamedImage>, phaseErrorImages: Partial<ImageWithName>[]) => void
) => {
    const error: ErrorAction = { triggered: false, name: '', time:0 };
    const stageMap: SequentialTimePeriods = new SequentialTimePeriods();//{ [key: string]: { start: string, end: string } } = {};
    const timestampsInDateString: string[] = [];
    const actionColors: string[] = [];
    const yValues: number[] = [];
    const subActions: string[] = [];
    const actionAnnotations: string[] = [];
    const compressionLines = new CompressionLines();
    const phaseErrors: { [key: string]: Array<{ [key: string]: string }> } = {};

    Papa.parse(url, {
        download: true,
        header: true,
        step: function (row: Papa.ParseStepResult<{ [key: string]: string }>) {
            processRow(row.data, error, stageMap, timestampsInDateString, actionColors, yValues, subActions, actionAnnotations, compressionLines, phaseErrors);
        },
        complete: function () {
            const actionsData = createActionsScatterData(timestampsInDateString, actionColors, yValues, subActions, actionAnnotations);
            const actionsScatterData = actionsData.scatterData;
            const layoutConfig = generateLayout(stageMap.getAll(), timestampsInDateString);
            const phaseErrorImages = generatePhaseErrorImagesData(phaseErrors, stageMap.getAll());

            // working on this one now.
            const errorsData = createStageErrorsScatterData(phaseErrorImages);
            const errorsScatterData = errorsData.scatterData;

            console.log("actionsData");
            console.log(actionsData);

            layoutConfig.images = [
                ...(layoutConfig.images || []),
                ...actionsData.images,
                ...errorsData.images
            ];

            onComplete(actionsScatterData, errorsScatterData, compressionLines.plotData, layoutConfig, errorsData.images /*phaseErrorImages*/);
        }
    });
};

