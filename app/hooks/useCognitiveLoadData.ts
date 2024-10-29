import {useEffect, useState} from 'react';
import {Data, Layout} from 'plotly.js';
import {Today} from '@/app/utils/TodayDateTimeConverter';
import PlotlyScatterLayout from '@/app/utils/plotly/PlotlyScatterLayout';

export const useCognitiveLoadData = () => {
    const [cognitiveLoadData, setCognitiveLoadData] = useState<Data[]>([]);
    const [cognitiveLoadLayout, setCognitiveLoadLayout] = useState<Partial<Layout>>({});

    useEffect(() => {
        const fetchCognitiveLoadData = async () => {
            const response = await fetch('https://dl.dropboxusercontent.com/scl/fi/6lmdyuka085hdpakzp7kn/team_lead_cognitive_load.json?rlkey=fm7881olmj0uu7j3zf111ebpd&st=cxwrqgo2&dl=0');
            const data = await response.json();
            const timeStamps: string[] = [];
            const cogLoad: number[] = [];
            if (data) {
              // Convert the first epoch to your desired date format
              const startTime = data[0][0];
              // Create formatted timestamps relative to the first timestamp
              data.forEach(([x,y]:[number,number]) => {
                const elapsedSeconds = (x - startTime);
                const currentTime = Today.parseSeconds(elapsedSeconds);
                timeStamps.push(currentTime.dateTimeString);
                cogLoad.push(y);
              });

                setCognitiveLoadData([{
                    x: timeStamps,
                    y: cogLoad,
                    type: 'scatter',
                    mode: 'lines',
                    name: 'Cognitive Load',
                    line: { color: 'blue' },
                }]);

                const layoutConfig = new PlotlyScatterLayout('Cognitive Load Over Time',
                  [], [], [Today.getBeginningOfDayString(), timeStamps[timeStamps.length-1]] , []);
                layoutConfig.yaxis = { title: 'Cognitive Load', range: [0, 1] };

                setCognitiveLoadLayout(layoutConfig.toPlotlyFormat());
            }
        };

        fetchCognitiveLoadData().catch(console.error);
    }, []);

    return { cognitiveLoadData, cognitiveLoadLayout };
};
