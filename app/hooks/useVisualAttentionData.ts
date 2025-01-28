import { useEffect, useState } from 'react';
import {
  processVisualAttentionDataStream,
  transformVisualAttentionDataStreamForPlotly
} from '@/app/lib/processVisualAttentionData';
import {DataSources, VisualAttentionDataSource} from '@/types';

type SourceNames = keyof VisualAttentionDataSource;
type SimulationDate = keyof DataSources;

export function useVisualAttentionData(dataSources: DataSources, windowSize: number, selectedDate: SimulationDate, selectedSource: SourceNames) {
    const [plotData, setPlotData] = useState([] as ReturnType<typeof transformVisualAttentionDataStreamForPlotly>);

    useEffect(() => {
        const fetchAndProcessData = async () => {
            const url = dataSources[selectedDate]?.visualAttention[selectedSource].url;
            if (!url) {
                setPlotData({} as ReturnType<typeof transformVisualAttentionDataStreamForPlotly>);
                return;
            }

            const response = await fetch(url);
            const data = await response.json();

            const categoryCounts = processVisualAttentionDataStream(data, windowSize);
            const plotData = transformVisualAttentionDataStreamForPlotly(categoryCounts);
            setPlotData(plotData);
        };

        fetchAndProcessData().catch(console.error);
    }, [dataSources, selectedDate, selectedSource, windowSize]);

    return [plotData, setPlotData] as const;
}
