import { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { Data, Layout, Shape, Annotations } from 'plotly.js';
import { timeStampToDateString } from '@/utils/timeUtils';
import { createActionsScatterData, createCompressionLine, createTransition, createTransitionAnnotation, shouldPlotAction, doesCPRStart, doesCPRStop, isTransitionBoundary } from '@/utils/dataUtils';

const phaseColors = ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf'];

export const useActionsData = () => {
    const [actionsData, setActionsData] = useState<Array<Partial<Data>>>([]);
    const [actionsLayout, setActionsLayout] = useState<Partial<Layout>>({});

    useEffect(() => {
        const phaseMap: { [key: string]: { start: string, end: string } } = {};
        const timestampsInDateString: Array<string> = [];
        const subActions: Array<string> = [];
        const actionAnnotations: Array<string> = [];
        let compressionLine: { seconds: Array<string>, hoverText: Array<string> } = {
            seconds: [],
            hoverText: []
        };
        const compressionLines: Array<Partial<Data>> = [];

        Papa.parse('https://raw.githubusercontent.com/thedevagyasharma/mteam-dashboard/main/src/Data_sample2/timeline-multiplayer%20(32).csv', {
            download: true,
            header: true,
            step: function (row: Papa.ParseStepResult<{ [key: string]: string }>) {
                const { 'Action/Vital Name': action, 'SubAction Name': subAction, 'Time Stamp[Hr:Min:Sec]': timestamp } = row.data;
                const timeStampInDateString = timeStampToDateString(timestamp);

                if (doesCPRStart(subAction)) {
                    compressionLine.seconds.push(timeStampInDateString);
                    compressionLine.hoverText.push(timestamp);
                } else if (doesCPRStop(subAction)) {
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
                    subActions.push(subAction);
                    actionAnnotations.push(`${timestamp}, ${subAction}`);
                    timestampsInDateString.push(timeStampInDateString);
                }
            },
            complete: function () {
                const actionsScatterData = createActionsScatterData(timestampsInDateString, subActions, actionAnnotations);

                const { transitionShapes, transitionAnnotations } = Object.keys(phaseMap).reduce<{ transitionShapes: Array<Partial<Shape>>, transitionAnnotations: Array<Partial<Annotations>> }>((accumulator, action, index) => {
                    accumulator.transitionShapes.push(createTransition(action, phaseMap[action].start, phaseMap[action].end, phaseColors[index % phaseColors.length] + '33'));
                    accumulator.transitionAnnotations.push(createTransitionAnnotation(action, phaseMap[action].start, phaseColors[index % phaseColors.length]));
                    return accumulator;
                }, { transitionShapes: [], transitionAnnotations: [] });

                const layoutConfig: Partial<Layout> = {
                    title: 'Clinical Review Timeline',
                    xaxis: { title: 'Time (seconds)', showgrid: false, range: [0, timestampsInDateString[timestampsInDateString.length - 1] + 10], tickformat: '%H:%M:%S' },
                    yaxis: { visible: false, range: [0, 2] },
                    showlegend: false,
                    shapes: transitionShapes,
                    annotations: transitionAnnotations,
                    autosize: true,
                    modebar: {
                        orientation: 'v',
                    },
                };

                setActionsData([actionsScatterData, ...compressionLines]);
                setActionsLayout(layoutConfig);
            }
        });

    }, []);

    return { actionsData, actionsLayout };
};
