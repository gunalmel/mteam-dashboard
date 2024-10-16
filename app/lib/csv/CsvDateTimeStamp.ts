import {Today} from '@/app/utils/TodayDateTimeConverter';

export default class CsvDateTimeStamp {
    static readonly defaultTime ={
        dateTimeString: Today.getBeginningOfDayString(),
        timeStampString: '00:00:00',
        seconds: 0
    };
    readonly dateTimeString: string = CsvDateTimeStamp.defaultTime.dateTimeString;
    readonly timeStampString: string = CsvDateTimeStamp.defaultTime.timeStampString;
    readonly seconds: number = CsvDateTimeStamp.defaultTime.seconds;

    constructor(timeString?: string) {
        if (timeString) {
            const time = Today.parseTime(timeString);
            if(time) {
                this.dateTimeString = time.dateTimeString;
                this.timeStampString = time.timeStampString;
                this.seconds = time.seconds;
            }
        }
    }
}
