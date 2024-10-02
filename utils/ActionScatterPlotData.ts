import CsvDateTimeStamp from '@/utils/CsvDateTimeStamp';
import ActionsScatterPlotPoint from '@/utils/ActionsScatterPlotPoint';

export default class ActionScatterPlotData {
    readonly x: Array<CsvDateTimeStamp> = [];
    readonly y: number[] = [];
    readonly names: string[] = [];
    readonly annotations: string[] = [];
    readonly colors: string[] = [];
    readonly points: Array<ActionsScatterPlotPoint> = [];

    markPreviousError() {
        this.colors[this.colors.length - 1] = ActionsScatterPlotPoint.ERROR_MARKER_COLOR;
    }

    add(point: ActionsScatterPlotPoint) {
        this.x.push(point.x);
        this.y.push(point.y);
        this.names.push(point.name);
        this.annotations.push(point.annotation);
        this.colors.push(point.color);
        this.points.push(point);
    }

    getPrevious() {
        return this.points[this.points.length-1];
    }
}
