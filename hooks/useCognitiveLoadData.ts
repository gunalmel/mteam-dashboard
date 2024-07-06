import { useState, useEffect } from 'react';
import { Data, Layout } from 'plotly.js';

export const useCognitiveLoadData = () => {
    const [cognitiveLoadData, setCognitiveLoadData] = useState<Array<Partial<Data>>>([]);
    const [cognitiveLoadLayout, setCognitiveLoadLayout] = useState<Partial<Layout>>({});

    useEffect(() => {
        const fetchCognitiveLoadData = async () => {
            const response = await fetch('/Data_sample2/sensor/umich2/1703183551_1be99daa2ff8508df747e0da6ce673b93cf8865a/sensor_1703183551_1be99daa2ff8508df747e0da6ce673b93cf8865a.json');
            const sensor = await response.json();
            const data = sensor.data;
            const cogLoadData = data.find((sensor: any) => sensor.name === 'CognitiveLoad');
            if (cogLoadData) {
                const timestamps = cogLoadData.data.map((point: any) => point[0]);
                const cogLoad = cogLoadData.data.map((point: any) => point[1]);
                const minTimestamp = Math.min(...timestamps);
                const normalizedTimestamps = timestamps.map((ts: number) => ts - minTimestamp);
                setCognitiveLoadData([{
                    x: normalizedTimestamps,
                    y: cogLoad,
                    type: 'scatter',
                    mode: 'lines',
                    name: 'Cognitive Load',
                    line: { color: 'blue' },
                }]);
                setCognitiveLoadLayout({
                    title: 'Cognitive Load Over Time',
                    xaxis: { title: 'Time (seconds)', range: [0, Math.max(...normalizedTimestamps)] },
                    yaxis: { title: 'Cognitive Load', range: [0, Math.max(...cogLoad)] },
                    autosize: true,
                });
            }
        };

        fetchCognitiveLoadData();
    }, []);

    return { cognitiveLoadData, cognitiveLoadLayout };
};
