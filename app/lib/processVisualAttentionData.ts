import {VisualAttentionData, VisualAttentionDataStack} from '@/types';
import {PlotData} from 'plotly.js';
import {Today} from '@/app/utils/TodayDateTimeConverter';
import {VisualAttentionCategoryColors} from '@/app/ui/components/constants';

export function transformVisualAttentionDataStreamForPlotly(categoryCounts: Generator<VisualAttentionDataStack>): Partial<PlotData>[] {
  const visualAttentionCategoryOrder = ['Tablet', 'Patient', 'Team', 'Equipment', 'Monitors', 'Others'];
  const result: Record<string, Partial<PlotData>> = {};

  for (const windowCount of categoryCounts) {
    for (const category of visualAttentionCategoryOrder) {
      if (!result[category]) {
        result[category] = {
          x: [],
          y: [],
          name: category,
          type: 'bar',
          marker: {color: VisualAttentionCategoryColors[category] || 'black'}
        };
      }
      (result[category].x as string[]).push(windowCount.time);
      (result[category].y as number[]).push(windowCount.counts[category] || 0);
    }
  }

  return Object.values(result);
}

export function* processVisualAttentionDataStream(data: VisualAttentionData[], windowSize: number): Generator<VisualAttentionDataStack> {
  if (isDataEmpty(data)) {
    return;
  }

  let windowEndValue = windowSize;
  let windowCount = initializeWindowCount(windowSize, data[0]);

  for (const current of data) {
    if (isWithinWindow(current, data[0], windowEndValue)) {
      accumulateWindowCounts(windowCount, current);
    } else {
      yield convertCountToFraction(windowCount); // Explicitly yield here
      windowEndValue += windowSize;
      windowCount = createNewWindow(windowEndValue, current);
    }
  }

  yield convertCountToFraction(windowCount); // Yield the final window
}

function isDataEmpty(data: VisualAttentionData[]): boolean {
  return !data || data.length === 0;
}

function initializeWindowCount(windowSize: number, firstData: VisualAttentionData): VisualAttentionDataStack {
  return {
    time: Today.parseSeconds(windowSize).dateTimeString,
    counts: {[firstData.category ?? '']: 0},
    totalCount: 0
  };
}

function isWithinWindow(current: VisualAttentionData, firstData: VisualAttentionData, windowEndValue: number): boolean {
  const elapsedSeconds = current.time - firstData.time;
  return current && elapsedSeconds <= windowEndValue;
}

function accumulateWindowCounts(windowCount: VisualAttentionDataStack, current: VisualAttentionData): void {
  if (!current.category) return;

  windowCount.counts[current.category] = (windowCount.counts[current.category] || 0) + 1;
  windowCount.totalCount++;
}

function convertCountToFraction(window: VisualAttentionDataStack): VisualAttentionDataStack {
  Object.entries(window.counts).forEach(([key]) => {
    window.counts[key] /= window.totalCount;
  });
  return window;
}

function createNewWindow(windowEndValue: number, current: VisualAttentionData): VisualAttentionDataStack {
  return {
    time: Today.parseSeconds(windowEndValue).dateTimeString,
    counts: current.category ? {[current.category]: 1} : {},
    totalCount: current.category ? 1 : 0
  };
}
