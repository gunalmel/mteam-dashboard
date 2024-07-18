import { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { Data, Layout, Shape, Annotations } from 'plotly.js';
import { timeStampToDateString } from '@/utils/timeUtils';
import {
    createActionsScatterData,
    createCompressionLine,
    createTransition,
    createTransitionAnnotation,
    shouldPlotAction,
    doesCPRStart,
    doesCPRStop,
    isTransitionBoundary
} from '@/utils/dataUtils';

const phaseColors = [
    '#1f77b4', '#ff7f0e', '#2ca02c', '#d62728',
    '#9467bd', '#8c564b', '#e377c2', '#7f7f7f',
    '#bcbd22', '#17becf'
];

const processRow = (
    row: { [key: string]: string },
    phaseMap: { [key: string]: { start: string, end: string } },
    timestampsInDateString: string[],
    subActions: string[],
    actionAnnotations: string[],
    compressionLine: { seconds: string[], hoverText: string[] },
    compressionLines: Partial<Data>[]
) => {
    const { 'Action/Vital Name': action, 'SubAction Name': subAction, 'Time Stamp[Hr:Min:Sec]': timestamp } = row;
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
};

const generateLayout = (
    phaseMap: { [key: string]: { start: string, end: string } },
    timestampsInDateString: string[]
): Partial<Layout> => {
    const { transitionShapes, transitionAnnotations } = Object.keys(phaseMap).reduce<{
        transitionShapes: Partial<Shape>[],
        transitionAnnotations: Partial<Annotations>[]
    }>((accumulator, action, index) => {
        accumulator.transitionShapes.push(createTransition(
            action,
            phaseMap[action].start,
            phaseMap[action].end,
            phaseColors[index % phaseColors.length] + '33'
        ));
        accumulator.transitionAnnotations.push(createTransitionAnnotation(
            action,
            phaseMap[action].start,
            phaseColors[index % phaseColors.length]
        ));
        return accumulator;
    }, { transitionShapes: [], transitionAnnotations: [] });

    return {
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
};

export const useActionsData = () => {
    const [actionsData, setActionsData] = useState<Array<Partial<Data>>>([]);
    const [actionsLayout, setActionsLayout] = useState<Partial<Layout>>({});

    useEffect(() => {
        const phaseMap: { [key: string]: { start: string, end: string } } = {};
        const timestampsInDateString: string[] = [];
        const subActions: string[] = [];
        const actionAnnotations: string[] = [];
        let compressionLine: { seconds: string[], hoverText: string[] } = { seconds: [], hoverText: [] };
        const compressionLines: Partial<Data>[] = [];

        Papa.parse('https://raw.githubusercontent.com/thedevagyasharma/mteam-dashboard/main/src/Data_sample2/timeline-multiplayer%20(32).csv', {
            download: true,
            header: true,
            step: function (row: Papa.ParseStepResult<{ [key: string]: string }>) {
                processRow(row.data, phaseMap, timestampsInDateString, subActions, actionAnnotations, compressionLine, compressionLines);
            },
            complete: function () {
                const actionsScatterData = createActionsScatterData(timestampsInDateString, subActions, actionAnnotations);
                const layoutConfig = generateLayout(phaseMap, timestampsInDateString);

                setActionsData([actionsScatterData, ...compressionLines]);
                setActionsLayout(layoutConfig);
            }
        });

    }, []);

    return { actionsData, actionsLayout };
};
