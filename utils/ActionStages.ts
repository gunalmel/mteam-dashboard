import CsvDateTimeStamp from '@/utils/CsvDateTimeStamp';
import CsvTimeInterval from '@/utils/CsvTimeInterval';
import {Annotations, Shape} from 'plotly.js';
import {PlotlyScatterStage} from '@/utils/PlotlyScatterStage';
import {stageColors} from '@/components/constants';
import {PlotlyScatterStageAnnotation} from '@/utils/PlotlyScatterStageAnnotation';

/**
 * Helps to build up a list of named time periods one by one, sequentially. Each time a named period is updated:
 * If no entry exists, a new entry is created with the start time as the default time and the end time as the time string provided.
 * If the previous entry exists with the same name, the end time is for the previous entry is updated.
 * Otherwise, a new entry created with same start date as the previous one and the end date is set to the time string provided.
 */
export default class ActionStages {
    readonly #defaultTimeStamp: CsvDateTimeStamp = new CsvDateTimeStamp();
    readonly #periods: Array<[string, CsvTimeInterval]> = [];
    readonly #periodMap = new Map<string, CsvTimeInterval>();
    readonly #plotlyShapes: Array<Partial<Shape>> = [];
    readonly #plotlyAnnotations: Array<Partial<Annotations>> =[];
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
            period = new CsvTimeInterval(this.#defaultTimeStamp, csvTimeStamp);
            this.#periods.push([name, period]);
            this.#plotlyShapes.push(this.#createPlotlyShape(name, period, this.#size));
            this.#plotlyShapes.push(this.#createPlotlyShape(name, period, this.#size, 'error'));
            this.#plotlyAnnotations.push(this.#createPlotlyAnnotation(name, period, this.#size));
        } else if (previousEntry[0] === name) {
            period = new CsvTimeInterval(previousEntry[1].start, csvTimeStamp);
            previousEntry[1] = period;
            this.#plotlyShapes[this.#size - 1] = this.#createPlotlyShape(name, period, this.#size);
            this.#plotlyShapes[this.#size - 1] = this.#createPlotlyShape(name, period, this.#size, 'error');
            this.#plotlyAnnotations[this.#size - 1] = this.#createPlotlyAnnotation(name, period, this.#size);
        } else {
            period = new CsvTimeInterval(previousEntry[1].end, csvTimeStamp);
            this.#periods.push([name, period]);
            this.#plotlyShapes.push(this.#createPlotlyShape(name, period, this.#size));
            this.#plotlyShapes.push(this.#createPlotlyShape(name, period, this.#size, 'error'));
            this.#plotlyAnnotations.push(this.#createPlotlyAnnotation(name, period, this.#size));
        }
        this.#periodMap.set(name, period);
        this.#size = this.#periods.length;
    }

    get(periodName: string): CsvTimeInterval {
        return this.#periodMap.get(periodName)??new CsvTimeInterval();
    }

    get plotlyShapes(): Array<Partial<Shape>> {
        return this.#plotlyShapes;
    }

    get plotlyStageAnnotations(): Array<Partial<Annotations>> {
        return this.#plotlyAnnotations;
    }

    getDateTimeString(periodName: string): { start: string; end: string } {
        const csvTimePeriod = this.get(periodName);
        if (!csvTimePeriod) {
            return {start: this.#defaultTimeStamp.dateTimeString, end: this.#defaultTimeStamp.dateTimeString};
        }
        return {start: csvTimePeriod.start.dateTimeString, end: csvTimePeriod.end.dateTimeString};
    }

    getMap(): Map<string,CsvTimeInterval> {
        return this.#periodMap;
    }

    #createPlotlyShape(name: string, period: CsvTimeInterval, stageCounter: number, type: 'error'|'stage' = 'stage'): Partial<Shape> {
        const color = stageColors[stageCounter % stageColors.length] + '33';
        return new PlotlyScatterStage(name, period.start.dateTimeString, period.end.dateTimeString, color, type).toPlotlyFormat();
    }

    #createPlotlyAnnotation(name: string, period: CsvTimeInterval, stageCounter: number): Partial<Annotations> {
        const color = stageColors[stageCounter % stageColors.length] + '70';
        return new PlotlyScatterStageAnnotation(name, period.start.dateTimeString, color).toPlotlyFormat();
    }
}
