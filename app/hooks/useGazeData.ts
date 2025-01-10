import { useEffect, useState } from 'react';
import PlotsFileSource from '@/app/utils/plotSourceProvider';
import { processGazeData, transformGazeDataForPlotly } from '@/app/lib/processGazeData';

type SourceNames = keyof typeof PlotsFileSource[string]['visualAttention'];
type SimulationDate = keyof typeof PlotsFileSource;

export function useGazeData(windowSize: number, selectedDate: SimulationDate, selectedSource: SourceNames) {
    const [plotData, setPlotData] = useState({} as ReturnType<typeof transformGazeDataForPlotly>);

    useEffect(() => {
        const fetchAndProcessData = async () => {
            const url = PlotsFileSource[selectedDate].visualAttention[selectedSource].url;
            if (!url) {
                setPlotData({} as ReturnType<typeof transformGazeDataForPlotly>);
                return;
            }

            const response = await fetch(url);
            const data = await response.json();

            const categoryCounts = processGazeData(data, windowSize);
            const plotData = transformGazeDataForPlotly(categoryCounts);
            setPlotData(plotData);
        };

        fetchAndProcessData().catch(console.error);
    }, [selectedDate, selectedSource, windowSize]);

    return [plotData, setPlotData] as const;
}
