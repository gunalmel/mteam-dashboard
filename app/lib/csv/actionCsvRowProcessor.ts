import ActionsCsvRow from '@/app/lib/csv/ActionsCsvRow';
import ActionStages from '@/app/lib/ActionStages';
import ActionsCompressionLines from '@/app/lib/ActionsCompressionLines';
import CsvDateTimeStamp from '@/app/lib/csv/CsvDateTimeStamp';
import ErrorActionTracker from '@/app/lib/csv/ErrorActionTracker';
import ActionScatterPlotData from '@/app/lib/ActionScatterPlotData';
import ActionsScatterPlotPoint from '@/app/lib/ActionsScatterPlotPoint';
import ActionStageError from '@/app/lib/ActionStageError';

export const processRow = (
  row: Record<string, string>,
  scatterPlotData: ActionScatterPlotData,
  errorActionTracker: ErrorActionTracker,
  stages: ActionStages,
  compressionLines: ActionsCompressionLines,
  stageErrors: Record<string, ActionStageError[]>,
) => {
  const parsedRow = new ActionsCsvRow(row);

  if (parsedRow.doesCPRStart()) {
    compressionLines.addStart( parsedRow.timeStamp.dateTimeString, parsedRow.timeStamp.timeStampString);
  } else if (parsedRow.doesCPREnd()) {
    compressionLines.updateEnd(parsedRow.timeStamp.dateTimeString, parsedRow.timeStamp.timeStampString);
  }

  if (parsedRow.isStageBoundary) {
    stages.update(parsedRow.stageName, parsedRow.timeStamp);
  }

  updateScatterPoints(parsedRow, stages, errorActionTracker, scatterPlotData);

  if (shouldRowRequireMissingActions(parsedRow, stages.get(parsedRow.stageName).end)) {
    const error = new ActionStageError(parsedRow);
    if (!stageErrors[parsedRow.stageName]) {
      stageErrors[parsedRow.stageName] = [];
    }
    stageErrors[parsedRow.stageName].push(error);
  }
};

/*
 * Identifies the row as a row that reports missing actions in a stage
 */
function shouldRowRequireMissingActions(row: ActionsCsvRow, stageTransitionBoundary: CsvDateTimeStamp): boolean {
  return row.triggeredError && row.isAt(stageTransitionBoundary);
}

/**
 * Identifies whether a row is considered a row triggering an error resulting in an action that was taken to be marked as error.
 */
function shouldRowMarkAnActionError(row: ActionsCsvRow, stageTransitionBoundary: CsvDateTimeStamp): boolean {
  return row.triggeredError && !row.isAt(stageTransitionBoundary);
}

/**
 * Handles marking the previous row as an error or tracking the next potential error.
 * @param row
 * @param scatterPlotData
 * @param errorActionTracker
 */
function handlePreviousRowError(row: ActionsCsvRow, scatterPlotData: ActionScatterPlotData, errorActionTracker: ErrorActionTracker): void {
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
function processScatterPlotDataRow(parsedRow: ActionsCsvRow, scatterPlotData: ActionScatterPlotData, errorActionTracker: ErrorActionTracker): void {
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
function updateScatterPoints(parsedRow: ActionsCsvRow, stages: ActionStages, errorActionTracker: ErrorActionTracker, scatterPlotData: ActionScatterPlotData): void {
  const stageTransitionBoundary = stages.get(parsedRow.stageName).end;

  if (shouldRowMarkAnActionError(parsedRow, stageTransitionBoundary)) {
    handlePreviousRowError(parsedRow, scatterPlotData, errorActionTracker);
  } else if (parsedRow.isScatterPlotData()) {
    processScatterPlotDataRow(parsedRow, scatterPlotData, errorActionTracker);
  }
}
