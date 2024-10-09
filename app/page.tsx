'use client';
import React, {useRef, useState} from 'react';
import {PlotMouseEvent} from 'plotly.js';
import VideoPlayer from '@/app/ui/components/dashboard/VideoPlayer';
import ActionsPlot from '@/app/ui/components/plots/ActionsPlot';
import CognitiveLoadPlot from '@/app/ui/components/plots/CognitivePlot';
import ToggleGrid from '@/app/ui/components/ToggleGrid';
import {Today} from '@/app/utils/timeUtils';
import {explanationItems} from '@/app/ui/components/constants';

const Page = () => {
  const [currentCognitiveLoad] = useState<number | null>(null);
  const [selectedMarkers, setSelectedMarkers] = useState<string[]>(explanationItems.flatMap(item => item.relatedMarkers));
  const [currentTime, setCurrentTime] = useState<number>(0);
  const seekTo = useRef(0);

  const handleSelectAll = (selectAll: boolean) => {
    if (selectAll) {
      setSelectedMarkers(explanationItems.flatMap(item => item.relatedMarkers));
    } else {
      setSelectedMarkers([]);
    }
  };

  const handleToggleMarkers = (markers: string[]) => {
    setSelectedMarkers((prevSelectedMarkers) => {
      const allMarkersSelected = markers.every(marker => prevSelectedMarkers.includes(marker));
      if (allMarkersSelected) {
        return prevSelectedMarkers.filter(marker => !markers.includes(marker));
      } else {
        return [...new Set([...prevSelectedMarkers, ...markers])];
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
    <div className="flex flex-col justify-evenly">
      <VideoPlayer onTimeUpdate={handleTimeUpdate} seekTo={seekTo.current} />
      <ToggleGrid allItems={explanationItems}
        selectedItems={selectedMarkers}
        onSelectAll={handleSelectAll}
        onToggleMarker={handleToggleMarkers}
      />
      <div className="bg-white p-4" style={{width: '100%', height: '800px'}}>
        <ActionsPlot onClick={handleTimePointClick} selectedMarkers={selectedMarkers} currentTime={currentTime} />
      </div>
      <div className="bg-white p-4 mt-4" style={{width: '100%', height: '800px'}}>
        <CognitiveLoadPlot currentTime={currentTime} />
        <div>
          Current Cognitive Load: {currentCognitiveLoad !== null ? `${currentCognitiveLoad.toFixed(2)}%` : 'N/A'}
        </div>
      </div>
    </div>
  );
};

export default Page;
