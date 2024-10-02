import CsvDateTimeStamp from '@/utils/CsvDateTimeStamp';

/**
 * Helps to build up a list of named time periods one by one, sequentially. Each time a named period is updated:
 * If no entry exists, a new entry is created with the start time as the default time and the end time as the time string provided.
 * If the previous entry exists with the same name, the end time is for the previous entry is updated.
 * Otherwise, a new entry created with same start date as the previous one and the end date is set to the time string provided.
 */
export default class SequentialTimePeriods {
    readonly #defaultTimeStamp: CsvDateTimeStamp = new CsvDateTimeStamp();
    readonly #periods: Array<[string, { start: CsvDateTimeStamp; end: CsvDateTimeStamp }]> = [];
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
        if (this.#size === 0) {
            this.#periods.push([name, {start: this.#defaultTimeStamp, end: csvTimeStamp}]);
        } else if (previousEntry[0] === name) {
            previousEntry[1].end = csvTimeStamp;
        } else {
            this.#periods.push([name, {start: previousEntry[1].end, end: csvTimeStamp}]);
        }
        this.#size = this.#periods.length;
    }

    get(periodName: string): { start: CsvDateTimeStamp; end: CsvDateTimeStamp } {
        return this.#periods.find(([name]) => name === periodName)?.[1]?? {start:this.#defaultTimeStamp, end:this.#defaultTimeStamp};
    }

    getDateTimeString(periodName: string): { start: string; end: string } {
        const csvTimePeriod = this.get(periodName);
        if (!csvTimePeriod) {
            return {start: this.#defaultTimeStamp.dateTimeString, end: this.#defaultTimeStamp.dateTimeString};
        }
        return {start: csvTimePeriod.start.dateTimeString, end: csvTimePeriod.end.dateTimeString};
    }

    getAll(): { [key: string]: { start: string; end: string } } {
        return Object.fromEntries(new Map(this.#periods.map((periodArray) => {
            return [periodArray[0], {start: periodArray[1].start.dateTimeString, end: periodArray[1].end.dateTimeString}];
        })));
    }
}
