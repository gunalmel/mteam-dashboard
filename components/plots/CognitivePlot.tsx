import React from 'react';
import dynamic from 'next/dynamic';
import { useCognitiveLoadData } from '@/hooks/useCognitiveLoadData';

// Dynamically import Plotly with no SSR
const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

const CognitiveLoadPlot = () => {
    const { cognitiveLoadData, cognitiveLoadLayout } = useCognitiveLoadData();

    return (
        <Plot
            data={cognitiveLoadData}
            layout={cognitiveLoadLayout}
            config={{ displayModeBar: true, responsive: true, displaylogo: false }}
            style={{ width: '100%', height: '100%' }}
            useResizeHandler={true} // Ensure the plot adjusts size when container changes
        />
    );
};

export default CognitiveLoadPlot;
