'use client';
import {Layout, PlotRelayoutEvent, UpdateMenuButton} from 'plotly.js';
import dynamic from 'next/dynamic';
import {useGazeData} from '@/app/hooks/useGazeData';
import PlotsFileSource from '@/app/utils/plotSourceProvider';
import {useState} from 'react';

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
    const [selectedSource, setSelectedSource] = useState<SourceNames>(selections[0] as SourceNames);
    const [plotData] = useGazeData(windowSize, selectedSource);

    const handleDataChange = (event: PlotRelayoutEvent & { source?: SourceNames }) => {
        if (event.source) {
            setSelectedSource(event.source);
        }
    };

    return (
        <Plot
            data={plotData.plotlyData}
            onRelayout={handleDataChange}
            layout={
                {
                    title: 'Category Distribution Over Time - (sliding window: 10 s, step: 10 s)',
                    automargin: true,
                    barmode: 'stack',
                    bargap: 0, // Remove gaps between bars
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
                    },],
                    xaxis: {
                        title: 'Time',
                        tickmode: 'array', // Use tickvals and ticktext for custom labeling
                        dtick: 100000000, // 10-second intervals for labeling every bar
                        tickformat: '%H:%M:%S', // Display as hh:mm:ss AM/PM
                    },
                    yaxis: {
                        title: 'Count of Category'
                    },
                    legend: {
                        orientation: 'h', // Set the legend to horizontal
                        x: 0.8, // Center the legend horizontally
                        y: 0.98, // Position the legend above the plot
                        xanchor: 'center',
                        yanchor: 'bottom'
                    }
                } as Partial<Layout>
            }
            config={{displayModeBar: true, responsive: true, displaylogo: false}}
            style={{width: '100%', height: '100%'}}
            useResizeHandler={true} // Ensure the plot adjusts size when container changes
        />
    );
};

export default GazePlot;
