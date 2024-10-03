import {Annotations, ScatterData, Shape} from 'plotly.js';
import {parseTime} from '@/utils/timeUtils';
import {getIcon, phaseColors, yValues} from '@/components/constants';
import {ImageWithName, LayoutWithNamedImage} from '@/types';
import ActionsCsvRow from '@/utils/ActionsCsvRow';
import SequentialTimePeriods from '@/utils/SequentialTimePeriods';
import CompressionLines from '@/utils/CompressionLines';
import CsvDateTimeStamp from '@/utils/CsvDateTimeStamp';
import ErrorActionTracker from '@/utils/ErrorActionTracker';
import ActionScatterPlotData from '@/utils/ActionScatterPlotData';
import ActionsScatterPlotPoint from '@/utils/ActionsScatterPlotPoint';
import ActionError from '@/utils/ActionError';
import CsvTimeInterval from '@/utils/CsvTimeInterval';

export const processRow = (
    row: { [key: string]: string },
    scatterPlotData: ActionScatterPlotData,
    errorActionTracker: ErrorActionTracker,
    stages: SequentialTimePeriods,
    compressionLines: CompressionLines,
    stageErrors: { [key: string]: Array<ActionError> }
) => {
    const parsedRow = new ActionsCsvRow(row);

    if (parsedRow.doesCPRStart()) {
        compressionLines.addStart(parsedRow.timeStamp.dateTimeString, parsedRow.timeStamp.timeStampString);
    } else if (parsedRow.doesCPREnd()) {
        compressionLines.updateEnd(parsedRow.timeStamp.dateTimeString, parsedRow.timeStamp.timeStampString);
    }

    if (parsedRow.isStageBoundary) {
        stages.update(parsedRow.stageName, parsedRow.timeStamp);
    }

    createScatterPoints(parsedRow, stages, errorActionTracker, scatterPlotData);

    if (shouldRowRequireMissingActions(parsedRow, stages.get(parsedRow.stageName).end)) {
        const error = new ActionError(parsedRow);
        if (!stageErrors[parsedRow.stageName]) {
            stageErrors[parsedRow.stageName] = [];
        }
        stageErrors[parsedRow.stageName].push(error);
    }
};

/*
 * Identifies the row as a row that reports missing actions in a stage
 */
function shouldRowRequireMissingActions(row: ActionsCsvRow, stageTransitionBoundary: CsvDateTimeStamp) {
    return row.triggeredError && row.isAt(stageTransitionBoundary);
}

/**
 * Identifies whether a row is considered a row triggering an error resulting in an action that was taken to be marked as error.
 */
function shouldRowMarkAnActionError(row: ActionsCsvRow, stageTransitionBoundary: CsvDateTimeStamp) {
    return row.triggeredError && !row.isAt(stageTransitionBoundary);
}

/**
 * Handles marking the previous row as an error or tracking the next potential error.
 */
function handlePreviousRowError(row: ActionsCsvRow, scatterPlotData: ActionScatterPlotData, errorActionTracker: ErrorActionTracker) {
    if (row.canMarkError(scatterPlotData.getPrevious().x)) {
        scatterPlotData.markPreviousError();
        errorActionTracker.reset();
    } else {
        errorActionTracker.track(row.timeStamp);
    }
}

/**
 * Handles the actual processing of scatter plot data and marking rows as either correct or erroneous.
 */
function processScatterPlotDataRow(parsedRow:ActionsCsvRow, scatterPlotData:ActionScatterPlotData, errorActionTracker: ErrorActionTracker) {
    const scatterPoint = new ActionsScatterPlotPoint(parsedRow);

    if (parsedRow.canMarkError(errorActionTracker.time)) {
        scatterPoint.markError();
        errorActionTracker.reset();
    } else {
        scatterPoint.markCorrect();
    }

    scatterPlotData.add(scatterPoint);
}

// Main function to create scatter points with improved modularity
export function createScatterPoints(parsedRow:ActionsCsvRow, stages: SequentialTimePeriods, errorActionTracker: ErrorActionTracker, scatterPlotData:ActionScatterPlotData) {
    const stageTransitionBoundary = stages.get(parsedRow.stageName).end;

    if (shouldRowMarkAnActionError(parsedRow, stageTransitionBoundary)) {
        handlePreviousRowError(parsedRow, scatterPlotData, errorActionTracker);
    } else if (parsedRow.isScatterPlotData) {
        processScatterPlotDataRow(parsedRow, scatterPlotData, errorActionTracker);
    }
}

export const generateStageErrorImagesData = (stageErrors: { [key: string]: Array<ActionError> },
                                             stageMap: Map<string, CsvTimeInterval>) => {
    let errorImagesData: Partial<ImageWithName>[] = [];

    Object.keys(stageErrors).forEach(action => {
        const errors = stageErrors[action];
        const phase = stageMap.get(action);
        if (!phase) return;

        // Split errors into two lines
        const errorCount = errors.length;
        const firstLineCount = Math.ceil(errorCount / 2);
        const secondLineCount = errorCount - firstLineCount;

        // Calculate the interval for each image
        const totalSpacingFirstLine = phase.duration / (firstLineCount + 1); // Space evenly for first line
        const totalSpacingSecondLine = phase.duration / (secondLineCount + 1); // Space evenly for second line

        // Set initial y-coordinates
        const yCoord1 = -1.5; // Y position for first line
        const yCoord2 = -2.5; // Y position for second line

        errors.forEach((error, index) => {
            const icon = getIcon(error.name);

            let yCoordinate;
            let xPosition;

            if (index < firstLineCount) {
                // First line
                yCoordinate = yCoord1;
                xPosition = phase.start.seconds + (index + 1) * totalSpacingFirstLine;//phaseStartSeconds + (index + 1) * totalSpacingFirstLine;
            } else {
                // Second line
                yCoordinate = yCoord2;
                const secondLineIndex = index - firstLineCount; // Index for second line
                xPosition = phase.start.seconds + (secondLineIndex + 1) * totalSpacingSecondLine; // phaseStartSeconds + (secondLineIndex + 1) * totalSpacingSecondLine;
            }

            errorImagesData.push({
                source: icon.image,
                xref: 'x',
                yref: 'y',
                x: parseTime(new Date(xPosition * 1000).toISOString().slice(11, 19)).dateTimeString,//parseTime(new Date(xPosition * 1000).toISOString().substr(11, 8)).dateTimeString,
                y: yCoordinate,
                name: error.annotation,
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
    stageMap: Map<string, CsvTimeInterval>,
    plotData: ActionScatterPlotData
): Partial<LayoutWithNamedImage> => {
    let stageCounter=0;
    const shapes : Partial<Shape>[] = [];
    const annotations:Partial<Annotations>[] = [];

    stageMap.forEach((period, stage)=>{
        shapes.push(createTransition(
            stage,
            period.start.dateTimeString,
            period.end.dateTimeString,
            phaseColors[stageCounter % phaseColors.length] + '33'
        ));
        shapes.push(createStageErrorTransition(
            stage,
            period.start.dateTimeString,
            period.end.dateTimeString,
            phaseColors[stageCounter % phaseColors.length] + '33',
        ));
        annotations.push(createTransitionAnnotation(
            stage,
            period.start.dateTimeString,
            phaseColors[stageCounter % phaseColors.length]
        ));
        stageCounter++;
    });

    // Find the maximum yValue from the yValues object
    const maxYValue = Math.max(...Object.values(yValues));

    return {
        title: 'Clinical Review Timeline',
        xaxis: { title: 'Time (seconds)', showgrid: false, range: plotData.xAxisRange(), tickformat: '%H:%M:%S' },
        yaxis: { visible: false, range: [-3, maxYValue + 2] },
        showlegend: false,
        shapes,
        annotations,
        autosize: true,
        modebar: {
            orientation: 'v',
        },
    };
};


export function createStageErrorsScatterData(phaseErrorImages: Partial<ImageWithName>[]): { scatterData: Partial<ScatterData>; images: Array<Partial<ImageWithName>> } {
    const errorImages: Array<Partial<ImageWithName>> =
        phaseErrorImages.map(errorImage => ({
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

export function createStageErrorTransition(phaseName: string, start: string, end: string, fillColor: string): Partial<Shape> {
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
