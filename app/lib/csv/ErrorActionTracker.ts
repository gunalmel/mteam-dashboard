import CsvDateTimeStamp from '@/app/lib/csv/CsvDateTimeStamp';

export default class ErrorActionTracker {
    #time: CsvDateTimeStamp;
    #explanation = '';
    constructor(time:CsvDateTimeStamp = new CsvDateTimeStamp()) {
        this.#time=time;
    }
    get time(): CsvDateTimeStamp {
        return this.#time;
    }
    get explanation(): string {
        return this.#explanation;
    }
    reset(){
        this.#time = new CsvDateTimeStamp();
    };

    track(timeStamp: CsvDateTimeStamp, explanation: string) {
        this.#time = timeStamp;
        this.#explanation = explanation;
    }
}
