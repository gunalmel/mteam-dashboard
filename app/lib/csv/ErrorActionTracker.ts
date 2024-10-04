import CsvDateTimeStamp from '@/app/lib/csv/CsvDateTimeStamp';

export default class ErrorActionTracker {
    #time: CsvDateTimeStamp;
    constructor(time:CsvDateTimeStamp = new CsvDateTimeStamp()) {
        this.#time=time;
    }
    get time(): CsvDateTimeStamp {
        return this.#time;
    }
    reset(){
        this.#time = new CsvDateTimeStamp();
    };

    track(timeStamp: CsvDateTimeStamp) {
        this.#time = timeStamp;
    }
}
