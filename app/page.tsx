'use client';
import React, {useRef, useState} from 'react';
import {PlotMouseEvent} from 'plotly.js';
import VideoPlayer from '@/app/ui/components/dashboard/VideoPlayer';
import ActionsPlot from '@/app/ui/components/plots/ActionsPlot';
import CognitiveLoadPlot from '@/app/ui/components/plots/CognitivePlot';
import ToggleGrid from '@/app/ui/components/ToggleGrid';
import {Today} from '@/app/utils/timeUtils';

const Page = () => {
  const [currentCognitiveLoad] = useState<number | null>(null);
  const [selectedMarkers, setSelectedMarkers] = useState<string[]>([]);
  const [availableActions, setAvailableActions] = useState<{url: string, group: string}[]>([]);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const seekTo = useRef(0);

  const handleSelectAll = (selectAll: boolean) => {
    if (selectAll) {
      setSelectedMarkers(availableActions.map(item => item.group));
    } else {
      setSelectedMarkers([]);
    }
  };

  const handleToggleMarkers = (marker: string) => {
    setSelectedMarkers((prevSelectedMarkers) => {
      const allMarkersSelected = prevSelectedMarkers.includes(marker);
      if (allMarkersSelected) {
        return prevSelectedMarkers.filter(m => m!==marker);
      } else {
        return [...new Set([...prevSelectedMarkers, marker])];
      }
    });
  };

  const handleTimePointClick = (event: Readonly<PlotMouseEvent>) => {
    setCurrentTime(Today.timeStampStringToSeconds(event.points[0].x as string));
    seekTo.current=Today.timeStampStringToSeconds(event.points[0].x as string);
  };

  const handleTimeUpdate = (time:number) => {
      setCurrentTime(time);
  };

  return (
    <div className='flex flex-col justify-evenly'>
      <VideoPlayer onTimeUpdate={handleTimeUpdate} seekTo={seekTo.current} />
      <ToggleGrid
        allItems={availableActions}
        selectedItems={selectedMarkers}
        onSelectAll={handleSelectAll}
        onToggleMarker={handleToggleMarkers}
      />
      <div className='bg-white p-4' style={{width: '100%', height: '800px'}}>
        <ActionsPlot
          setActionGroups={(actions) => {
            setAvailableActions(actions);
            setSelectedMarkers(actions.map(item => item.group));
          }}
          onClick={handleTimePointClick}
          selectedActionGroups={selectedMarkers}
          currentTime={currentTime}
        />
      </div>
      <div className='bg-white p-4 mt-4' style={{width: '100%', height: '800px'}}>
        <CognitiveLoadPlot currentTime={currentTime} />
        <div>
          Current Cognitive Load: {currentCognitiveLoad !== null ? `${currentCognitiveLoad.toFixed(2)}%` : 'N/A'}
        </div>
      </div>
    </div>
  );
};

export default Page;
