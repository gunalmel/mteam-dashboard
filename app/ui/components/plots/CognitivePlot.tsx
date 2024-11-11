import React, {useContext, useState} from 'react';
import dynamic from 'next/dynamic';
import {useCognitiveLoadData} from '@/app/hooks/useCognitiveLoadData';
import PlotContext from '@/app/ui/components/PlotContext';
import PlotsFileSource from '@/app/utils/plotSourceProvider';
import {PlotRelayoutEvent, UpdateMenuButton} from 'plotly.js';
// Dynamically import Plotly with no SSR
const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

type SourceNames = keyof typeof PlotsFileSource.cognitiveLoad;
const menuButtons: Partial<UpdateMenuButton>[] = [];
const selections: string[] = [];
Object.keys(PlotsFileSource.cognitiveLoad).filter(key=>key!=='average').forEach((key) => {
  selections.push(key);
  menuButtons.push({
    method: 'relayout',
    label: PlotsFileSource.cognitiveLoad[key as SourceNames].name,
    args: ['source', key]
  });
});

const CognitiveLoadPlot = () => {
  const {actionsLayout} = useContext(PlotContext);
  const [selectedSource, setSelectedSource] = useState<SourceNames>('teamLead');
  const {
    cognitiveLoadData,
    cognitiveLoadLayout
  } = useCognitiveLoadData(selectedSource);

  const handleDataChange = (event: PlotRelayoutEvent & { source?: keyof typeof PlotsFileSource.cognitiveLoad }) => {
    // console.log('Event:', event);
    if (event.source) {
      setSelectedSource(event.source);
    }
  };

  if (!cognitiveLoadData||!cognitiveLoadData[0]||!cognitiveLoadLayout) {
    return <div>Loading Cognitive Load Plot...</div>;
  }
  return (
    <div className="flex flex-col items-center p-4" style={{height: '500px'}}>
      <Plot
        data={cognitiveLoadData}
        onRelayout={handleDataChange}
        layout={
          {
            ...cognitiveLoadLayout,
            ...{
              shapes: actionsLayout.shapes,
              xaxis: actionsLayout.xaxis,
              updatemenus: [{
                buttons: menuButtons,
                direction: 'left',
                pad: {t: 30},
                showactive: true,
                x: 0.5,
                xanchor: 'center',
                y: 1.2,
                yanchor: 'top',
                active: selections.indexOf(selectedSource)
              },
              ]
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
