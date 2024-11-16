import { useEffect, useState } from 'react';
import PlotsFileSource from '@/app/utils/plotSourceProvider';
import { processGazeData, transformGazeDataForPlotly } from '@/app/lib/processGazeData';

type SourceNames = keyof typeof PlotsFileSource.visualAttention;

export function useGazeData(windowSize: number, selectedSource: SourceNames) {
    const [plotData, setPlotData] = useState({} as ReturnType<typeof transformGazeDataForPlotly>);

    useEffect(() => {
        const fetchAndProcessData = async () => {
            const response = await fetch(PlotsFileSource.visualAttention[selectedSource].url['09302024']);
            const data = await response.json();

            const categoryCounts = processGazeData(data, windowSize);

            const plotData = transformGazeDataForPlotly(categoryCounts);
            setPlotData(plotData);
        };

        fetchAndProcessData().catch(console.error);
    }, [selectedSource, windowSize]);

    return [plotData, setPlotData] as const;
}
