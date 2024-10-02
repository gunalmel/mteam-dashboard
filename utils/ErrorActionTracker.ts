import CsvDateTimeStamp from '@/utils/CsvDateTimeStamp';

export default class ErrorActionTracker {
    time: CsvDateTimeStamp;
    constructor(time:CsvDateTimeStamp = new CsvDateTimeStamp()) {
        this.time=time;
    }
    reset(){
        this.time = new CsvDateTimeStamp();
    };
}
