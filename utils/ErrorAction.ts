import CsvDateTimeStamp from "@/utils/CsvDateTimeStamp";

export default class ErrorAction {
    triggered: boolean;
    time: CsvDateTimeStamp;
    constructor(triggered:boolean = false, time:CsvDateTimeStamp = new CsvDateTimeStamp()) {
        this.triggered=triggered;
        this.time=time;
    }
    reset(){
        this.triggered=false;
        this.time = new CsvDateTimeStamp();
    };
}
