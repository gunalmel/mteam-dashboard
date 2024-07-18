'use client';
import React, { useState, useRef, useEffect } from 'react';
// import dynamic from 'next/dynamic';
import { Annotations, Data, Layout, PlotMouseEvent } from 'plotly.js';
import VideoPlayer from '@/app/ui/dashboard/VideoPlayer';
import ActionsPlot from '@/components/plots/ActionsPlot';
import CognitiveLoadPlot from '@/components/plots/CognitivePlot';
import Explanation from '@/components/Explanation';
import { timeStampStringToSeconds } from '@/utils/timeUtils';

const Page = () => {
    const [hoveredTime, setHoveredTime] = useState<number | null>(null);
    const [currentCognitiveLoad, setCurrentCognitiveLoad] = useState<number | null>(null);
    const videoRef = useRef<HTMLVideoElement | null>(null);

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
            <VideoPlayer ref={videoRef} />
            <Explanation />
            <div className="bg-white p-4" style={{ width: '100%', height: '600px' }}>
                <ActionsPlot onHover={handlePlotHover} />
            </div>
            <div className="bg-white p-4 mt-4" style={{ width: '100%', height: '600px' }}>
                <CognitiveLoadPlot />
                <div>
                    Current Cognitive Load: {currentCognitiveLoad !== null ? `${currentCognitiveLoad.toFixed(2)}%` : 'N/A'}
                </div>
            </div>
        </div>
    );
};

export default Page;
