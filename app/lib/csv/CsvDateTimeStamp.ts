import {getBeginningOfDayString, parseTime} from '@/app/utils/timeUtils';

export default class CsvDateTimeStamp {
    static readonly defaultTime ={
        dateTimeString: getBeginningOfDayString(),
        timeStampString: '00:00:00',
        seconds: 0
    };
    readonly dateTimeString: string = CsvDateTimeStamp.defaultTime.dateTimeString;
    readonly timeStampString: string = CsvDateTimeStamp.defaultTime.timeStampString;
    readonly seconds: number = CsvDateTimeStamp.defaultTime.seconds;

    constructor(timeString?: string) {
        if (timeString) {
            const time = parseTime(timeString);
            if(time) {
                this.dateTimeString = time.dateTimeString;
                this.timeStampString = time.timeStampString;
                this.seconds = time.seconds;
            }
        }
    }
}
