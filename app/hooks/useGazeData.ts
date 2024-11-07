import {useEffect, useState} from 'react';
import PlotsFileSource from '@/app/utils/plotSourceProvider';
import {processGazeData, transformGazeDataForPlotly} from '@/app/lib/processGazeData';

export function useGazeData(windowSize: number) {
  const [plotData, setPlotData] = useState({} as ReturnType<typeof transformGazeDataForPlotly>);

  useEffect(() => {
    const fetchAndProcessData = async () => {
      const response = await fetch(PlotsFileSource.gaze.teamLead.url);
      const data = await response.json();

      const categoryCounts = processGazeData(data, windowSize);

      const plotData = transformGazeDataForPlotly(categoryCounts);
      setPlotData(plotData);
    };

    fetchAndProcessData().catch(console.error);
  }, []);

  return [plotData, setPlotData] as const;
}
