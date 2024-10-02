import {Annotations, ScatterData, Shape} from 'plotly.js';
import {timeStampStringToSeconds, timeStampToDateString} from '@/utils/timeUtils';
import {getIcon, phaseColors, yValues} from '@/components/constants';
import {ActionsCSVDataRow, ErrorAction, ImageWithName, LayoutWithNamedImage} from '@/types';
import ActionsCSVRow from "@/utils/ActionsCSVRow";
import SequentialTimePeriods from "@/utils/SequentialTimePeriods";
import CompressionLines from "@/utils/CompressionLines";

const actionRegex = /\(\d+\)([^(]+)\(action\)/;
function extractShockAmount(subAction:string) {
    const shockMatch = subAction.match(/\d+J/);
    return shockMatch ? shockMatch[0] : '';
}
let currentAction='';
export const processRow = (
    row: { [key: string]: string },
    error: ErrorAction,
    stageMap: SequentialTimePeriods,
    timestampsInDateString: string[],
    actionColors: string[],
    yValuesList: number[],
    subActions: string[],
    actionAnnotations: string[],
    compressionLines: CompressionLines,
    phaseErrors: { [key: string]: Array<{ [key: string]: string }> }
) => {
    const parsedRow = new ActionsCSVRow(
      row as unknown as ActionsCSVDataRow,
    );

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

    if (parsedRow.doesCPRStart()) {
        compressionLines.addStart(timeStampInDateString, timestamp);
    } else if (parsedRow.doesCPREnd()) {
        compressionLines.updateEnd(timeStampInDateString, timestamp);
    }

    if (parsedRow.isStageBoundary) {
        stageMap.update(action, timeStampInDateString);
    }

    if (parsedRow.isAction) {
        currentAction=action;
    }
    const transitionEnd = stageMap.get(currentAction)?stageMap.get(currentAction)?.end??'0':'0';

    const plotAction =  shouldPlotAction(action, subAction, timestamp, oldValue, timestampsInDateString[timestampsInDateString.length-1], transitionEnd, error);
    if(plotAction.markAsError==='previous'){
        actionColors[actionColors.length - 1] = 'red';
    }
    if (plotAction.shouldPlotAction&&!parsedRow.isStageBoundary) {
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
    if (parsedRow.triggeredError) {
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

        // Split errors into two lines
        const errorCount = errors.length;
        const firstLineCount = Math.ceil(errorCount / 2);
        const secondLineCount = errorCount - firstLineCount;

        // Calculate the interval for each image
        const totalSpacingFirstLine = phaseDuration / (firstLineCount + 1); // Space evenly for first line
        const totalSpacingSecondLine = phaseDuration / (secondLineCount + 1); // Space evenly for second line

        // Set initial y-coordinates
        const yCoord1 = -1.5; // Y position for first line
        const yCoord2 = -2.5; // Y position for second line

        errors.forEach((error, index) => {
            const icon = getIcon(error['Action/Vital Name']);

            let yCoordinate;
            let xPosition;

            if (index < firstLineCount) {
                // First line
                yCoordinate = yCoord1;
                xPosition = phaseStartSeconds + (index + 1) * totalSpacingFirstLine;
            } else {
                // Second line
                yCoordinate = yCoord2;
                const secondLineIndex = index - firstLineCount; // Index for second line
                xPosition = phaseStartSeconds + (secondLineIndex + 1) * totalSpacingSecondLine;
            }

            errorImagesData.push({
                source: icon.image,
                xref: 'x',
                yref: 'y',
                x: timeStampToDateString(new Date(xPosition * 1000).toISOString().substr(11, 8)).replace(' ', 'T') + 'Z',
                y: yCoordinate,
                name: `${error['Action/Vital Name']}${error['Speech Command'] ? ' - ' + error['Speech Command'] : ''}`,
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
        yaxis: { visible: false, range: [-3, maxYValue + 2] },
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
            text: subActions.map(subAction => extractShockAmount(subAction)),
            hovertext: annotations,
            hoverinfo: 'text',
            textposition: "bottom center",
            textfont: { size: 8 },
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
        y1: -4, // Adjusted height for the phase errors box - must be equal or smaller than layout y range (see generateLayout)
        fillcolor: fillColor,
        line: { width: 0 },
        layer: 'below',
        name: phaseName
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
        xref: 'x',
        yref: 'paper',
        x: start,
        y: 0.9,
        xanchor: 'left',
        yanchor: 'middle',
        text: text,
        showarrow: false,
        font: {
            size: 16,
            color: fontColor,
            family: 'Arial, sans-serif',
            weight: 700,
        },
        bgcolor: 'rgba(255, 255, 255, 0.8)',
        bordercolor: fontColor, // same as text for uniformity
        borderwidth: 1, 
        borderpad: 3,
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

