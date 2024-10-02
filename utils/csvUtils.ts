import Papa from 'papaparse';
import { ScatterData } from 'plotly.js';
import {
    createActionsScatterData,
    createStageErrorsScatterData,
    processRow,
    generateLayout,
    generatePhaseErrorImagesData
} from '@/utils/dataUtils';
import {LayoutWithNamedImage, ImageWithName} from '@/types';
import SequentialTimePeriods from "@/utils/SequentialTimePeriods";
import CompressionLines from "@/utils/CompressionLines";
import CsvDateTimeStamp from "@/utils/CsvDateTimeStamp";
import ErrorAction from "@/utils/ErrorAction";

export const parseCsvData = (
    url: string,
    onComplete: (actionsScatterData: Partial<ScatterData>, errorsScatterData: Partial<ScatterData>, compressionLines: Array<Partial<ScatterData>>, layoutConfig: Partial<LayoutWithNamedImage>, phaseErrorImages: Partial<ImageWithName>[]) => void
) => {
    const error: ErrorAction = new ErrorAction();
    const stageMap: SequentialTimePeriods = new SequentialTimePeriods();//{ [key: string]: { start: string, end: string } } = {};
    const timeStamps: Array<CsvDateTimeStamp> = [];
    const actionColors: string[] = [];
    const yValues: number[] = [];
    const subActions: string[] = [];
    const actionAnnotations: string[] = [];
    const compressionLines = new CompressionLines();
    const stageErrors: { [key: string]: Array<{ [key: string]: string }> } = {};

    Papa.parse(url, {
        download: true,
        header: true,
        step: function (row: Papa.ParseStepResult<{ [key: string]: string }>) {
            processRow(row.data, error, stageMap, timeStamps, actionColors, yValues, subActions, actionAnnotations, compressionLines, stageErrors);
        },
        complete: function () {
            const timeStampStrings = timeStamps.map(t=>t.dateTimeString);
            const actionsData = createActionsScatterData(timeStampStrings, actionColors, yValues, subActions, actionAnnotations);
            const actionsScatterData = actionsData.scatterData;
            const layoutConfig = generateLayout(stageMap.getAll(), timeStampStrings);
            const phaseErrorImages = generatePhaseErrorImagesData(stageErrors, stageMap.getAll());

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

            onComplete(actionsScatterData, errorsScatterData, compressionLines.plotData, layoutConfig, errorsData.images);
        }
    });
};

