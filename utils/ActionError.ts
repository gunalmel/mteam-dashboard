import CsvDateTimeStamp from '@/utils/CsvDateTimeStamp';
import ActionsCsvRow from '@/utils/ActionsCsvRow';

export default class ActionError {
    readonly name: string;
    readonly time: CsvDateTimeStamp;
    readonly explanation: string;
    readonly annotation: string;

    constructor(row: ActionsCsvRow) {
        this.name = row.actionOrVitalName;
        this.time = row.timeStamp;
        this.explanation = row.triggeredError?row.speechCommand:'';
        this.annotation= `${this.name}${this.explanation ? ' - ' + this.explanation : ''}`;
        // this.severity = row.triggeredError?row.subActionTime:''; //Warning|Error|Critical Error
        // this.actionExplanation = row.triggeredError?row.subAction:''; //Action-Should-Be-Performed|Action-Should-Not-Be-Performed
        // this.actionPerformed = row.triggeredError?row.score:''; //Action-Performed|Action-Not-Performed
        // this.status = row.oldValue;//uses oldValue = Error-Triggered | Error-Not-Triggered
        // this.user = row.newValue; // 'New Value': newValue, //umich1|NA
    }
}
