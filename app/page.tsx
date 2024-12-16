'use client';
import React, {useRef, useState} from 'react';
import {PlotMouseEvent} from 'plotly.js';
import VideoPlayer from '@/app/ui/components/VideoPlayer';
import CognitiveLoadPlot from '@/app/ui/components/plots/CognitivePlot';
import {Today} from '@/app/utils/TodayDateTimeConverter';
import FilteredActionsPlot from '@/app/ui/components/plots/FilteredActionsPlot';
import PlotContext from '@/app/ui/components/PlotContext';
import {useActionsData} from '@/app/hooks/useActionsData';
import VisualAttentionPlot from '@/app/ui/components/plots/VisualAttentionPlot';
import SelectorButtonGroup from '@/app/ui/components/SelectorButtonGroup';
import StickyDiv from '@/app/ui/components/StickyDiv';

const Page = () => {
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [selectedSource, setSelectedSource] = useState('teamLead');

  const seekTo = useRef(0);

  const handleTimePointClick = (event: Readonly<PlotMouseEvent>) => {
    seekTo.current = Today.timeStampStringToSeconds(event.points[0].x as string);
    setCurrentTime(Today.timeStampStringToSeconds(event.points[0].x as string));
  };

  const handleTimeUpdate = (time: number) => {
    setCurrentTime(time);
  };

  return (
    <PlotContext.Provider value={useActionsData()}>
      <div className='flex flex-col justify-evenly'>
        <StickyDiv videoElementId="video">
          <VideoPlayer videoElementId="video" onTimeUpdate={handleTimeUpdate} seekTo={seekTo.current} />
        </StickyDiv>
        <FilteredActionsPlot currentTime={currentTime} onClick={handleTimePointClick} />
        <div className='flex flex-col items-center p-4'>
          <SelectorButtonGroup
            selections={[
              ['teamLead', 'Team Lead'],
              ['defib', 'Defibrillator'],
              ['compressor', 'Compressor'],
              ['airway', 'Airway']
            ]}
            selectedValue={selectedSource}
            onSelect={(selected) => {
              setSelectedSource(selected);
            }}
          />
        </div>
        <CognitiveLoadPlot currentTime={currentTime} selectedSource={selectedSource} />
        <VisualAttentionPlot currentTime={currentTime} selectedSource={selectedSource} />
      </div>
    </PlotContext.Provider>
  );
};

export default Page;
