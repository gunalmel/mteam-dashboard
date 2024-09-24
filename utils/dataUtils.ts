import {Annotations, ScatterData, Shape} from 'plotly.js';
import {timeStampStringToSeconds, timeStampToDateString} from '@/utils/timeUtils';
import {getIcon, phaseColors, yValues} from '@/components/constants';
import {ErrorAction, ImageWithName, LayoutWithNamedImage} from '@/types';
import {Simulate} from "react-dom/test-utils";

const actionRegex = /\(\d+\)([^(]+)\(action\)/;
let currentAction='';
export const processRow = (
    row: { [key: string]: string },
    error: ErrorAction,
    phaseMap: { [key: string]: { start: string, end: string } },
    timestampsInDateString: string[],
    actionColors: string[],
    yValuesList: number[],
    subActions: string[],
    actionAnnotations: string[],
    compressionLine: { seconds: string[], hoverText: string[] },
    compressionLines: Partial<ScatterData>[],
    phaseErrors: { [key: string]: Array<{ [key: string]: string }> }
) => {
    const { 'Time Stamp[Hr:Min:Sec]': timestamp,
            'Action/Vital Name': action,
            'SubAction Time[Min:Sec]': subActionTime,
            'SubAction Name': subAction,
            'Score': score,
            'Old Value': oldValue,
            'New Value': newValue,
            'Username': phaseName,
            'Speech Command': comment
    } = row;
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
        currentAction=action;
        if (!phaseMap[action]) {
            phaseMap[action] = { start: timeStampInDateString, end: '0' };
        } else if(!(subActionTime||subAction||score||oldValue||newValue)) {
            phaseMap[action].end = timeStampInDateString;
        }
    }

    const transitionEnd = phaseMap[currentAction]?phaseMap[currentAction].end:'0';
    const plotAction =  shouldPlotAction(action, subAction, timestamp, oldValue, timestampsInDateString[timestampsInDateString.length-1], transitionEnd, error);
    if(plotAction.markAsError==='previous'){
        actionColors[actionColors.length - 1] = 'red';
    }
    if (plotAction.shouldPlotAction&&(subActionTime||subAction||score||oldValue||newValue)) {
        subActions.push(subAction);
        actionAnnotations.push(`${timestamp}, ${subAction}`);
        timestampsInDateString.push(timeStampInDateString);
        if(plotAction.markAsError==='current'){
            actionColors.push('red');
        }else{
            actionColors.push('green');
        }
        yValuesList.push(yValues[subAction]);
    }

    // Check for phase errors using oldValue
    if (isPhaseError(oldValue)) {
        const errorDetails = {
            'Action/Vital Name': action,
            'SubAction Name': subAction,
            'Time Stamp[Hr:Min:Sec]': timestamp,
            'Score': score,
            'Old Value': oldValue,
            'New Value': newValue,
            'Speech Command': comment
        };

        if (!phaseErrors[phaseName]) {
            phaseErrors[phaseName] = []; // Initialize as an array
        }

        phaseErrors[phaseName].push(errorDetails);
    }
};

export const generatePhaseErrorImagesData = (phaseErrors: { [key: string]: Array<{ [key: string]: string }> }, phaseMap: { [key: string]: { start: string, end: string } }) => {
    let errorImagesData: Partial<ImageWithName>[] = [];

    Object.keys(phaseErrors).forEach(action => {
        const errors = phaseErrors[action];
        const phase = phaseMap[action];
        if (!phase) return;

        // Calculate phase timing
        const phaseStartSeconds = timeStampStringToSeconds(phase.start);
        const phaseEndSeconds = timeStampStringToSeconds(phase.end);
        const phaseDuration = phaseEndSeconds - phaseStartSeconds;
        const interval = phaseDuration / (errors.length + 1); // Space out errors evenly

        errors.forEach((error, index) => {
            const errorTimeSeconds = phaseStartSeconds + (index + 1) * interval; // Calculate the time for each error
            const errorTime = timeStampToDateString(new Date(errorTimeSeconds * 1000).toISOString().substr(11, 8));
            const icon = getIcon(error['Action/Vital Name']);

            errorImagesData.push({
                source: icon.image,
                xref: 'x',
                yref: 'y',
                x: errorTime.replace(' ', 'T') + 'Z',
                y: -1.5, // Adjust the Y position as needed
                name: `${error['Action/Vital Name']}${error['Speech Command']?' - '+error['Speech Command']:''}`,
                sizex: 58800,  // Set dynamically if needed
                sizey: 0.373,   // Set dynamically if needed
                xanchor: 'center',
                yanchor: 'middle',
                layer: 'above'
            });
        });
    });

    return errorImagesData;
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

        accumulator.transitionShapes.push(createPhaseErrorTransition(
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

export function createActionsScatterData(timeStampsInDateString: Array<string>, actionColors: string[], yValues: Array<number>, subActions: Array<string>, annotations: Array<string>)
    : { scatterData: Partial<ScatterData>, images: Array<Partial<ImageWithName>> } {
    const range = timeStampStringToSeconds(timeStampsInDateString[timeStampsInDateString.length - 1]) - timeStampStringToSeconds(timeStampsInDateString[0]);

    const images: Array<Partial<ImageWithName>> = subActions.map((subAction, index) => {
        const icon = getIcon(subAction);
        return {
            source: icon.image,
            xref: 'x',
            yref: 'y',
            x: timeStampsInDateString[index].replace(' ', 'T') + 'Z',
            y: yValues[index],
            name: icon.name,
            sizex: range * 100,
            sizey: 0.373,
            xanchor: 'center',
            yanchor: 'middle',
            layer: 'above'
        };
    });

    return {
        scatterData: {
            x: timeStampsInDateString,
            y: yValues,
            mode: 'text+markers',
            type: 'scatter',
            customdata: subActions.map(subAction => getIcon(subAction).name),
            text: subActions.map(subAction => getIcon(subAction).unicode),
            hovertext: annotations,
            hoverinfo: 'text',
            textposition: "bottom center",
            textfont: { size: 16 },
            marker: {
                size: 18,
                symbol: 'square',
                color: actionColors
            }
        },
        images
    };
}

export function createStageErrorsScatterData(phaseErrorImages: Partial<ImageWithName>[]): { scatterData: Partial<ScatterData>; images: Array<Partial<ImageWithName>> } {
    const errorImages: Array<Partial<ImageWithName>> = phaseErrorImages.map(errorImage => ({
        source: errorImage.source,
        xref: errorImage.xref,
        yref: errorImage.yref,
        x: errorImage.x,
        y: errorImage.y,
        name: errorImage.name,
        sizex: errorImage.sizex,
        sizey: errorImage.sizey,
        xanchor: errorImage.xanchor,
        yanchor: errorImage.yanchor,
        layer: errorImage.layer
    }));

    return {
        scatterData: {
            // Filter out undefined values
            x: errorImages.map(image => image.x).filter((val): val is string => val !== undefined),
            y: errorImages.map(image => image.y).filter((val): val is number => val !== undefined),
            mode: 'markers',
            type: 'scatter',
            customdata: errorImages.map(image => image.name).filter((val): val is string => val !== undefined),
            text: errorImages.map(image => image.name).filter((val): val is string => val !== undefined), // Filter for text
            textposition: 'top center',
            textfont: { size: 16 },
            hovertext: errorImages.map(image => image.name).filter((val): val is string => val !== undefined), // Filter for text,
            hoverinfo: 'text',
            hoverlabel: {
                bgcolor: '#003366', // Dark Blue
                font: { color: '#FFFF99' } // Light Yellow
            },
            marker: {
                size: 18,
                symbol: 'square',
                color: errorImages.map(()=>'rgba(249, 105, 14, 0.8)')
            }
        },
        images: errorImages
    };
}

export function createPhaseErrorTransition(phaseName: string, start: string, end: string, fillColor: string): Partial<Shape> {
    return {
        type: 'rect',
        xref: 'x',
        yref: 'y',
        x0: start,
        x1: end,
        y0: -1, // Position below the plot
        y1: -2, // Adjusted height for the phase errors box - must be equal or smaller than layout y range (see generateLayout)
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
        y1: 12,
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

export function shouldPlotAction(action: string, subAction:string, timestampString:string, oldValue: string, previousActionTimestamp: string,
                                 transitionEndTimestamp:string, error: ErrorAction) {
    if(oldValue==='Error-Triggered' && timeStampStringToSeconds(transitionEndTimestamp)!==timeStampStringToSeconds(timestampString)) { //current row implies error
        if(Math.abs(timeStampStringToSeconds(previousActionTimestamp) - timeStampStringToSeconds(timestampString))<2) { //previous row is an action whose timestamp matches error timestamp
            //The previous line should be marked as an error
            error.triggered = false;
            error.name = '';
            error.time = 0;
            return {error, markAsError: 'previous', shouldPlotAction: false};
        }else {// The next line should be marked as error if the next acton line will be an action
            error.triggered = true;
            error.name = action;
            error.time = timeStampStringToSeconds(timestampString);
            return {error, markAsError: undefined, shouldPlotAction: false};
        }
    }else if(actionRegex.test(action) && (subAction && !subAction.includes('CPR'))) {
        if (error.triggered) { // prior to this action row an error row was seen
            if (Math.abs(timeStampStringToSeconds(timestampString) - error.time) < 3) {//if the previously seen error row timestamp matches the current action row timestamp
                //The current line should be marked as an error
                error.triggered = false;
                error.name = '';
                error.time = 0;
                return {error, markAsError: 'current', shouldPlotAction: true};
            }
        }
        return {error, markAsError: undefined, shouldPlotAction: true};
    }else {
        //not an action row but error is triggered information should not be reset
        return {error, markAsError: undefined, shouldPlotAction: false};
    }
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

// Function to determine if there is a phase error
export function isPhaseError(oldValue: string) {
    return oldValue === "Error-Triggered"
}

