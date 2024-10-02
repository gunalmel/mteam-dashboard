import {Annotations, ScatterData, Shape} from 'plotly.js';
import {parseTime, timeStampStringToSeconds} from '@/utils/timeUtils';
import {getIcon, phaseColors, yValues} from '@/components/constants';
import {ImageWithName, LayoutWithNamedImage} from '@/types';
import ActionsCsvRow from '@/utils/ActionsCsvRow';
import SequentialTimePeriods from '@/utils/SequentialTimePeriods';
import CompressionLines from '@/utils/CompressionLines';
import CsvDateTimeStamp from '@/utils/CsvDateTimeStamp';
import ErrorActionTracker from '@/utils/ErrorActionTracker';

function extractShockAmount(subAction:string) {
    const shockMatch = subAction?.match(/\d+J/);
    return shockMatch ? shockMatch[0] : '';
}

export const processRow = (
    row: { [key: string]: string },
    errorActionTracker: ErrorActionTracker,
    stageMap: SequentialTimePeriods,
    scatterPlotTimeStamps: Array<CsvDateTimeStamp>,
    actionColors: string[],
    yValuesList: number[],
    subActions: string[],
    actionAnnotations: string[],
    compressionLines: CompressionLines,
    stageErrors: { [key: string]: Array<{ [key: string]: string }> }
) => {
    const parsedRow = new ActionsCsvRow(row);

    if (parsedRow.doesCPRStart()) {
        compressionLines.addStart(parsedRow.timeStamp.dateTimeString, parsedRow.timeStamp.timeStampString);
    } else if (parsedRow.doesCPREnd()) {
        compressionLines.updateEnd(parsedRow.timeStamp.dateTimeString, parsedRow.timeStamp.timeStampString);
    }

    if (parsedRow.isStageBoundary) {
        stageMap.update(parsedRow.stageName, parsedRow.timeStamp);
    }

    createScatterPoints(parsedRow, stageMap, errorActionTracker, actionColors,
                      subActions, actionAnnotations, scatterPlotTimeStamps, yValuesList);


    if (parsedRow.triggeredError && parsedRow.isAt(stageMap.get(parsedRow.stageName).end)) {
        const errorDetails = {
            'Action/Vital Name': parsedRow.actionOrVitalName,
            'Time Stamp[Hr:Min:Sec]': parsedRow.timeStamp.timeStampString,
            'Speech Command': parsedRow.errorExplanation
            //'SubAction Time[Min:Sec]': subActionTime, //Warning|Error|Critical Error
            // 'SubAction Name': parsedRow.subAction, //Action-Should-Be-Performed|Action-Should-Not-Be-Performed
            // 'Score': score, //Action-Was-Performed|Action-Was-Not-Performed
            // 'Old Value': parsedRow.oldValue, // Error-Triggered already used in parsedRow.triggeredError
            // 'New Value': newValue, //umich1|NA
        };

        if (!stageErrors[parsedRow.stageName]) {
            stageErrors[parsedRow.stageName] = []; // Initialize as an array
        }

        stageErrors[parsedRow.stageName].push(errorDetails);
    }
};

export function createScatterPoints(parsedRow: ActionsCsvRow,
                                    stageMap: SequentialTimePeriods,
                                    errorActionTracker: ErrorActionTracker,
                                    actionColors: any[],
                                    subActions: string[],
                                    actionAnnotations: string[],
                                    scatterPlotTimeStamps: CsvDateTimeStamp[],
                                    yValuesList: number[]) {

    const previousActionTime = scatterPlotTimeStamps[scatterPlotTimeStamps.length-1];

    if(parsedRow.triggeredError && !parsedRow.isAt(stageMap.get(parsedRow.stageName).end)) { //current row implies error
        if(parsedRow.canMarkError(previousActionTime)) { //previous row is an action whose timestamp matches error timestamp
            //The previous line should be marked as an errorActionTracker
            actionColors[actionColors.length - 1] = 'red';
            errorActionTracker.reset();
        }else {
            // The next line should be marked as error if the next row will be an action
            errorActionTracker.time = parsedRow.timeStamp;
        }
    }else if(parsedRow.isScatterPlotData) {
        // prior to this action row an errorActionTracker row was seen
        if (parsedRow.canMarkError(errorActionTracker.time)) {
            //if the previously seen errorActionTracker row timestamp matches the current action row timestamp then the current line should be marked as an errorActionTracker
            actionColors.push('red');
            errorActionTracker.reset(); //error demarcation done, reset the errorActionTracker status for the upcoming rows
        } else {
            actionColors.push('green');
        }
        subActions.push(parsedRow.subAction);
        actionAnnotations.push(`${parsedRow.timeStamp.timeStampString}, ${parsedRow.subAction}`);
        scatterPlotTimeStamps.push(parsedRow.timeStamp);
        yValuesList.push(yValues[parsedRow.subAction]);
    }
}

export const generateStageErrorImagesData = (phaseErrors: { [key: string]: Array<{ [key: string]: string }> }, phaseMap: { [key: string]: { start: string, end: string } }) => {
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
                x: parseTime(new Date(xPosition * 1000).toISOString().substr(11, 8)).dateTimeString,
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
