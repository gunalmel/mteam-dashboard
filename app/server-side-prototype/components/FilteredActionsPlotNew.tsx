'use client';
import ToggleGrid from '@/app/ui/components/ToggleGrid';
import {useEffect, useState} from 'react';
import {Data} from 'plotly.js';
import {Today} from '@/app/utils/TodayDateTimeConverter';
import {PlotlyCurrentTimeMarker} from '@/app/utils/plotly/PlotlyCurrentTimeMarker';
import {actionsDictionary} from '@/app/ui/components/constants';
import dynamic from 'next/dynamic';
import {filterActionsData} from '@/app/lib/filterActionsData';
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

const FilteredActionsPlot = ({currentTime, actionsData, actionsLayout, actionGroupIcons}) => {
  const [plotData, setPlotData] = useState(addTimeTracer(currentTime, actionsData));
  const [layoutConfig, setLayoutConfig ] = useState(actionsLayout);

  const handleSelect = (selectedItems: string[]) => {
    const filteredData = filterActionsData(plotData, layoutConfig, selectedItems);
    setPlotData(filteredData.plotData);
    setLayoutConfig(filteredData.layoutConfig);
  };
  const [isDataReady, setDataReady] = useState(false);

  useEffect(() => {
    if (actionsData && actionsLayout && actionGroupIcons) {
      setDataReady(true);
    }
  }, [actionsData, actionsLayout, actionGroupIcons]);

  if (!isDataReady) {
    return <div>Loading Clinical Review Timeline...</div>;
  }
  return (
    <div className="flex flex-col items-center p-4">
      <ToggleGrid items={actionGroupIcons} onChange={handleSelect}/>
      <Plot
        style={{width: '100%', height: '600px'}}
        data={plotData}
        layout={layoutConfig}
        // onClick={onClick}
        config={{displayModeBar: true, responsive: true, displaylogo: false}}
        useResizeHandler={true} // Ensure the plot adjusts size when container changes
      />
    </div>
  );
};

export default FilteredActionsPlot;
