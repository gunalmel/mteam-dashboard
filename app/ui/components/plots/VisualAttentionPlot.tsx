'use client';
import React, {useContext, useEffect, useState} from 'react';
import {Data, Layout, Shape} from 'plotly.js';
import dynamic from 'next/dynamic';
import {useGazeData} from '@/app/hooks/useGazeData';
import PlotsFileSource from '@/app/utils/plotSourceProvider';
import PlotContext from '@/app/ui/components/PlotContext';
import PlotlyScatterLayout from '@/app/utils/plotly/PlotlyScatterLayout';
import PulseLoader from '@/app/ui/components/PulseLoader';
import addTimeTracer from '@/app/utils/addVideoTimeTracerToPlot';

const Plot = dynamic(() => import('react-plotly.js'), {ssr: false});

const SLIDING_WINDOW_SIZE_SECONDS = 10; // 10-second window

type SourceName = keyof typeof PlotsFileSource[string]['visualAttention'];
type SimulationDate = keyof typeof PlotsFileSource;

const VisualAttentionPlot = ({
  currentTime,
  selectedSource,
  selectedDate
}: {
  currentTime: number;
  selectedSource: string;
  selectedDate: SimulationDate;
}) => {
  const {dataSources, actionsData} = useContext(PlotContext);
  const actionsLayout =  actionsData.actionsLayout;
  const [gazeData] = useGazeData(dataSources, SLIDING_WINDOW_SIZE_SECONDS, selectedDate, selectedSource as SourceName);
  const plotData: Data[] = addTimeTracer(currentTime, gazeData.plotlyData??[], {color:'#610C04'} );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true); // Set loading state when selectedSource changes
  }, [selectedSource, selectedDate]);

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
              t: 50,
              l: 50,
              r: 50,
              b: 50
            },
            barmode: 'stack',
            bargap: 0,
            xaxis: actionsLayout.xaxis,
            legend: {
              orientation: 'h',
              x: 0.5,
              y: 1,
              xanchor: 'center',
              yanchor: 'bottom',
              traceorder: 'normal'
            }
          } as Partial<Layout>)
        }}
        config={{displayModeBar: true, responsive: true, displaylogo: false}}
        style={{width: '100%', height: '100%'}}
        useResizeHandler={true}
      />
    </div>
  );
};

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

export default VisualAttentionPlot;
