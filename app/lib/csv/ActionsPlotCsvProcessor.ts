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
import {PlotlyScatterStageAnnotation} from '@/app/utils/plotly/PlotlyScatterStageAnnotation';
import {Today} from '@/app/utils/TodayDateTimeConverter';

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
    const missedActionsAnnotation = this.createActionPlotAreaAnnotations('Missed Actions', 0.187);
    const performedActionsAnnotation = this.createActionPlotAreaAnnotations('Performed Actions', 0.965);
    this.stages.plotlyStageAnnotations.push(performedActionsAnnotation);
    this.stages.plotlyStageAnnotations.push(missedActionsAnnotation);
    return new PlotlyScatterLayout(
      'Clinical Review Timeline',
      this.stages.plotlyShapes,
      this.stages.plotlyStageAnnotations,
      this.data.xAxisRange(),
      this.data.plotlyImages,
    ).toPlotlyFormat();
  }

  createActionPlotAreaAnnotations(text:string, y: number) {
    const x = Today.parseSeconds(0);
    const annotation = new PlotlyScatterStageAnnotation(text, x.dateTimeString, 'black').toPlotlyFormat();
    annotation.y=y;
    annotation.font= {size:14.5, weight: 550};
    delete annotation.bordercolor;
    delete annotation.borderwidth;
    delete annotation.borderpad;
    return annotation;
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
