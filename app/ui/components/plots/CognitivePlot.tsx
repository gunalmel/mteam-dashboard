import React, {useContext, useEffect, useState} from 'react';
import dynamic from 'next/dynamic';
import {useCognitiveLoadData} from '@/app/hooks/useCognitiveLoadData';
import PlotContext from '@/app/ui/components/PlotContext';
import PlotsFileSource from '@/app/utils/plotSourceProvider';
// Dynamically import Plotly with no SSR
const Plot = dynamic(() => import('react-plotly.js'), {ssr: false});

type SourceName = keyof typeof PlotsFileSource.cognitiveLoad;

const CognitiveLoadPlot = ({selectedSource}: {selectedSource: string}) => {
  const {actionsLayout} = useContext(PlotContext);
  const {cognitiveLoadData, cognitiveLoadLayout} = useCognitiveLoadData(selectedSource as SourceName);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true); // Set loading state when selectedSource changes
  }, [selectedSource]);

  useEffect(() => {
    if (cognitiveLoadData && cognitiveLoadData[0] && cognitiveLoadLayout) {
      setIsLoading(false); // Data is ready, disable loading
    }
  }, [cognitiveLoadData, cognitiveLoadLayout]);

  if (isLoading) {
    return <div>Loading Cognitive Load Plot...</div>;
  }

  return (
    <div className='flex flex-col items-center p-4' style={{height: '500px'}}>
      <Plot
        data={cognitiveLoadData}
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
