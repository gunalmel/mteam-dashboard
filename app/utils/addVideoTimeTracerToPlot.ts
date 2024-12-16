// A vertical line traces the video playback time on the plot allowing the user to see the actions taken at that time
import {Data} from 'plotly.js';
import {Today} from '@/app/utils/TodayDateTimeConverter';
import {PlotlyCurrentTimeMarker} from '@/app/utils/plotly/PlotlyCurrentTimeMarker';

const addTimeTracer = (currentTime: number, plotData: Data[], yMin=0, yMax=1) => {
  const currentTimeFormatted = Today.parseSeconds(currentTime).dateTimeString;
  const currentTimeMarker: Data = new PlotlyCurrentTimeMarker(
    [currentTimeFormatted, currentTimeFormatted],
    [yMin, yMax]
  ).toPlotlyFormat();
  return [...plotData, currentTimeMarker];
};

export default addTimeTracer;
