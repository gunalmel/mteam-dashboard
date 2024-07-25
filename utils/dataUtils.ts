import { icons } from '@/components/constants';
import { Data, Shape, Annotations } from 'plotly.js';

export function getIcon(subAction: string): string {
    return icons[subAction] || '';
}

export function createActionsScatterData(timeStampsInDateString: Array<string>, yValues: Array<number>, subActions: Array<string>, annotations: Array<string>, selectedMarkers: string[]): Partial<Data> {
    const filteredSubActions = subActions.filter(subAction => selectedMarkers.includes(subAction));
    const iconText = filteredSubActions.map(subAction => getIcon(subAction));
    const filteredYValues = yValues.filter((_, index) => selectedMarkers.includes(subActions[index]));
    const filteredTimeStamps = timeStampsInDateString.filter((_, index) => selectedMarkers.includes(subActions[index]));

    console.log('Creating actions scatter data:', { filteredTimeStamps, filteredYValues, filteredSubActions });

    return {
        x: filteredTimeStamps,
        y: filteredYValues,
        mode: 'text',
        type: 'scatter',
        text: iconText,
        hovertext: annotations,
        hoverinfo: 'text',
        textposition: 'top center',
        textfont: { size: 16 }
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

export function createCompressionLine(timeStampInDateString: Array<string>, hoverText: Array<string>): Partial<Data> {
    return {
        x: timeStampInDateString,
        y: [0.98, 0.98],
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
    console.log('Checking if should plot action:', { action, subAction });
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
