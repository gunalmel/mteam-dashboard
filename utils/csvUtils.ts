import Papa from 'papaparse';
import { ScatterData } from 'plotly.js';
import {
    createActionsScatterData,
    createStageErrorsScatterData,
    generateLayout,
    generateStageErrorImagesData
} from '@/utils/dataUtils';
import {LayoutWithNamedImage, ImageWithName} from '@/types';
import ActionsScatterPlotCsvRowProcessor from "@/utils/ActionsScatterPlotCsvRowProcessor";

export const parseCsvData = (
    url: string,
    onComplete: (actionsScatterData: Partial<ScatterData>, errorsScatterData: Partial<ScatterData>, compressionLines: Array<Partial<ScatterData>>, layoutConfig: Partial<LayoutWithNamedImage>, phaseErrorImages: Partial<ImageWithName>[]) => void
) => {
    const rowProcessor = new ActionsScatterPlotCsvRowProcessor();
    Papa.parse(url, {
        download: true,
        header: true,
        step: rowProcessor.process,
        complete: function () {
            const {x, y, names, annotations, colors} = rowProcessor.scatterPlotData;
            const scatterPlotTimeStampStrings = x.map(t=>t.dateTimeString);
            const actionsData = createActionsScatterData(scatterPlotTimeStampStrings, colors, y, names, annotations);
            const actionsScatterData = actionsData.scatterData;
            const stageMap = rowProcessor.getStageMap();

            const layoutConfig = generateLayout(rowProcessor.stages.getAll(), scatterPlotTimeStampStrings);
            const stageErrorImages = generateStageErrorImagesData(rowProcessor.stageErrors, stageMap);

            // working on this one now.
            const errorsData = createStageErrorsScatterData(stageErrorImages);
            const errorsScatterData = errorsData.scatterData;

            console.log("actionsData");
            console.log(actionsData);

            layoutConfig.images = [
                ...(layoutConfig.images || []),
                ...actionsData.images,
                ...errorsData.images
            ];

            onComplete(actionsScatterData, errorsScatterData, rowProcessor.compressionLines.plotData, layoutConfig, errorsData.images);
        }
    });
};

