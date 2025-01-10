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
import DateSelector from '@/app/ui/components/DateSelector';
import PlotsFileSource from '@/app/utils/plotSourceProvider';
import {checkDataAvailability} from '@/app/utils/dataAvailability';

type AvailableDate = keyof typeof PlotsFileSource;

const Page = () => {
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [selectedSource, setSelectedSource] = useState('teamLead');
  const [selectedDate, setSelectedDate] = useState<AvailableDate>(Object.keys(PlotsFileSource)[0] as AvailableDate);

  const seekTo = useRef(0);
  const dataAvailability = checkDataAvailability(selectedDate);

  const handleTimePointClick = (event: Readonly<PlotMouseEvent>) => {
    seekTo.current = Today.timeStampStringToSeconds(event.points[0].x as string);
    setCurrentTime(Today.timeStampStringToSeconds(event.points[0].x as string));
  };

  const handleTimeUpdate = (time: number) => {
    setCurrentTime(time);
  };

  const handleDateChange = (date: string) => {
    setSelectedDate(date as AvailableDate);
  };

  const actionsData = useActionsData(selectedDate);

  if (!dataAvailability.hasAllData) {
    return (
      <div className='flex flex-col justify-evenly'>
        <DateSelector
          selectedDate={selectedDate}
          onDateChange={handleDateChange}
        />
        <div className="p-8 text-center text-gray-600">
          Complete simulation data is not available for the selected date. Please select a different date.
        </div>
      </div>
    );
  }

  return (
    <PlotContext.Provider value={actionsData}>
      <div className='flex flex-col justify-evenly'>
        <DateSelector
          selectedDate={selectedDate}
          onDateChange={handleDateChange}
        />
        <StickyDiv videoElementId="video">
          <VideoPlayer 
            videoElementId="video" 
            onTimeUpdate={handleTimeUpdate} 
            seekTo={seekTo.current}
            videoUrl={PlotsFileSource[selectedDate].video.url ?? ''}
          />
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
        <CognitiveLoadPlot 
          currentTime={currentTime} 
          selectedSource={selectedSource}
          selectedDate={selectedDate}
        />
        <VisualAttentionPlot 
          currentTime={currentTime} 
          selectedSource={selectedSource}
          selectedDate={selectedDate}
        />
      </div>
    </PlotContext.Provider>
  );
};

export default Page;
