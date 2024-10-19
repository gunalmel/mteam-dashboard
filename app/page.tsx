'use client';
import React, {useRef, useState} from 'react';
import {PlotMouseEvent} from 'plotly.js';
import VideoPlayer from '@/app/ui/components/VideoPlayer';
import CognitiveLoadPlot from '@/app/ui/components/plots/CognitivePlot';
import {Today} from '@/app/utils/TodayDateTimeConverter';
import FilteredActionsPlot from '@/app/ui/components/plots/FilteredActionsPlot';

const Page = () => {
  const [currentCognitiveLoad] = useState<number | null>(null);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const seekTo = useRef(0);

  const handleTimePointClick = (event: Readonly<PlotMouseEvent>) => {
    setCurrentTime(Today.timeStampStringToSeconds(event.points[0].x as string));
    seekTo.current = Today.timeStampStringToSeconds(event.points[0].x as string);
  };

  const handleTimeUpdate = (time: number) => {
    setCurrentTime(time);
  };

  return (
    <div className='flex flex-col justify-evenly'>
      <VideoPlayer onTimeUpdate={handleTimeUpdate} seekTo={seekTo.current} />
      <FilteredActionsPlot currentTime={currentTime} onClick={handleTimePointClick} />
      <div className='bg-white p-4 mt-4' style={{width: '100%', height: '600px'}}>
        <CognitiveLoadPlot currentTime={currentTime} />
        <div>
          Current Cognitive Load: {currentCognitiveLoad !== null ? `${currentCognitiveLoad.toFixed(2)}%` : 'N/A'}
        </div>
      </div>
    </div>
  );
};

export default Page;
