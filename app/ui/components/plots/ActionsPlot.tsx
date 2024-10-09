import React, {useEffect, useRef} from 'react';
import dynamic from 'next/dynamic';
import {useActionsData} from '@/app/hooks/useActionsData';
import {Today} from '@/app/utils/timeUtils';
import {Data, PlotMouseEvent} from 'plotly.js';
import {explanationItems, yMaxActions} from '@/app/ui/components/constants';
import {PlotlyCurrentTimeMarker} from '@/app/utils/plotly/PlotlyCurrentTimeMarker';

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
  const currentTimeMarker: Partial<Data> = new PlotlyCurrentTimeMarker([currentTimeFormatted, currentTimeFormatted], [0, yMaxActions+1]).toPlotlyFormat();

  // Add the current time marker to the plot data
  const plotData: Partial<Data>[] = [...actionsData, currentTimeMarker];
  const actions = (actionsData[0]?.customdata as string[]);
  // should execute only on the first load to build the list of unique actions user has taken to list the filter options for actions taken only
  if (actions && firstTimeLoad.current) {
    const filterActions = actions.map((action) => explanationItems.find((item) => item.keys.includes(action)))
      .filter((value, index, self) =>
          index === self.findIndex((t) => (
            t?.name === value?.name && t?.url === value?.url
          ))
      );
    setActions(filterActions as typeof explanationItems);
    firstTimeLoad.current = false;
  }

  useEffect(() => {
    // console.log('ActionsPlot Current Video Time:', currentTimeFormatted);
  }, [currentTimeFormatted]);

  return (
    <Plot
      onClick={(e)=>onClick(e)}
      data={plotData}
      layout={actionsLayout}
      config={{displayModeBar: true, responsive: true, displaylogo: false}}
      style={{width: '100%', height: '100%'}}
      useResizeHandler={true} // Ensure the plot adjusts size when container changes
    />
  );
};

export default ActionsPlot;
