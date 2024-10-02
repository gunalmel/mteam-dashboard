import ErrorActionTracker from '@/utils/ErrorActionTracker';
import SequentialTimePeriods from '@/utils/SequentialTimePeriods';
import CompressionLines from '@/utils/CompressionLines';
import Papa from 'papaparse';
import { processRow } from '@/utils/dataUtils';
import ActionScatterPlotData from '@/utils/ActionScatterPlotData';
import ActionError from "@/utils/ActionError";

export default class ActionsScatterPlotCsvRowProcessor {
  readonly scatterPlotData = new ActionScatterPlotData();
  readonly stageErrors: { [key: string]: Array<ActionError> } = {};
  readonly stages: SequentialTimePeriods = new SequentialTimePeriods();
  readonly compressionLines = new CompressionLines();
  readonly errorActionTracker: ErrorActionTracker = new ErrorActionTracker();
  constructor() {
    this.process = this.process.bind(this);
  }
  process(row: Papa.ParseStepResult<{ [key: string]: string }>) {
    processRow(
      row.data,
      this.scatterPlotData,
      this.errorActionTracker,
      this.stages,
      this.compressionLines,
      this.stageErrors,
    );
  }
  getStageMap(){
    return this.stages.getAll();
  }
}
