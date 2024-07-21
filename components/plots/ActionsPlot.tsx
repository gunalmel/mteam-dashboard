import React, { useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useActionsData } from '@/hooks/useActionsData';
import { timeStampToDateString } from '@/utils/timeUtils';
import { Data } from 'plotly.js';

// Dynamically import Plotly with no SSR
const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

const ActionsPlot = ({ onHover, selectedMarkers, currentTime }: { onHover: (event: any) => void, selectedMarkers: string[], currentTime: number }) => {
    const { actionsData, actionsLayout } = useActionsData(selectedMarkers);

    // Convert currentTime (in seconds) to the same format as the plot data
    const currentTimeFormatted = timeStampToDateString(new Date(currentTime * 1000).toISOString().substr(11, 8));

    // Define the current time marker
    const currentTimeMarker: Partial<Data> = {
        type: "scatter",
        mode: "lines",
        x: [currentTimeFormatted, currentTimeFormatted],
        y: [0, 10], // Adjust y range as needed
        line: { color: "red", width: 2 }
    };

    // Add the current time marker to the plot data
    const plotData: Partial<Data>[] = [...actionsData, currentTimeMarker];

    useEffect(() => {
        console.log('ActionsPlot Current Video Time:', currentTimeFormatted);
    }, [currentTimeFormatted]);

    return (
        <Plot
            data={plotData as Data[]}
            layout={actionsLayout}
            config={{ displayModeBar: true, responsive: true, displaylogo: false }}
            onHover={onHover}
            style={{ width: '100%', height: '100%' }}
            useResizeHandler={true} // Ensure the plot adjusts size when container changes
        />
    );
};

export default ActionsPlot;
