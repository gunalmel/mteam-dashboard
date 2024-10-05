import { ImageWithName } from '@/types';
import ActionStageError from '@/app/lib/ActionStageError';
import { Today } from '@/app/utils/timeUtils';
import ActionStages from '@/app/lib/ActionStages';
import {PlotlyScatterData} from '@/app/utils/plotly/PlotlyScatterData';
import {PlotData} from 'plotly.js';

function calculateLineCounts(errorCount: number): [number, number] {
  const firstLineCount = Math.ceil(errorCount / 2);
  return [firstLineCount, errorCount - firstLineCount];
}

function calculateTotalSpacing(duration: number, firstLineCount: number, secondLineCount: number): [number, number] {
  return [duration / (firstLineCount + 1), duration / (secondLineCount + 1)];
}

function calculateLinePosition(index: number, firstLineCount: number): { lineIndex: number; linePosition: number } {
  const lineIndex = index < firstLineCount ? 0 : 1;
  const linePosition = index < firstLineCount ? index : index - firstLineCount;
  return { lineIndex, linePosition };
}

export default function createStageErrors(stages: ActionStages, stageErrors: Record<string, ActionStageError[]>):
    { data:Partial<PlotData>, images: ImageWithName[] } {
  const errorImages: ImageWithName[] = [];
  const errorScatterData = new PlotlyScatterData([], [], [], [], [], [], { bgcolor: '#003366', font: { color: '#FFFF99' }});
  const yCoords = [-1.5, -2.5]; // Y positions for lines

  Object.entries(stageErrors).forEach(([stage, errors]) => {
    const stagePeriod = stages.get(stage);
    if (!stagePeriod) return;

    const lineCounts = calculateLineCounts(errors.length);
    const totalSpacing = calculateTotalSpacing(stagePeriod.duration, ...lineCounts);

    errors.forEach((error, index) => {

      const linePosition = calculateLinePosition(index, lineCounts[0]);
      const xPosition = stagePeriod.start.seconds + (linePosition.linePosition + 1) * totalSpacing[linePosition.lineIndex];

      error.image.x = Today.parseSeconds(xPosition).dateTimeString;
      error.image.y = yCoords[linePosition.lineIndex];
      errorImages.push(error.image);

      errorScatterData.x.push(error.image.x);
      errorScatterData.y.push(error.image.y);
      errorScatterData.hovertext.push(error.annotation);
      errorScatterData.colors.push('rgba(249, 105, 14, 0.8)');

    });
  });

  return {data: errorScatterData.toPlotlyFormat(), images: errorImages };
}
