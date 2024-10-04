import ActionsScatterPlotPoint from '@/app/lib/ActionsScatterPlotPoint';
import {PlotlyScatterData} from '@/app/utils/plotly/PlotlyScatterData';
import {PlotData} from 'plotly.js';
import {ImageWithName} from '@/types';

export default class ActionScatterPlotData {
    readonly points: ActionsScatterPlotPoint[] = [];

    markPreviousError() {
        this.points[this.points.length - 1].color = ActionsScatterPlotPoint.ERROR_MARKER_COLOR;
    }

    add(point: ActionsScatterPlotPoint) {
        this.points.push(point);
    }

    // we may need to update sizex using the difference between max and min values of x to display images properly.
    // e.g. 100 * dataRange
    collectPlotImages(): ImageWithName[] {
        return this.points.map(p=>p.plotlyImage);
    }

    createPlotScatterData(): Partial<PlotData>{
        const data = new PlotlyScatterData();
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

    getPrevious(): ActionsScatterPlotPoint {
        return this.points[this.points.length - 1];
    }

    xAxisRange():[(string|number),(string|number)] {
        return [0, this.points[this.points.length - 1].x.dateTimeString + 10];
    }
}
