import React from 'react';
import dynamic from 'next/dynamic';
import { useActionsData } from '@/hooks/useActionsData';

// Dynamically import Plotly with no SSR
const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

const ActionsPlot = ({ onHover, selectedMarkers }: { onHover: (event: any) => void, selectedMarkers: string[] }) => {
    const { actionsData, actionsLayout } = useActionsData(selectedMarkers);

    return (
        <Plot
            data={actionsData}
            layout={actionsLayout}
            config={{ displayModeBar: true, responsive: true, displaylogo: false }}
            onHover={onHover}
            style={{ width: '100%', height: '100%' }}
            useResizeHandler={true} // Ensure the plot adjusts size when container changes
        />
    );
};

export default ActionsPlot;
