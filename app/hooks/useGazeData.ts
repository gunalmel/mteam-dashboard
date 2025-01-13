import { useEffect, useState } from 'react';
import PlotsFileSource from '@/app/utils/plotSourceProvider';
import { processGazeData, transformGazeDataForPlotly } from '@/app/lib/processGazeData';
import {DataSources} from '@/types';

type SourceNames = keyof typeof PlotsFileSource[string]['visualAttention'];
type SimulationDate = keyof typeof PlotsFileSource;

export function useGazeData(dataSources: DataSources, windowSize: number, selectedDate: SimulationDate, selectedSource: SourceNames) {
    const [plotData, setPlotData] = useState({} as ReturnType<typeof transformGazeDataForPlotly>);

    useEffect(() => {
        const fetchAndProcessData = async () => {
            const url = dataSources[selectedDate]?.visualAttention[selectedSource].url;
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
    }, [dataSources, selectedDate, selectedSource, windowSize]);

    return [plotData, setPlotData] as const;
}
