import ToggleGrid from '@/app/ui/components/ToggleGrid';
import {FC} from 'react';
import {Data} from 'plotly.js';
import {useActionsData} from '@/app/hooks/useActionsData';
import {Today} from '@/app/utils/TodayDateTimeConverter';
import {PlotlyCurrentTimeMarker} from '@/app/utils/plotly/PlotlyCurrentTimeMarker';
import {actionsDictionary} from '@/app/ui/components/constants';
import dynamic from 'next/dynamic';
import {FilteredActionsProps} from '@/types';
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
  const {actionsData, actionsLayout, actionGroupIcons, updateActionsData} = useActionsData();
  const plotData: Data[] = addTimeTracer(currentTime, actionsData);

  const handleSelect = (selectedItems: string[]) => {
    updateActionsData(selectedItems);
  };

  return (
    <>
        <ToggleGrid items={actionGroupIcons} onChange={handleSelect} />
        <Plot
          style={{width: '100%', height: '600px'}}
          data={plotData}
          layout={actionsLayout}
          onClick={onClick}
          config={{displayModeBar: true, responsive: true, displaylogo: false}}
          useResizeHandler={true} // Ensure the plot adjusts size when container changes
        />
    </>
  );
};

export default FilteredActionsPlot;
