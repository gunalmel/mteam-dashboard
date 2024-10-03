import CsvDateTimeStamp from '@/utils/CsvDateTimeStamp';

export default class CsvTimePeriod{
    readonly start: CsvDateTimeStamp;
    readonly end: CsvDateTimeStamp;
    readonly duration: number;
    constructor(start: CsvDateTimeStamp = new CsvDateTimeStamp(), end: CsvDateTimeStamp = new CsvDateTimeStamp()) {
        this.start = start;
        this.end = end;
        this.duration = end.seconds - start.seconds;
    }
}
