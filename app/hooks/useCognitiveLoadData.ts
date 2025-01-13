import {useEffect, useState} from 'react';
import {Data, Layout} from 'plotly.js';
import {Today} from '@/app/utils/TodayDateTimeConverter';
import PlotlyScatterLayout from '@/app/utils/plotly/PlotlyScatterLayout';
import {CognitiveLoadDataSource, DataSource, DataSources} from '@/types';

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

type SourceNames = keyof CognitiveLoadDataSource;
type SimulationDate = keyof DataSources;

export const loadData = async (simulationDataSources: DataSource, selectedDate: SimulationDate, source: SourceNames) => {
  const sourceUrl = simulationDataSources.cognitiveLoad[source].url;
  const averageUrl = simulationDataSources.cognitiveLoad.average.url;

  if (!sourceUrl || !averageUrl) {
    return [
      { seriesData: {} as Data },
      { seriesData: {} as Data },
      new PlotlyScatterLayout('Cognitive Load Over Time', [], [], [0, 0], [])
    ];
  }

  const individualPromise = fetchAndProcessData(
    sourceUrl,
    simulationDataSources.cognitiveLoad[source].name,
    'blue'
  );

  const averageSeries = localStorage.getItem(`averageCognitiveLoadSeries_${selectedDate}`);
  let individualResult, averageResult;
  if(averageSeries) {
    averageResult = JSON.parse(averageSeries);
    individualResult = await individualPromise;
  } else {
    [individualResult, averageResult] = await Promise.all([
      individualPromise,
      fetchAndProcessData(
        averageUrl,
        simulationDataSources.cognitiveLoad.average.name,
        'red'
      )
    ]);
    localStorage.setItem(`averageCognitiveLoadSeries_${selectedDate}`, JSON.stringify(averageResult));
  }

  const layoutConfig = new PlotlyScatterLayout(
    'Cognitive Load Over Time',
    [],
    [],
    [0, 0],
    []
  );

  layoutConfig.yaxis = {title: 'Cognitive Load', range: [0, 1]};
  layoutConfig.showLegend = true;
  return [individualResult, averageResult, layoutConfig];
};

export const useCognitiveLoadData = (dataSources: DataSources, selectedDate: SimulationDate, source: SourceNames) => {
  const [cognitiveLoadData, setCognitiveLoadData] = useState<Data[]>([]);
  const [cognitiveLoadLayout, setCognitiveLoadLayout] = useState<Partial<Layout>>({});
  const simulationDataSources = dataSources[selectedDate];

  useEffect(() => {
    localStorage.removeItem(`averageCognitiveLoadSeries_${selectedDate}`);
  }, [selectedDate]);

  useEffect(() => {
    if (simulationDataSources && selectedDate) {
      loadData(simulationDataSources, selectedDate, source)
        .then(([data, averageData, layoutConfig]) => {
          setCognitiveLoadData([data.seriesData, averageData.seriesData]);
          setCognitiveLoadLayout(layoutConfig.toPlotlyFormat());
        })
        .catch(console.error);
    }
  }, [simulationDataSources, selectedDate, source]);

  return {cognitiveLoadData, cognitiveLoadLayout, setCognitiveLoadData};
};
