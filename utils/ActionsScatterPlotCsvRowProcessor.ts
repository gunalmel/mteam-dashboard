import ErrorActionTracker from '@/utils/ErrorActionTracker';
import SequentialTimePeriods from '@/utils/SequentialTimePeriods';
import CompressionLines from '@/utils/CompressionLines';
import Papa from 'papaparse';
import { processRow } from '@/utils/dataUtils';
import ActionScatterPlotData from '@/utils/ActionScatterPlotData';
import ActionError from '@/utils/ActionError';

export default class ActionsScatterPlotCsvRowProcessor {
  readonly data = new ActionScatterPlotData();
  readonly stageErrors: { [key: string]: Array<ActionError> } = {};
  readonly stages: SequentialTimePeriods = new SequentialTimePeriods();
  readonly compressionLines = new CompressionLines();
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
  getStageIntervalMap(){
    return this.stages.getMap()
  }

  createScatterPlotData(){
    return this.data.createPlotScatterData();
  }

  collectImages(){
    return this.data.collectPlotImages();
  }
}
