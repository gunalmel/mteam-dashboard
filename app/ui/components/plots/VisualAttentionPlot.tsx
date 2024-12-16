'use client';
import {Data, Layout, Shape} from 'plotly.js';
import dynamic from 'next/dynamic';
import {useGazeData} from '@/app/hooks/useGazeData';
import PlotsFileSource from '@/app/utils/plotSourceProvider';
import React, {useContext, useEffect, useState} from 'react';
import PlotContext from '@/app/ui/components/PlotContext';
import PlotlyScatterLayout from '@/app/utils/plotly/PlotlyScatterLayout';
import PulseLoader from '@/app/ui/components/PulseLoader';
import addTimeTracer from '@/app/utils/addVideoTimeTracerToPlot';

const Plot = dynamic(() => import('react-plotly.js'), {ssr: false});

const windowSize = 10; // 10-second window

type SourceName = keyof typeof PlotsFileSource.visualAttention;

// Generates vertical dotted line shapes separating stages/transitions using context actionsLayout.shapes
const generateVerticalLineShapes = (shapesArray: Partial<Shape>[]): Partial<Shape>[] => {
  // Extract unique x1 values for vertical lines
  const uniqueX1Values = Array.from(new Set(shapesArray.map((shape) => shape.x1)));

  // Create vertical line shapes for each unique x1 value
  return uniqueX1Values.map((x1Value) => ({
    type: 'line',
    x0: x1Value,
    x1: x1Value,
    y0: 0,
    y1: 1,
    xref: 'x',
    yref: 'paper',
    line: {
      color: 'black',
      width: 2,
      dash: 'dot'
    }
  })) as Partial<Shape>[];
};

const VisualAttentionPlot = ({currentTime, selectedSource}: {currentTime:number, selectedSource: string}) => {
  const {actionsLayout} = useContext(PlotContext);
  const [gazeData] = useGazeData(windowSize, selectedSource as SourceName);
  const plotData: Data[] = addTimeTracer(currentTime, gazeData.plotlyData??[]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true); // Set loading state when selectedSource changes
  }, [selectedSource]);

  useEffect(() => {
    if (gazeData && gazeData.plotlyData && gazeData.plotlyData[0]) {
      setIsLoading(false); // Data is ready, disable loading
    }
  }, [gazeData]);

  // Generate vertical line shapes based on actionsLayout.shapes
  const verticalLineShapes = generateVerticalLineShapes(actionsLayout.shapes || []);

  const layoutConfig = new PlotlyScatterLayout(
    'Visual Attention - (sliding window: 10 s, step: 10 s)',
    verticalLineShapes,
    [],
    [0, 0],
    []
  );

  layoutConfig.yaxis = {title: 'Proportion of time spent looking at each area of interest', range: [0, 1]};
  layoutConfig.showLegend = true;

  return (
    <div className='flex flex-col items-center p-4' style={{height: '500px', position: 'relative'}}>
      <PulseLoader isLoading={isLoading} text={'Fetching data for Visual Attention'}/>
      <Plot
        data={plotData}
        layout={{
          ...layoutConfig.toPlotlyFormat(),
          ...({
            margin: {
              // This is to position the title
              t: 50, // Adjust this value to control the top margin
              l: 50, // Left margin
              r: 50, // Right margin
              b: 50 // Bottom margin
            },
            barmode: 'stack',
            bargap: 0, // Remove gaps between bars
            xaxis: actionsLayout.xaxis,
            legend: {
              orientation: 'h', // Set the legend to horizontal
              x: 0.5, // Center the legend horizontally
              y: 1, // Position the legend above the plot
              xanchor: 'center',
              yanchor: 'bottom',
              traceorder: 'normal' // Set trace order as normal to get the desired category order otherwise it's reversed
            }
          } as Partial<Layout>)
        }}
        config={{displayModeBar: true, responsive: true, displaylogo: false}}
        style={{width: '100%', height: '100%'}}
        useResizeHandler={true} // Ensure the plot adjusts size when container changes
      />
    </div>
  );
};

export default VisualAttentionPlot;
