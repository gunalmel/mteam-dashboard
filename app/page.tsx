'use client';
import React, { useEffect, useState, useRef } from 'react';
// see https://github.com/plotly/react-plotly.js/issues/272 for why we are using dynamic import for react-plotly to be built by Next.js
import dynamic from 'next/dynamic';
import Papa from 'papaparse';
import VideoPlayer from '@/app/ui/dashboard/VideoPlayer';
import {Annotations, Data, Layout, PlotMouseEvent, Shape} from 'plotly.js';

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

function timeStampToDateString(v: string) {
    const parts = v.split(':');
    return `2017-01-01 ${parts[0]?.length<2?'0'+parts[0]:parts[0]}:${parts[1]?.length<2?'0'+parts[1]:parts[1]}:${parts[2]?.length<2?'0'+parts[2]:parts[2]}`;
}
const icons = {
    "Pulse Check": "💓",
    "Select Epinephrine": "💉",
    "Select Amiodarone": "💉",
    "Shock": "⚡",
    "Order Cooling": "🌡️",
    "Order EKG": "📈",
    "Intubation": "💨",
    "Order X-Ray": "☢️",
    "Labs": "🧪",
    "Lung Sounds": "🩺"
};

function getIcon(subAction: string) {
    const iconNames = Object.keys(icons) as Array<keyof typeof icons>;
    const iconName = iconNames[iconNames.findIndex(k => subAction.includes(k))];
    return icons[iconName] || '';
}

const Explanation = () => (
    <div className={'pl-28'}>
        <div className="mb-2">
            <hr className="border-t-2 border-green-600 w-6 inline-block my-1" />
            : Compression Interval
        </div>
        <div className="grid grid-cols-3 gap-2">
            <div className="flex items-center">
                <span className="mr-1">💓</span> Pulse Check
            </div>
            <div className="flex items-center">
                <span className="mr-1">🩺</span> Lung Sounds
            </div>
            <div className="flex items-center">
                <span className="mr-1">☢️</span> X-Ray
            </div>
            <div className="flex items-center">
                <span className="mr-1">💉</span> Epinephrine or Amiodarone
            </div>
            <div className="flex items-center">
                <span className="mr-1">📈</span> EKG
            </div>
            <div className="flex items-center">
                <span className="mr-1">🌡️</span> Cool
            </div>
            <div className="flex items-center">
                <span className="mr-1">⚡</span> Shock
            </div>
            <div className="flex items-center">
                <span className="mr-1">💨</span> Intubate
            </div>
            <div className="flex items-center">
                <span className="mr-1">🧪</span> New Labs
            </div>
        </div>
    </div>
);

const phaseColors = ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf'];

const cprStartSubActionNames = ['Begin CPR', 'Enter CPR'];
const cprStopSubActionNames = 'Stop CPR';
const csvColHeaders = {
    action: 'Action/Vital Name',
    subAction: 'SubAction Name',
    timestamp: 'Time Stamp[Hr:Min:Sec]'
};
const subActionExclusions = ['Begin CPR', 'Enter CPR', 'Stop CPR'];
function shouldPlotAction(action: string, subAction: string) {
    return action && subAction && !subActionExclusions.includes(subAction) && action.includes('(action)') && !action.includes('User Introduction');
}
function doesCPRStart(subAction: string) {
    return cprStartSubActionNames.includes(subAction);
}
function doesCPRStop(subAction: string) {
    return cprStopSubActionNames === subAction;
}
function isTransitionBoundary(action: string) {
    return action && action.includes('(action)');
}

function createActionsScatterData(timeStampsInDateString: Array<string>, iconText: Array<string>, annotations: Array<string>): Partial<Data> {
    return {
        x: timeStampsInDateString,
        y: new Array(timeStampsInDateString.length).fill(1),
        mode: 'text',
        type: 'scatter',
        text: iconText,
        hovertext: annotations,
        hoverinfo: 'text',
        textposition: 'top center',
        marker: { size: 12 }
    };
}

function createCompressionLine(timeStampInDateString: Array<string>, hoverText: Array<string>): Partial<Data> {
    return {
        x: timeStampInDateString,
        y: [0.98, 0.98],
        mode: 'lines',
        type: 'scatter',
        text: '',
        hovertext: hoverText,
        hoverinfo: 'text',
        textposition: 'top center',
        marker: { size: 12 },
        line: {
            color: 'rgb(0, 150, 0)'
        }
    };
}

function createTransition(phaseName: string, start: string, end: string, fillColor: string): Partial<Shape> {
    return {
        type: 'rect',
        xref: 'x',
        yref: 'paper',
        x0: start,
        x1: end,
        y0: 0,
        y1: 1,
        fillcolor: fillColor,
        line: { width: 0 },
        layer: 'below',
        name: phaseName
    }
}

function createTransitionAnnotation(text: string, start: string, fontColor: string): Partial<Annotations> {
    return {
        xref: 'x', //'paper',
        yref: 'paper',
        x: start,
        y: 0.8,
        xanchor: 'left',
        yanchor: 'middle',
        text: text.replace('(action)', ''),
        showarrow: false,
        textangle: '270',
        font: {
            size: 9,
            color: fontColor,
        },
    };
}

const Page = () => {
    const [data, setData] = useState<Array<Partial<Data>>>([]);
    const [layout, setLayout] = useState({});
    const [hoveredTime, setHoveredTime] = useState<number | null>(null);
    const videoRef = useRef<HTMLVideoElement | null>(null);

    useEffect(() => {
        const phaseMap: { [key: string]: { start: string, end: string } } = {};
        const timestampsInDateString: Array<string> = [];
        const actions = [];
        const actionIcons: Array<string> = [];
        let compressionLine: { seconds: Array<string>, hoverText: Array<string> } = {
            seconds: [],
            hoverText: []
        };
        const actionAnnotations: string[] = [];
        const compressionLines: Array<Partial<Data>> = [];

        //TODO: 06-28-2024 - Mel Gunal: We'd better make a hook to use Papa.parse to set the state of the graph.
        Papa.parse('https://raw.githubusercontent.com/thedevagyasharma/mteam-dashboard/main/src/Data_sample2/timeline-multiplayer%20(32).csv', {
            download: true,
            header: true,
            step: function (row: Papa.ParseStepResult<{ [key: string]: string }>) {
                const { [csvColHeaders.action]: action,
                    [csvColHeaders.subAction]: subAction,
                    [csvColHeaders.timestamp]: timestamp } = row.data;
                const timeStampInDateString = timeStampToDateString(timestamp);

                if (doesCPRStart(subAction)) {
                    compressionLine.seconds.push(timeStampInDateString);
                    compressionLine.hoverText.push(timestamp);
                }
                else if (doesCPRStop(subAction)) {
                    compressionLine.seconds.push(timeStampInDateString);
                    compressionLine.hoverText.push(timestamp);
                    compressionLines.push(createCompressionLine(compressionLine.seconds, compressionLine.hoverText));
                    compressionLine.seconds = [];
                    compressionLine.hoverText = [];
                }

                if (isTransitionBoundary(action)) {
                    if (!phaseMap[action]) {
                        phaseMap[action] = { start: timeStampInDateString, end: timeStampInDateString };
                    } else {
                        phaseMap[action].end = timeStampInDateString;
                    }
                }

                if (shouldPlotAction(action, subAction)) {
                    actions.push(action);
                    actionAnnotations.push(`${timestamp}, ${subAction}`);
                    actionIcons.push(getIcon(subAction));
                    timestampsInDateString.push(timeStampInDateString);
                }
            },
            complete: function () {
                const actionsScatterData = createActionsScatterData(timestampsInDateString, actionIcons, actionAnnotations);

                const { transitionShapes, transitionAnnotations } = Object.keys(phaseMap).reduce<{ transitionShapes: Array<Partial<Shape>>, transitionAnnotations: Array<Partial<Annotations>> }>((accumulator, action, index) => {
                    accumulator.transitionShapes.push(createTransition(action, phaseMap[action].start, phaseMap[action].end, phaseColors[index % phaseColors.length] + '33'));
                    accumulator.transitionAnnotations.push(createTransitionAnnotation(action, phaseMap[action].start, phaseColors[index % phaseColors.length]));
                    return accumulator;
                }, { transitionShapes: [], transitionAnnotations: [] });

                const layoutConfig: Partial<Layout> = {
                    title: 'Clinical Review Timeline',
                    xaxis: { title: 'Time (seconds)', showgrid: false, range:[0, timestampsInDateString[timestampsInDateString.length-1]+10], tickformat: '%H:%M:%S' },
                    yaxis: { visible: false, range: [0, 2] },
                    showlegend: false,
                    shapes: transitionShapes,
                    annotations: transitionAnnotations,
                    autosize: true,
                    modebar: {
                        orientation: 'v',
                    },
                };

                setData([actionsScatterData, ...compressionLines]);
                setLayout(layoutConfig);
            }
        });

    }, []);

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

    const handlePlotHover = (event: PlotMouseEvent) => {
        if (event.points.length > 0) {
            const point = event.points[0];
            const timeInSeconds = Number(point.x);
            setHoveredTime(timeInSeconds);
        }
    };

    return (
        <div className="flex flex-col justify-evenly">
            <VideoPlayer ref={videoRef} />
            <Explanation />
            <div className="bg-white p-4" style={{ width: '100%', height: '600px' }}>
                <Plot
                    data={data}
                    layout={layout}
                    config={{displayModeBar: true, responsive: true, displaylogo: false}}
                    onHover={handlePlotHover}
                    style={{ width: '100%', height: '100%' }}
                    useResizeHandler={true}// Ensure the plot adjusts size when container changes
                />
            </div>
        </div>
    );
};

export default Page;
