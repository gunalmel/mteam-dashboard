import {useEffect, useState} from 'react';
import {Data, Layout} from 'plotly.js';
import {Today} from '@/app/utils/TodayDateTimeConverter';
import PlotlyScatterLayout from '@/app/utils/plotly/PlotlyScatterLayout';
import PlotsFileSource from '@/app/utils/plotSourceProvider';

const fetchAndProcessData = async (url: string, name: string, color: string) => {
  const response = await fetch(url);
  const data = await response.json();
  const timeStamps: string[] = [];
  const cogLoad: number[] = [];
  if (data) {
    // Convert the first epoch to your desired date format
    const startTime = data[0][0];
    // Create formatted timestamps relative to the first timestamp
    data.forEach(([x, y]: [number, number]) => {
      const elapsedSeconds = x - startTime;
      const currentTime = Today.parseSeconds(elapsedSeconds);
      timeStamps.push(currentTime.dateTimeString);
      cogLoad.push(y);
    });
  }
  return {
    seriesData: {
      x: timeStamps,
      y: cogLoad,
      type: 'scatter',
      mode: 'lines',
      name,
      line: {color}
    } as Data,
    xMax: timeStamps[timeStamps.length - 1]
  };
};

export const useCognitiveLoadData = () => {
  const [cognitiveLoadData, setCognitiveLoadData] = useState<Data[]>([]);
  const [cognitiveLoadLayout, setCognitiveLoadLayout] = useState<Partial<Layout>>({});

  useEffect(() => {
    const loadData = async () => {
      const teamLeadPromise = fetchAndProcessData(
        PlotsFileSource.cognitiveLoad.teamLead.url,
        PlotsFileSource.cognitiveLoad.teamLead.name,
        'blue'
      );
      const averagePromise = fetchAndProcessData(
        PlotsFileSource.cognitiveLoad.average.url,
        PlotsFileSource.cognitiveLoad.average.name,
        'red'
      );

      const [teamLeadResult, averageResult] = await Promise.all([teamLeadPromise, averagePromise]);
      setCognitiveLoadData([teamLeadResult.seriesData, averageResult.seriesData]);

      const layoutConfig = new PlotlyScatterLayout(
        'Cognitive Load Over Time',
        [],
        [],
        [Today.getBeginningOfDayString(), '2024-10-29 00:11:10'],
        []
      );
      layoutConfig.yaxis = {title: 'Cognitive Load', range: [0, 1]};
      layoutConfig.showLegend = true;

      setCognitiveLoadLayout(layoutConfig.toPlotlyFormat());
    };
    loadData().catch(console.error);
  }, []);

  return {cognitiveLoadData, cognitiveLoadLayout};
};
