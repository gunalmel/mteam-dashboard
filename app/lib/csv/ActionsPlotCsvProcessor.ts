import ErrorActionTracker from '@/app/lib/csv/ErrorActionTracker';
import ActionStages from '@/app/lib/ActionStages';
import ActionsCompressionLines from '@/app/lib/ActionsCompressionLines';
import Papa from 'papaparse';
import { processRow } from '@/app/lib/csv/actionCsvRowProcessor';
import ActionScatterPlotData from '@/app/lib/ActionScatterPlotData';
import ActionStageError from '@/app/lib/ActionStageError';
import { ImageWithName, LayoutWithNamedImage } from '@/types';
import createStageErrors from '@/app/lib/stageErrorPositionCalculator';
import { PlotData } from 'plotly.js';
import PlotlyScatterLayout from '@/app/utils/plotly/PlotlyScatterLayout';

export default class ActionsPlotCsvProcessor {
  readonly data = new ActionScatterPlotData();
  readonly stages: ActionStages = new ActionStages();
  readonly stageErrors: Record<string, ActionStageError[]> = {};
  readonly compressionLines = new ActionsCompressionLines();
  readonly errorActionTracker: ErrorActionTracker = new ErrorActionTracker();
  constructor() {
    this.rowProcessor = this.rowProcessor.bind(this);
  }
  rowProcessor(row: Papa.ParseStepResult<Record<string, string>>) {
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
    return createStageErrors(this.stages, this.stageErrors);
  }

  collectScatterDataImages() {
    return this.data.collectPlotImages();
  }

  collectCompressionLines() {
    return this.compressionLines.plotData;
  }
}
