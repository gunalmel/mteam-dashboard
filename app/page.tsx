'use client';
import React, {useEffect, useMemo, useRef, useState} from 'react';
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
import DataSourceSelector from '@/app/ui/components/DataSourceSelector';
import {checkDataAvailability} from '@/app/utils/dataAvailability';
import {useDataSources} from '@/app/hooks/useDataSources';
import {DataSources, SelectorButtonGroupProps} from '@/types';

type AvailableDate = keyof DataSources;

const COGNITIVE_LOAD_AND_VISUAL_ATTENTION_SELECTIONS:SelectorButtonGroupProps['selections'] = [
  ['teamLead', 'Team Lead'],
  ['defib', 'Defibrillator'],
  ['compressor', 'Compressor'],
  ['airway', 'Airway']
] as const; //Avoids re-creating the selections array on every render

const Page = () => {
  const [currentVideoTime, setCurrentVideoTime] = useState<number>(0);
  const [selectedTeamMember, setSelectedTeamMember] = useState('teamLead');
  const dataSourcesManager = useDataSources();
  const [selectedDataSource, setSelectedDataSource] = useState<AvailableDate>('');

  useEffect(() => {
    // Update `selectedDataSource` when `dataSourcesManager.defaultDataSource.value` changes
    if (dataSourcesManager?.defaultDataSource?.value && selectedDataSource === '') {
      setSelectedDataSource(dataSourcesManager.defaultDataSource.value);
    }
  }, [dataSourcesManager.defaultDataSource.value, selectedDataSource]);

  const videoSeekTo = useRef(0);
  const actionsData = useActionsData(dataSourcesManager.dataSources.value, selectedDataSource);

  const dataAvailability = checkDataAvailability(dataSourcesManager.dataSources.value, selectedDataSource);

  const handleActionsPlotTimePointClick = (event: Readonly<PlotMouseEvent>) => {
    videoSeekTo.current = Today.timeStampStringToSeconds(event.points[0].x as string);
    setCurrentVideoTime(Today.timeStampStringToSeconds(event.points[0].x as string));
  };

  const handleVideoTimelineUpdate = (time: number) => {
    setCurrentVideoTime(time);
  };

  const handleDateChange = (date: string) => {
    setSelectedDataSource(date as AvailableDate);
  };

  // whenever dataSources or actionsData changes, ensure that the context stored object reference is updated accordingly.
  const context = useMemo(
    () => ({dataSources: dataSourcesManager.dataSources.value, actionsData}),
    [dataSourcesManager.dataSources.value, actionsData]
  );

  return (
    <PlotContext.Provider value={context}>
      <div className='flex flex-col justify-evenly'>
        <DataSourceSelector
          dataSources={context.dataSources}
          selectedDataSource={selectedDataSource}
          onDataSourceChange={handleDateChange}
        />
        {!dataAvailability.hasAllData ? (
          <div className='p-8 text-center text-gray-600'>
            Complete simulation data is not available for the selected date. Please select a different date.
          </div>
        ) : (
          <>
            <StickyDiv>
              <VideoPlayer
                videoElementId='video'
                onTimeUpdate={handleVideoTimelineUpdate}
                seekTo={videoSeekTo.current}
                videoUrl={context.dataSources[selectedDataSource]?.video.url ?? ''}
              />
            </StickyDiv>
            <FilteredActionsPlot currentTime={currentVideoTime} onClick={handleActionsPlotTimePointClick} />
            <div className='flex flex-col items-center p-4'>
              <SelectorButtonGroup
                selections={COGNITIVE_LOAD_AND_VISUAL_ATTENTION_SELECTIONS}
                selectedValue={selectedTeamMember}
                onSelect={(selected) => {
                  setSelectedTeamMember(selected);
                }}
              />
            </div>
            <CognitiveLoadPlot
              currentTime={currentVideoTime}
              selectedSource={selectedTeamMember}
              selectedDate={selectedDataSource}
            />
            <VisualAttentionPlot
              currentTime={currentVideoTime}
              selectedSource={selectedTeamMember}
              selectedDate={selectedDataSource}
            />
          </>
        )}
      </div>
    </PlotContext.Provider>
  );
};

export default Page;
