import { GazeData } from '@/types';
import {processGazeData} from '@/app/lib/processGazeData';

describe('processGazeData', () => {
  it('should calculate category counts in sliding windows', () => {
    const data: GazeData[] = [
      { time: 1, category: 'A' },
      { time: 2, category: 'B' },
      { time: 2.5, category: 'B' },
      { time: 3, category: 'A' },
      { time: 4, category: 'A' },
      { time: 5, category: 'B' },
      { time: 5.1, category: null },
      { time: 5.2, category: undefined },
      { time: 5.3, category: null },
      { time: 5.4, category: 'C' }
    ];
    const windowSize = 2;
    const expected = [
      { time: 3, counts: { A: 0.5, B:0.5 }, totalCount: 4 },
      { time: 5, counts: { A: 0.5, B: 0.5 }, totalCount: 2 },
      { time: 7, counts: { C: 1 }, totalCount: 1 }
    ];

    const result = processGazeData(data, windowSize);

    expect(result).toEqual(expected);
  });
});
