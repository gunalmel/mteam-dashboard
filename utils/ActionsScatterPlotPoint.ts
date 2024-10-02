import ActionsCsvRow from "@/utils/ActionsCsvRow";
import {yValues} from "@/components/constants";
import CsvDateTimeStamp from "@/utils/CsvDateTimeStamp";

export default class ActionsScatterPlotPoint {
    static readonly ERROR_MARKER_COLOR = 'red';
    static readonly CORRECT_MARKER_COLOR = 'green';

    readonly x: CsvDateTimeStamp;
    readonly y: number;
    readonly name: string;
    readonly annotation: string;
    color: string = ActionsScatterPlotPoint.CORRECT_MARKER_COLOR;

    constructor(parsedCsvRow: ActionsCsvRow){
        this.x = parsedCsvRow.timeStamp;
        this.y = yValues[parsedCsvRow.actionName];
        this.name = parsedCsvRow.actionName;
        this.annotation = parsedCsvRow.actionAnnotation;
    }

    markError() {
        this.color=ActionsScatterPlotPoint.ERROR_MARKER_COLOR;
    }

    markCorrect() {
        this.color=ActionsScatterPlotPoint.CORRECT_MARKER_COLOR;
    }
}
