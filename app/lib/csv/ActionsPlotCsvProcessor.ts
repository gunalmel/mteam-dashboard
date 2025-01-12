import ErrorActionTracker from '@/app/lib/csv/ErrorActionTracker';
import ActionStages from '@/app/lib/ActionStages';
import ActionsCompressionLines from '@/app/lib/ActionsCompressionLines';
import Papa from 'papaparse';
import {processRow} from '@/app/lib/csv/actionCsvRowProcessor';
import ActionScatterPlotData from '@/app/lib/ActionScatterPlotData';
import ActionStageError from '@/app/lib/ActionStageError';
import createStageErrors from '@/app/lib/stageErrorPositionCalculator';
import {Image, Layout, PlotData} from 'plotly.js';
import PlotlyScatterLayout from '@/app/utils/plotly/PlotlyScatterLayout';

export default class ActionsPlotCsvProcessor {
  readonly data = new ActionScatterPlotData();
  readonly stages: ActionStages = new ActionStages();
  readonly stageErrors: Record<string, ActionStageError[]> = {};
  readonly compressionLines = new ActionsCompressionLines();
  readonly errorActionTracker: ErrorActionTracker = new ErrorActionTracker();
  readonly actionGroupIconMap: Record<string,string> = {};
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
      this.actionGroupIconMap,
    );
  }

  layout(): Partial<Layout> {
    return new PlotlyScatterLayout(
      'Clinical Review Timeline',
      this.stages.plotlyShapes,
      this.stages.plotlyStageAnnotations,
      this.data.xAxisRange(),
      this.data.plotlyImages,
    ).toPlotlyFormat();
  }

  createScatterPlotData() {
    return this.data.createPlotScatterData();
  }

  collectStageErrors(): { data: Partial<PlotData>; images: Image[] } {
    return createStageErrors(this.stages, this.stageErrors);
  }

  collectCompressionLines() {
    return this.compressionLines.plotData;
  }
}
