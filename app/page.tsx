'use client';
import React, { useState, useRef, useEffect } from 'react';
import { PlotMouseEvent } from 'plotly.js';
import VideoPlayer from '@/app/ui/dashboard/VideoPlayer';
import ActionsPlot from '@/components/plots/ActionsPlot';
import CognitiveLoadPlot from '@/components/plots/CognitivePlot';
import Explanation from '@/components/Explanation';
import { timeStampStringToSeconds } from '@/utils/timeUtils';
import { explanationItems } from '@/components/constants';

const Page = () => {
    const [hoveredTime, setHoveredTime] = useState<number | null>(null);
    const [currentCognitiveLoad, setCurrentCognitiveLoad] = useState<number | null>(null);
    const [selectedMarkers, setSelectedMarkers] = useState<string[]>(explanationItems.flatMap(item => item.relatedMarkers));
    const [currentTime, setCurrentTime] = useState<number>(0);
    const videoRef = useRef<HTMLVideoElement | null>(null);

    useEffect(() => {
        console.log('Selected markers:', selectedMarkers);
    }, [selectedMarkers]);

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

    const handlePlotHover = (event: PlotMouseEvent) => {
        if (event.points.length > 0) {
            setHoveredTime(timeStampStringToSeconds(event.points[0]?.x as string));
        }
    };

    useEffect(() => {
        const handleKeyPress = (event: KeyboardEvent) => {
            if (event.key === 'g' && hoveredTime !== null && videoRef.current) {
                videoRef.current.currentTime = hoveredTime;
                videoRef.current.play();
            }
        };

        window.addEventListener('keypress', handleKeyPress);
        return () => {
            window.removeEventListener('keypress', handleKeyPress);
        };
    }, [hoveredTime]);

    useEffect(() => {
        if (hoveredTime !== null) {
            // Fetch and set the cognitive load value based on hoveredTime
            // This can be implemented as needed, assuming you have the data or a function to fetch it
        }
    }, [hoveredTime]);

    return (
        <div className="flex flex-col justify-evenly">
            <VideoPlayer ref={videoRef} setCurrentTime={setCurrentTime} />
            <Explanation
                selectedMarkers={selectedMarkers}
                onSelectAll={handleSelectAll}
                onToggleMarker={handleToggleMarkers}
            />
            <div className="bg-white p-4" style={{ width: '100%', height: '800px' }}>
                <ActionsPlot onHover={handlePlotHover} selectedMarkers={selectedMarkers} currentTime={currentTime} />
            </div>
            <div className="bg-white p-4 mt-4" style={{ width: '100%', height: '800px' }}>
                <CognitiveLoadPlot currentTime={currentTime} />
                <div>
                    Current Cognitive Load: {currentCognitiveLoad !== null ? `${currentCognitiveLoad.toFixed(2)}%` : 'N/A'}
                </div>
            </div>
        </div>
    );
};

export default Page;
