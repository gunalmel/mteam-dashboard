import ErrorActionTracker from '@/utils/ErrorActionTracker';
import ActionStages from '@/utils/ActionStages';
import ActionsCompressionLines from '@/utils/ActionsCompressionLines';
import Papa from 'papaparse';
import { processRow } from '@/utils/actionCsvRowProcessor';
import ActionScatterPlotData from '@/utils/ActionScatterPlotData';
import ActionStageError from '@/utils/ActionStageError';
import { ImageWithName, LayoutWithNamedImage } from '@/types';
import createStageErrorImages from '@/utils/stageErrorPositionCalculator';
import { PlotData } from 'plotly.js';
import PlotlyScatterLayout from '@/utils/PlotlyScatterLayout';

export default class ActionsPlotCsvProcessor {
  readonly data = new ActionScatterPlotData();
  readonly stageErrors: { [key: string]: Array<ActionStageError> } = {};
  readonly stages: ActionStages = new ActionStages();
  readonly compressionLines = new ActionsCompressionLines();
  readonly errorActionTracker: ErrorActionTracker = new ErrorActionTracker();
  constructor() {
    this.rowProcessor = this.rowProcessor.bind(this);
  }
  rowProcessor(row: Papa.ParseStepResult<{ [key: string]: string }>) {
    processRow(
      row.data,
      this.data,
      this.errorActionTracker,
      this.stages,
      this.compressionLines,
      this.stageErrors,
    );
  }

  layout(): Partial<LayoutWithNamedImage> {
    return new PlotlyScatterLayout(
      this.stages.plotlyShapes,
      this.stages.plotlyStageAnnotations,
      this.data.xAxisRange(),
    ).toPlotlyFormat();
  }

  createScatterPlotData() {
    return this.data.createPlotScatterData();
  }

  collectStageErrors(): { data: Partial<PlotData>; images: ImageWithName[] } {
    return createStageErrorImages(this.stages, this.stageErrors);
  }

  collectScatterDataImages() {
    return this.data.collectPlotImages();
  }
}
