import {useEffect, useState} from 'react';
import {PlotData} from 'plotly.js';
import PlotsFileSource from '@/app/utils/plotSourceProvider';
import {processGazeData, transformGazeDataForPlotly} from '@/app/lib/processGazeData';

export function useGazeData(windowSize: number, categories: string[]) {
  const [plotData, setPlotData] = useState<Partial<PlotData>[]>([]);

  useEffect(() => {
    const fetchAndProcessData = async () => {
      const response = await fetch(PlotsFileSource.gaze.teamLead.url);
      const data = await response.json();

      const categoryCounts = processGazeData(data, windowSize);

      const plotData = transformGazeDataForPlotly(categoryCounts, categories);
      setPlotData(plotData as Partial<PlotData>[]);
    };

    fetchAndProcessData().catch(console.error);
  }, []);

  return [plotData, setPlotData] as const;
}
