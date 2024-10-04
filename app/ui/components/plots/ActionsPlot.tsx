import React, {useEffect} from 'react';
import dynamic from 'next/dynamic';
import {useActionsData} from '@/app/hooks/useActionsData';
import {parseTime} from '@/app/utils/timeUtils';
import {Data, Layout, PlotHoverEvent} from 'plotly.js';

// Dynamically import Plotly with no SSR
const Plot = dynamic(() => import('react-plotly.js'), {ssr: false});

const ActionsPlot = ({onHover, selectedMarkers, currentTime}: {
  onHover: (event: PlotHoverEvent) => void,
  selectedMarkers: string[],
  currentTime: number
}) => {
  const {actionsData, actionsLayout} = useActionsData(selectedMarkers);

  // Convert currentTime (in seconds) to the same format as the plot data
  const currentTimeFormatted = parseTime(new Date(currentTime * 1000).toISOString().slice(11, 19)).dateTimeString;

  // Define the current time marker
  const currentTimeMarker: Partial<Data> = {
    type: 'scatter',
    mode: 'lines',
    x: [currentTimeFormatted, currentTimeFormatted],
    y: [0, 12], // Adjust y range as needed - must be equal or greater than y1 value in createTransition boundary
    line: {color: 'red', width: 2}
  };

  // Add the current time marker to the plot data
  const plotData: Partial<Data>[] = [...actionsData, currentTimeMarker];

  const layout: Partial<Layout> = {
    ...actionsLayout,
    shapes: [...(actionsLayout.shapes || [])]
  };

  useEffect(() => {
    // console.log('ActionsPlot Current Video Time:', currentTimeFormatted);
  }, [currentTimeFormatted]);

  return (
    <Plot
      data={plotData}
      layout={layout}
      config={{displayModeBar: true, responsive: true, displaylogo: false}}
      onHover={onHover}
      style={{width: '100%', height: '100%'}}
      useResizeHandler={true} // Ensure the plot adjusts size when container changes
    />
  );
};

export default ActionsPlot;
