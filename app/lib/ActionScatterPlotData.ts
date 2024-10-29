import ActionsScatterPlotPoint from '@/app/lib/ActionsScatterPlotPoint';
import {PlotlyScatterData} from '@/app/utils/plotly/PlotlyScatterData';
import {PlotData} from 'plotly.js';
import {ImageWithName} from '@/types';
import {Today} from '@/app/utils/TodayDateTimeConverter';

export default class ActionScatterPlotData {
  readonly points: ActionsScatterPlotPoint[] = [];
  readonly plotlyData = new PlotlyScatterData();
  readonly plotlyImages = new Array<ImageWithName>();
  lastDateTimeString = '';

  markPreviousError() {
    this.getPrevious().markError();
    this.plotlyData.colors[this.plotlyData.colors.length - 1] = ActionsScatterPlotPoint.ERROR_MARKER_COLOR;
  }

  add(point: ActionsScatterPlotPoint) {
    this.points.push(point);
    this.points.push(point);
    this.plotlyData.x.push(point.x.dateTimeString);
    this.plotlyData.y.push(point.y);
    this.plotlyData.customdata.push(point.name);
    this.plotlyData.text.push(point.dataText);
    this.plotlyData.hovertext.push(point.hovertext);
    this.plotlyData.colors.push(point.color);
    this.plotlyImages.push(point.plotlyImage);
  }

  createPlotScatterData(): Partial<PlotData> {
    return this.plotlyData.toPlotlyFormat();
  }

  getPrevious(): ActionsScatterPlotPoint {
    return this.points[this.points.length - 1];
  }

  xAxisRange(): [(string | number), (string | number)] {
    return [Today.getBeginningOfDayString(), this.lastDateTimeString];
  }
}
