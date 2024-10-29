'use client';
import React, {useRef, useState} from 'react';
import {PlotMouseEvent} from 'plotly.js';
import VideoPlayer from '@/app/ui/components/VideoPlayer';
import CognitiveLoadPlot from '@/app/ui/components/plots/CognitivePlot';
import {Today} from '@/app/utils/TodayDateTimeConverter';
import FilteredActionsPlot from '@/app/ui/components/plots/FilteredActionsPlot';

const Page = () => {
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
      <CognitiveLoadPlot currentTime={currentTime} />
    </div>
  );
};

export default Page;
