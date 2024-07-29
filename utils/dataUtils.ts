import { ScatterData, Layout, Shape, Annotations, Image } from 'plotly.js';
import { timeStampToDateString, timeStampStringToSeconds } from '@/utils/timeUtils';
import { yValues, icons, phaseColors } from '@/components/constants';
import { ImageWithName, LayoutWithNamedImage } from '@/types';

export const processRow = (
    row: { [key: string]: string },
    phaseMap: { [key: string]: { start: string, end: string } },
    timestampsInDateString: string[],
    yValuesList: number[],
    subActions: string[],
    actionAnnotations: string[],
    compressionLine: { seconds: string[], hoverText: string[] },
    compressionLines: Partial<ScatterData>[],
    uniqueActions: { [key: string]: Set<string> }
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
        yValuesList.push(yValues[subAction]);
        if (!uniqueActions[action]) {
            uniqueActions[action] = new Set();
        }
        uniqueActions[action].add(subAction);
    }
};

export const generateRequiredActionsData = (uniqueActions: { [key: string]: Set<string> }, phaseMap: { [key: string]: { start: string, end: string } }) => {
    let requiredActionsData: Partial<ImageWithName>[] = [];
    Object.keys(uniqueActions).forEach(phaseKey => {
        const phase = phaseMap[phaseKey];
        if (!phase) return;

        const actions = Array.from(uniqueActions[phaseKey]);
        const phaseStartSeconds = timeStampStringToSeconds(phase.start);
        const phaseEndSeconds = timeStampStringToSeconds(phase.end);
        const phaseDuration = phaseEndSeconds - phaseStartSeconds;
        const interval = phaseDuration / (actions.length + 1);

        actions.forEach((action, actionIndex) => {
            const actionTimeSeconds = phaseStartSeconds + (actionIndex + 1) * interval;
            const actionTime = timeStampToDateString(new Date(actionTimeSeconds * 1000).toISOString().substr(11, 8));
            requiredActionsData.push({
                source: icons[action].image,
                xref: 'x',
                yref: 'y',
                x: actionTime.replace(' ', 'T') + 'Z',
                y: -1.5,
                name: icons[action].name,
                sizex: 58800,  // TODO: Set this dynamically
                sizey: 0.373,  // TODO: Set this dynamically
                xanchor: 'center',
                yanchor: 'middle',
                layer: 'above'
            });
        });
    });

    return requiredActionsData;
};

export const generateLayout = (
    phaseMap: { [key: string]: { start: string, end: string } },
    timestampsInDateString: string[]
): Partial<LayoutWithNamedImage> => {
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

        accumulator.transitionShapes.push(createRequiredActionTransition(
            action,
            phaseMap[action].start,
            phaseMap[action].end,
            phaseColors[index % phaseColors.length] + '33',
        ));

        accumulator.transitionAnnotations.push(createTransitionAnnotation(
            action,
            phaseMap[action].start,
            phaseColors[index % phaseColors.length]
        ));
        return accumulator;
    }, { transitionShapes: [], transitionAnnotations: [] });

    // Find the maximum yValue from the yValues object
    const maxYValue = Math.max(...Object.values(yValues));

    return {
        title: 'Clinical Review Timeline',
        xaxis: { title: 'Time (seconds)', showgrid: false, range: [0, timestampsInDateString[timestampsInDateString.length - 1] + 10], tickformat: '%H:%M:%S' },
        yaxis: { visible: false, range: [-2, maxYValue + 2] },
        showlegend: false,
        shapes: transitionShapes,
        annotations: transitionAnnotations,
        autosize: true,
        modebar: {
            orientation: 'v',
        },
    };
};

export function createActionsScatterData(timeStampsInDateString: Array<string>, yValues: Array<number>, subActions: Array<string>, annotations: Array<string>)
    : { scatterData: Partial<ScatterData>, images: Array<Partial<ImageWithName>> } {
    const range = timeStampStringToSeconds(timeStampsInDateString[timeStampsInDateString.length - 1]) - timeStampStringToSeconds(timeStampsInDateString[0]);

    const images: Array<Partial<ImageWithName>> = subActions.map((subAction, index) => ({
        source: icons[subAction].image,
        xref: 'x',
        yref: 'y',
        x: timeStampsInDateString[index].replace(' ', 'T') + 'Z',
        y: yValues[index],
        name: icons[subAction].name,
        sizex: range * 100,
        sizey: 0.373,//0.373,
        xanchor: 'center',
        yanchor: 'middle',
        layer: 'above'
    }));

    return {
        scatterData: {
            x: timeStampsInDateString,
            y: yValues,
            mode: 'markers',
            type: 'scatter',
            ids: subActions.map(subAction => icons[subAction].name),
            text: subActions.map(subAction => icons[subAction].unicode),
            hovertext: annotations,
            hoverinfo: 'text',
            textposition: 'top center',
            textfont: { size: 16 },
            marker: {
                size: 1,
                symbol: 'circle',
                opacity: 0.8
            },
        },
        images
    };
}

export function createRequiredActionTransition(phaseName: string, start: string, end: string, fillColor: string): Partial<Shape> {
    return {
        type: 'rect',
        xref: 'x',
        yref: 'y',
        x0: start,
        x1: end,
        y0: -1, // Position below the plot
        y1: -2, // Adjusted height for the required actions box
        fillcolor: fillColor,
        line: { width: 0 },
        layer: 'below',
        name: phaseName
    };
}

export function createCompressionLine(timeStampInDateString: Array<string>, hoverText: Array<string>): Partial<ScatterData> {
    return {
        x: timeStampInDateString,
        y: [0.5, 0.5],
        mode: 'lines',
        type: 'scatter',
        text: '',
        hovertext: hoverText,
        hoverinfo: 'text',
        textposition: 'top center',
        textfont: { size: 16 },
        line: {
            color: 'rgb(0, 150, 0)'
        }
    };
}

export function createTransition(phaseName: string, start: string, end: string, fillColor: string): Partial<Shape> {
    return {
        type: 'rect',
        xref: 'x',
        yref: 'y',
        x0: start,
        x1: end,
        y0: 0,
        y1: 10,
        fillcolor: fillColor,
        line: { width: 0 },
        layer: 'below',
        name: phaseName
    };
}

export function createTransitionAnnotation(text: string, start: string, fontColor: string): Partial<Annotations> {
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

const subActionExclusions = ['Begin CPR', 'Enter CPR', 'Stop CPR'];
export function shouldPlotAction(action: string, subAction: string) {
    return action && subAction && !subActionExclusions.includes(subAction) && action.includes('(action)') && !action.includes('User Introduction');
}

const cprStartSubActionNames = ['Begin CPR', 'Enter CPR'];
export function doesCPRStart(subAction: string) {
    return cprStartSubActionNames.includes(subAction);
}

const cprStopSubActionNames = 'Stop CPR';
export function doesCPRStop(subAction: string) {
    return cprStopSubActionNames === subAction;
}

export function isTransitionBoundary(action: string) {
    return action && action.includes('(action)');
}
