/**
 * Helps to build up a list of named time periods one by one, sequentially. Each time a named period is updated:
 * If no entry exists, a new entry is created with the start time as the default time and the end time as the time string provided.
 * If the previous entry exists with the same name, the end time is for the previous entry is updated.
 * Otherwise, a new entry created with same start date as the previous one and the end date is set to the time string provided.
 */
export default class SequentialTimePeriods {
  readonly #periods: Array<[string,{ start: string; end: string }]> =[];
  readonly #defaultTimeString = '2017-01-01 00:00:00';
  #size: number;

  constructor() {
    this.#size = this.#periods.length;
  }

  /**
   * Each update call is regarded as period end time.
   * @param name Name of the period
   * @param timeString The timestamp string for the end of the period
   */
  update(name: string, timeString: string = this.#defaultTimeString) {
    const previousEntry = this.#periods[this.#size-1];
    if(this.#size===0){
      this.#periods.push([name,{start:this.#defaultTimeString,end:timeString}]);
    }
    else if(previousEntry[0]===name){
      previousEntry[1].end=timeString;
    }else{
      this.#periods.push([name,{start:previousEntry[1].end,end:timeString}]);
    }
    this.#size = this.#periods.length;
  }

  get(periodName: string): { start: string; end: string } | undefined {
    return this.#periods.find(([name]) => name === periodName)?.[1];
  }

  getAll(): { [key: string]: { start: string; end: string } } {
    return Object.fromEntries(new Map(this.#periods));
  }
}
