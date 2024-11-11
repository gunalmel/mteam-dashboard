'use client';
import {Layout, PlotRelayoutEvent, UpdateMenuButton} from 'plotly.js';
import dynamic from 'next/dynamic';
import {useGazeData} from '@/app/hooks/useGazeData';
import PlotsFileSource from '@/app/utils/plotSourceProvider';
import {useContext, useState} from 'react';
import PlotContext from '@/app/ui/components/PlotContext';
import PlotlyScatterLayout from '@/app/utils/plotly/PlotlyScatterLayout';

const Plot = dynamic(() => import('react-plotly.js'), {ssr: false});

const windowSize = 10; // 10-second window

type SourceNames = keyof typeof PlotsFileSource.gaze;
const menuButtons: Partial<UpdateMenuButton>[] = [];
const selections: string[] = [];
Object.keys(PlotsFileSource.gaze).forEach((key) => {
  selections.push(key);
  menuButtons.push({
    method: 'relayout',
    label: PlotsFileSource.gaze[key as SourceNames].name,
    args: ['source', key]
  });
});

const GazePlot = () => {
  const {actionsLayout} = useContext(PlotContext);
  const [selectedSource, setSelectedSource] = useState<SourceNames>(selections[0] as SourceNames);
  const [plotData] = useGazeData(windowSize, selectedSource);
  const layoutConfig = new PlotlyScatterLayout(
    'Category Distribution Over Time - (sliding window: 10 s, step: 10 s)',
    [],
    [],
    [0, 0],
    []
  );

  layoutConfig.yaxis = {title: 'Count of Category', range: [0, 1]};
  layoutConfig.showLegend = true;

  const handleDataChange = (event: PlotRelayoutEvent & { source?: SourceNames }) => {
    if (event.source) {
      setSelectedSource(event.source);
    }
  };

  return (
    <div className="flex flex-col items-center p-4" style={{height: '550px'}}>
      <Plot
        data={plotData.plotlyData}
        onRelayout={handleDataChange}
        layout={{
          ...layoutConfig.toPlotlyFormat(),
          ...{
            barmode: 'stack',
            bargap: 0, // Remove gaps between bars
            xaxis: actionsLayout.xaxis,
            legend: {
              orientation: 'h', // Set the legend to horizontal
              x: 0.5, // Center the legend horizontally
              y: 1, // Position the legend above the plot
              xanchor: 'center',
              yanchor: 'bottom'
            },
            updatemenus: [{
              buttons: menuButtons,
              direction: 'left',
              pad: {t: 30},
              showactive: true,
              x: 0.5,
              xanchor: 'center',
              y: 1.3,
              yanchor: 'top',
              active: selections.indexOf(selectedSource)
            },]
          } as Partial<Layout>
        }}
        config={{displayModeBar: true, responsive: true, displaylogo: false}}
        style={{width: '100%', height: '100%'}}
        useResizeHandler={true} // Ensure the plot adjusts size when container changes
      />
    </div>
  );
};

export default GazePlot;
