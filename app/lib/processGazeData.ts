import {GazeData, GazeDataStack} from '@/types';

function countSlidingWindowCategory(data: GazeData[],startIdx:number,windowEndValue:number,windowSize:number,out:GazeDataStack[]):GazeDataStack[]{
  if(!data || data.length===0){
    return [];
  }

  if(startIdx>=data.length){
    return out;
  }

  const current = data[startIdx];
  if(current && current.time<=windowEndValue){
    const windowCount = out[out.length-1];
    windowCount.counts[current.category??''] = (windowCount.counts[current.category??'']||0)+1;
  }else if(current){
    windowEndValue+=windowSize;
    out.push({time: windowEndValue, counts:{[current.category??'']: 1}});
  }

  return countSlidingWindowCategory(data,++startIdx,windowEndValue,windowSize,out);
}

export function processGazeData(data: GazeData[], windowSize: number): GazeDataStack[] {
  if(!data || data.length===0){
    return [];
  }
  const windowEndValue = data[0].time+windowSize;
  const result: GazeDataStack[] = [{time: windowEndValue, counts:{[data[0].category??'']: 0}}];
  return countSlidingWindowCategory(data,0,windowEndValue,windowSize,result);
}

export // Function to transform data into Plotly format for a stacked bar chart
function transformGazeDataForPlotly(categoryCounts: GazeDataStack[], categories: string[]) {
  const x = categoryCounts.map((d) => new Date(d.time * 1000).toISOString()); // Convert to ISO string for better readability
  return categories.map((category) => ({
    x: x,
    y: categoryCounts.map((d) => d.counts[category] || 0),
    name: category,
    type: 'bar'
  }));
}

