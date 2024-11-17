import ToggleGrid from '@/app/ui/components/ToggleGrid';
import React, {FC, useContext, useEffect, useState} from 'react';
import {Data} from 'plotly.js';
import {Today} from '@/app/utils/TodayDateTimeConverter';
import {PlotlyCurrentTimeMarker} from '@/app/utils/plotly/PlotlyCurrentTimeMarker';
import {actionsDictionary} from '@/app/ui/components/constants';
import dynamic from 'next/dynamic';
import {FilteredActionsProps} from '@/types';
import PlotContext from '@/app/ui/components/PlotContext';
import PulseLoader from '@/app/ui/components/PulseLoader';
// Dynamically import Plotly with no SSR
const Plot = dynamic(() => import('react-plotly.js'), {ssr: false});

// A vertical line traces the video playback time on the plot allowing the user to see the actions taken at that time
const addTimeTracer = (currentTime: number, actionsData: Data[]) => {
  const currentTimeFormatted = Today.parseSeconds(currentTime).dateTimeString;
  const currentTimeMarker: Data = new PlotlyCurrentTimeMarker(
    [currentTimeFormatted, currentTimeFormatted],
    [0, actionsDictionary.yMax + 1]
  ).toPlotlyFormat();
  return [...actionsData, currentTimeMarker];
};

const FilteredActionsPlot: FC<FilteredActionsProps> = ({onClick, currentTime}) => {
  const {actionsData, actionsLayout, actionGroupIcons, updateActionsData} = useContext(PlotContext);
  const plotData: Data[] = addTimeTracer(currentTime, actionsData);
  const [isLoading, setIsLoading] = useState(true);

  const handleSelect = (selectedItems: string[]) => {
    updateActionsData(selectedItems);
  };

  useEffect(() => {
    if(!actionsData || !actionsLayout || !actionGroupIcons) {
      setIsLoading(true);
    }
  }, []);

  useEffect(() => {
    if (actionsData && actionsLayout && actionGroupIcons) {
      setIsLoading(false);
    }
  }, [actionsData, actionsLayout, actionGroupIcons]);

  return (
    <div className="flex flex-col items-center p-4" style={{position: 'relative'}}>
      <PulseLoader isLoading={isLoading} text={'Fetching data for Clinical Review Timeline'}/>
      <ToggleGrid items={actionGroupIcons} onChange={handleSelect}/>
      <Plot
        style={{width: '100%', height: '600px'}}
        data={plotData}
        layout={actionsLayout}
        onClick={onClick}
        config={{displayModeBar: true, responsive: true, displaylogo: false}}
        useResizeHandler={true} // Ensure the plot adjusts size when container changes
      />
    </div>
  );
};

export default FilteredActionsPlot;
