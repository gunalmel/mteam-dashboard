import CsvDateTimeStamp from '@/app/lib/csv/CsvDateTimeStamp';
import CsvTimeInterval from '@/app/lib/csv/CsvTimeInterval';
import {Annotations, Shape} from 'plotly.js';
import {PlotlyScatterStage} from '@/app/utils/plotly/PlotlyScatterStage';
import {stageColors, actionsDictionary} from '@/app/ui/components/constants';
import {PlotlyScatterStageAnnotation} from '@/app/utils/plotly/PlotlyScatterStageAnnotation';

/**
 * Helps to build up a list of named time periods one by one, sequentially. Each time a named period is updated:
 * If no entry exists, a new entry is created with the start time as the default time and the end time as the time string provided.
 * If the previous entry exists with the same name, the end time is for the previous entry is updated.
 * Otherwise, a new entry created with same start date as the previous one and the end date is set to the time string provided.
 */
export default class ActionStages {
  static readonly #Y_VALS: {error:[number, number], stage:[number, number]} = {
    error: [-1.25, -4.25],
    stage: [0, actionsDictionary.yMax+1]
  };
  readonly #defaultTimeStamp: CsvDateTimeStamp = new CsvDateTimeStamp();
  readonly #periods: [string, CsvTimeInterval][] = [];
  readonly #periodMap = new Map<string, CsvTimeInterval>();
  readonly #plotlyShapes: Partial<Shape>[] = [];
  readonly #plotlyAnnotations: Partial<Annotations>[] = [];
  #size: number;

  constructor() {
    this.#size = this.#periods.length;
  }

  /**
   * Each update call is regarded as period end csvTimeStamp.
   * @param name Name of the period
   * @param csvTimeStamp The timestamp string for the end of the period
   */
  update(name: string, csvTimeStamp: CsvDateTimeStamp = this.#defaultTimeStamp) {
    const previousEntry = this.#periods[this.#size - 1];
    let period;

    if (this.#size === 0) {
      period = this.#createNewPeriod(this.#defaultTimeStamp, csvTimeStamp, name);
    } else if (previousEntry[0] === name) {
      period = this.#updateExistingPeriod(previousEntry, csvTimeStamp, name);
    } else {
      period = this.#createNewPeriod(previousEntry[1].end, csvTimeStamp, name);
    }

    this.#periodMap.set(name, period);
    this.#size = this.#periods.length;
  }

  #createNewPeriod(start: CsvDateTimeStamp, end: CsvDateTimeStamp, name: string): CsvTimeInterval {
    const period = new CsvTimeInterval(start, end);
    this.#periods.push([name, period]);
    this.#addPlotlyElements(name, period, this.#size);
    return period;
  }

  #updateExistingPeriod(previousEntry: [string, CsvTimeInterval], end: CsvDateTimeStamp, name: string): CsvTimeInterval {
    const period = new CsvTimeInterval(previousEntry[1].start, end);
    previousEntry[1] = period;
    this.#updatePlotlyElements(name, period, this.#size - 1);
    return period;
  }

  #addPlotlyElements(name: string, period: CsvTimeInterval, index: number) {
    this.#plotlyShapes.push(this.#createPlotlyShape(name, period, index));
    this.#plotlyShapes.push(this.#createPlotlyShape(name, period, index, 'error'));
    this.#plotlyAnnotations.push(this.#createPlotlyAnnotation(name, period, index));
  }

  #updatePlotlyElements(name: string, period: CsvTimeInterval, index: number) {
    this.#plotlyShapes[index-1] = this.#createPlotlyShape(name, period, index);
    this.#plotlyShapes[index] = this.#createPlotlyShape(name, period, index, 'error');
    this.#plotlyAnnotations[index] = this.#createPlotlyAnnotation(name, period, index);
  }

  get(periodName: string): CsvTimeInterval {
    return this.#periodMap.get(periodName) ?? new CsvTimeInterval();
  }

  get plotlyShapes(): Partial<Shape>[] {
    return this.#plotlyShapes;
  }

  get plotlyStageAnnotations(): Partial<Annotations>[] {
    return this.#plotlyAnnotations;
  }

  getDateTimeString(periodName: string): { start: string; end: string } {
    const csvTimePeriod = this.get(periodName);
    if (!csvTimePeriod) {
      return {start: this.#defaultTimeStamp.dateTimeString, end: this.#defaultTimeStamp.dateTimeString};
    }
    return {start: csvTimePeriod.start.dateTimeString, end: csvTimePeriod.end.dateTimeString};
  }

  #createPlotlyShape(name: string, period: CsvTimeInterval, stageCounter: number, type: 'error' | 'stage' = 'stage'): Partial<Shape> {
    const color = stageColors[stageCounter % stageColors.length] + '33';
    return new PlotlyScatterStage(name, [period.start.dateTimeString, period.end.dateTimeString], ActionStages.#Y_VALS[type], color).toPlotlyFormat();
  }

  #createPlotlyAnnotation(name: string, period: CsvTimeInterval, stageCounter: number): Partial<Annotations> {
    const color = stageColors[stageCounter % stageColors.length] + '70';
    return new PlotlyScatterStageAnnotation(name, period.start.dateTimeString, color).toPlotlyFormat();
  }
}
