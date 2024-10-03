import ActionsScatterPlotPoint from '@/utils/ActionsScatterPlotPoint';
import {ScatterPlotlyData} from '@/utils/ScatterPlotlyData';

export default class ActionScatterPlotData {
    readonly points: Array<ActionsScatterPlotPoint> = [];

    markPreviousError() {
        this.points[this.points.length - 1].color = ActionsScatterPlotPoint.ERROR_MARKER_COLOR;
    }

    add(point: ActionsScatterPlotPoint) {
        this.points.push(point);
    }

    // we may need to update sizex using the difference between max and min values of x to display images properly.
    // e.g. 100 * dataRange
    collectPlotImages() {
        return this.points.map(p=>p.plotlyImage);
    }

    createPlotScatterData(){
        const data = new ScatterPlotlyData();
        this.points.forEach(point=>{
            data.x.push(point.x.dateTimeString);
            data.y.push(point.y);
            data.customdata.push(point.icon.name);
            data.text.push(point.dataText);
            data.hovertext.push(point.hovertext);
            data.colors.push(point.color);
        });
        return data.toPlotlyFormat();
    }

    getPrevious() {
        return this.points[this.points.length - 1];
    }

    // dataRange() {
    //     return this.points[this.points.length - 1].x.seconds - this.points[0].x.seconds
    // }

    xAxisRange() {
        return [0, this.points[this.points.length - 1].x.dateTimeString + 10];
    }
}
