import {GazeData, GazeDataStack} from '@/types';
import {PlotData} from 'plotly.js';
import {Today} from '@/app/utils/TodayDateTimeConverter';

function convertCountToFraction(window: GazeDataStack): void {
  Object.entries(window.counts).forEach(([key])=>{
    window.counts[key] /= window.totalCount;
  });
}

function countSlidingWindowCategory(data: GazeData[],startIdx:number,windowEndValue:number,windowSize:number,out:GazeDataStack[]):GazeDataStack[]{
  if(!data || data.length===0){
    return [];
  }

  if(startIdx>=data.length){
    convertCountToFraction(out[out.length-1]);
    return out;
  }

  const current = data[startIdx];
  const elapsedSeconds = current.time - data[0].time;
  if(current && elapsedSeconds<=windowEndValue){
    const windowCount = out[out.length-1];
    if(current.category) {
      windowCount.counts[current.category] = (windowCount.counts[current.category] || 0) + 1;
      windowCount.totalCount++;
    }
  }else if(current){
    convertCountToFraction(out[out.length-1]);
    windowEndValue+=windowSize;
    out.push({time: Today.parseSeconds(windowEndValue).dateTimeString, counts:current.category?{[current.category]: 1}:{}, totalCount:current.category?1:0});
  }

  return countSlidingWindowCategory(data,++startIdx,windowEndValue,windowSize,out);
}

export function processGazeData(data: GazeData[], windowSize: number): GazeDataStack[] {
  if(!data || data.length===0){
    return [];
  }
  const result: GazeDataStack[] = [{time: Today.parseSeconds(windowSize).dateTimeString, counts:{[data[0].category??'']: 0}, totalCount:0}];
  return countSlidingWindowCategory(data,0,windowSize,windowSize,result);
}

export function transformGazeDataForPlotly(categoryCounts: GazeDataStack[]): {tickVals: string[], plotlyData: Partial<PlotData>[]} {
  const result = categoryCounts.reduce((acc, item) => {
    acc.tickVals.push(item.time); // This is needed for the x-axis tick values to display without missing values

    Object.entries(item.counts).forEach(([category, count]) => {
      // Initialize category entry if it doesn't exist
      if (!acc.dataSeries[category]) {
        acc.dataSeries[category] = { x: [], y: [], name: category, type: 'bar' as const };
      }
      // Append time and count for each category
      acc.dataSeries[category].x.push(item.time);
      acc.dataSeries[category].y.push(count);
    });

    return acc;
  }, {tickVals:[], dataSeries:{}} as {tickVals:string[], dataSeries:Record<string, {x: string[]; y: number[]; name: string; type: 'bar' }>} );

  // Convert the result object to an array of series for Plotly
  return {tickVals: result.tickVals, plotlyData: Object.values(result.dataSeries)};
}


