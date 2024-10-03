import Papa from 'papaparse';
import { ScatterData } from 'plotly.js';
import {
    createStageErrorsScatterData,
    generateLayout,
    generateStageErrorImagesData
} from '@/utils/dataUtils';
import {LayoutWithNamedImage, ImageWithName} from '@/types';
import ActionsScatterPlotCsvProcessor from '@/utils/ActionsScatterPlotCsvRowProcessor';

export const parseCsvData = (
    url: string,
    onComplete: (actionsScatterData: Partial<ScatterData>, errorsScatterData: Partial<ScatterData>, compressionLines: Array<Partial<ScatterData>>, layoutConfig: Partial<LayoutWithNamedImage>, phaseErrorImages: Partial<ImageWithName>[]) => void
) => {
    const csvProcessor = new ActionsScatterPlotCsvProcessor();
    Papa.parse(url, {
        download: true,
        header: true,
        step: csvProcessor.rowProcessor,
        complete: function () {
            const actionsScatterData = csvProcessor.createScatterPlotData();
            const stageMap = csvProcessor.getStageIntervalMap();

            const layoutConfig = generateLayout(stageMap, csvProcessor.data);
            const stageErrorImages = generateStageErrorImagesData(csvProcessor.stageErrors, stageMap);

            // working on this one now.
            const errorsData = createStageErrorsScatterData(stageErrorImages);
            const errorsScatterData = errorsData.scatterData;

            layoutConfig.images = [
                ...(layoutConfig.images || []),
                ...csvProcessor.collectImages(),
                ...errorsData.images
            ];

            onComplete(actionsScatterData, errorsScatterData, csvProcessor.compressionLines.plotData, layoutConfig, errorsData.images);
        }
    });
};

