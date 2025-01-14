import React, {useContext, useEffect, useState} from 'react';
import dynamic from 'next/dynamic';
import {useCognitiveLoadData} from '@/app/hooks/useCognitiveLoadData';
import PlotContext from '@/app/ui/components/PlotContext';
import PulseLoader from '@/app/ui/components/PulseLoader';
import {Data} from 'plotly.js';
import addTimeTracer from '@/app/utils/addVideoTimeTracerToPlot';
import {CognitiveLoadDataSource, DataSources} from '@/types';

// Dynamically import Plotly with no SSR
const Plot = dynamic(() => import('react-plotly.js'), {ssr: false});

type SourceName = keyof CognitiveLoadDataSource;
type SimulationDate = keyof DataSources;

const CognitiveLoadPlot = ({
  currentTime,
  selectedSource,
  selectedDate
}: {
  currentTime: number;
  selectedSource: string;
  selectedDate: SimulationDate;
}) => {
  const {dataSources, actionsData} = useContext(PlotContext);
  const actionsLayout = actionsData.actionsLayout;
  const {cognitiveLoadData, cognitiveLoadLayout} = useCognitiveLoadData(
    dataSources,
    selectedDate,
    selectedSource as SourceName
  );
  const plotData: Data[] = addTimeTracer(currentTime, cognitiveLoadData, {});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true); // Set loading state when selectedSource changes
  }, [selectedSource, selectedDate]);

  useEffect(() => {
    if (cognitiveLoadData && cognitiveLoadData[0] && cognitiveLoadLayout) {
      setIsLoading(false); // Data is ready, disable loading
    }
  }, [cognitiveLoadData, cognitiveLoadLayout]);

  return (
    <div className='flex flex-col items-center p-4' style={{height: '500px', position: 'relative'}}>
      <PulseLoader isLoading={isLoading} text={'Fetching data for Cognitive Load'} />
      <Plot
        data={plotData}
        layout={{
          ...cognitiveLoadLayout,
          ...{
            shapes: actionsLayout.shapes,
            xaxis: actionsLayout.xaxis
          }
        }}
        config={{displayModeBar: true, responsive: true, displaylogo: false}}
        style={{width: '100%', height: '100%'}}
        useResizeHandler={true} // Ensure the plot adjusts size when container changes
      />
    </div>
  );
};

export default CognitiveLoadPlot;
