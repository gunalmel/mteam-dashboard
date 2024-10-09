import React, {useEffect, useRef} from 'react';
import dynamic from 'next/dynamic';
import {useActionsData} from '@/app/hooks/useActionsData';
import {Today} from '@/app/utils/timeUtils';
import {Data, Layout, PlotMouseEvent} from 'plotly.js';
import {explanationItems} from '@/app/ui/components/constants';

// Dynamically import Plotly with no SSR
const Plot = dynamic(() => import('react-plotly.js'), {ssr: false});

const ActionsPlot = ({setActions, onClick, selectedMarkers, currentTime}: {
  setActions: (markers:typeof explanationItems)=> void,
  onClick: (event: Readonly<PlotMouseEvent>) => void,
  selectedMarkers: string[],
  currentTime: number
}) => {
  const firstTimeLoad = useRef(true);
  const {actionsData, actionsLayout} = useActionsData(selectedMarkers);
  // Convert currentTime (in seconds) to the same format as the plot data
  const currentTimeFormatted = Today.parseSeconds(currentTime).dateTimeString;

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
  const actions = (actionsData[0]?.customdata as string[]);
  if (actions && firstTimeLoad.current) {
    const filterActions = actions.filter((value, index, array) => array.indexOf(value) === index)
      .map((action) => explanationItems.find((item) => item.relatedMarkers.includes(action)));
    setActions(filterActions as typeof explanationItems);
    firstTimeLoad.current = false;
  }

  const layout: Partial<Layout> = {
    ...actionsLayout,
    shapes: [...(actionsLayout.shapes || [])]
  };

  useEffect(() => {
    // console.log('ActionsPlot Current Video Time:', currentTimeFormatted);
  }, [currentTimeFormatted]);

  return (
    <Plot
      onClick={(e)=>onClick(e)}
      data={plotData}
      layout={layout}
      config={{displayModeBar: true, responsive: true, displaylogo: false}}
      style={{width: '100%', height: '100%'}}
      useResizeHandler={true} // Ensure the plot adjusts size when container changes
    />
  );
};

export default ActionsPlot;
