import Papa from 'papaparse';
import { ScatterData } from 'plotly.js';
import { ImageWithName, LayoutWithNamedImage } from '@/types';
import ActionsPlotCsvProcessor from '@/app/lib/csv/ActionsPlotCsvProcessor';

export const parseCsvData = (
  url: string,
  onComplete: (
    actionsScatterData: Partial<ScatterData>,
    errorsScatterData: Partial<ScatterData>,
    compressionLines: Partial<ScatterData>[],
    layoutConfig: Partial<LayoutWithNamedImage>,
    stageErrorImages: Partial<ImageWithName>[],
  ) => void,
) => {
  const csvProcessor = new ActionsPlotCsvProcessor();
  Papa.parse(url, {
    download: true,
    header: true,
    step: csvProcessor.rowProcessor,
    complete: function () {
      const layoutConfig = csvProcessor.layout();
      const stageErrors = csvProcessor.collectStageErrors();

      layoutConfig.images = [
        ...(layoutConfig.images || []),
        ...csvProcessor.collectScatterDataImages(),
        ...stageErrors.images
      ];

      onComplete(
        csvProcessor.createScatterPlotData(),
        stageErrors.data,
        csvProcessor.collectCompressionLines(),
        layoutConfig,
        stageErrors.images
      );
    }
  });
};
