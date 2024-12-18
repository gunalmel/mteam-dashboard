import Papa from 'papaparse';
import {PlotData} from 'plotly.js';
import {LayoutWithNamedImage} from '@/types';
import ActionsPlotCsvProcessor from '@/app/lib/csv/ActionsPlotCsvProcessor';

export const parseCsvData = (
  url: string,
  onComplete: (
    plotData: Partial<PlotData>[],
    layoutConfig: LayoutWithNamedImage,
    actionGroupIconMap: Record<string, string>
  ) => void
) => {
  const csvProcessor = new ActionsPlotCsvProcessor();
  Papa.parse(url, {
    download: true,
    header: true,
    step: csvProcessor.rowProcessor,
    complete: function () {
      const layoutConfig = csvProcessor.layout();
      const {data:errorScatterData, images:errorImages} = csvProcessor.collectStageErrors();

      layoutConfig.images = [
        ...(layoutConfig.images || []),
        ...errorImages
      ];

      onComplete(
        [csvProcessor.createScatterPlotData(), errorScatterData, ...csvProcessor.collectCompressionLines()],
        layoutConfig,
        csvProcessor.actionGroupIconMap
      );
    }
  });
};
