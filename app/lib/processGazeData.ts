import {GazeData, GazeDataStack} from '@/types';
import {PlotData} from 'plotly.js';

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
  if(current && current.time<=windowEndValue){
    const windowCount = out[out.length-1];
    if(current.category) {
      windowCount.counts[current.category] = (windowCount.counts[current.category] || 0) + 1;
      windowCount.totalCount++;
    }
  }else if(current){
    convertCountToFraction(out[out.length-1]);
    windowEndValue+=windowSize;
    out.push({time: windowEndValue, counts:current.category?{[current.category]: 1}:{}, totalCount:current.category?1:0});
  }

  return countSlidingWindowCategory(data,++startIdx,windowEndValue,windowSize,out);
}

export function processGazeData(data: GazeData[], windowSize: number): GazeDataStack[] {
  if(!data || data.length===0){
    return [];
  }
  const windowEndValue = data[0].time+windowSize;
  const result: GazeDataStack[] = [{time: windowEndValue, counts:{[data[0].category??'']: 0}, totalCount:0}];
  return countSlidingWindowCategory(data,0,windowEndValue,windowSize,result);
}

export function transformGazeDataForPlotly(categoryCounts: GazeDataStack[]): {tickVals: string[], plotlyData: Partial<PlotData>[]} {
  const result = categoryCounts.reduce((acc, item) => {
    const timeString = new Date(item.time * 1000).toISOString();
    acc.tickVals.push(timeString); // This is needed for the x-axis tick values to display without missing values

    Object.entries(item.counts).forEach(([category, count]) => {
      // Initialize category entry if it doesn't exist
      if (!acc.dataSeries[category]) {
        acc.dataSeries[category] = { x: [], y: [], name: category, type: 'bar' as const };
      }
      // Append time and count for each category
      acc.dataSeries[category].x.push(timeString);
      acc.dataSeries[category].y.push(count);
    });

    return acc;
  }, {tickVals:[], dataSeries:{}} as {tickVals:string[], dataSeries:Record<string, {x: string[]; y: number[]; name: string; type: 'bar' }>} );

  // Convert the result object to an array of series for Plotly
  return {tickVals: result.tickVals, plotlyData: Object.values(result.dataSeries)};
}


