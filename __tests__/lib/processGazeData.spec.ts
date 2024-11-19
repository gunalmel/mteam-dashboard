import { GazeData } from '@/types';
import {processGazeData} from '@/app/lib/processGazeData';
import {Today} from '@/app/utils/TodayDateTimeConverter';
import {data as visualAttentionData} from '../test-visual-attention-data.json';
// import {data as expectedVisualAttentionData} from '../expected-data/expected-visual-attention.json';

describe('processGazeData', () => {
  it('should calculate category counts and unique objects in sliding windows', () => {
    const data: GazeData[] = [
      { time: 1, category: 'A', object: 'alpha' },
      { time: 2, category: 'B', object: 'omega' },
      { time: 2.5, category: 'B', object: 'omega' },
      { time: 2.8, category: 'A', object: 'delta' },
      { time: 3, category: 'A', object: 'beta' },
      { time: 4, category: 'A', object: 'alpha' },
      { time: 5, category: 'B', object: 'theta' },
      { time: 5.1, category: null, object: null },
      { time: 5.2, category: undefined, object: undefined },
      { time: 5.3, category: null, object: null },
      { time: 5.4, category: 'C', object: 'phi' },
    ];
    const windowSize = 2;
    const expected = [
      {
        time: Today.parseSeconds(2).dateTimeString,
        counts: { A: 0.6, B: 0.4 },
        objects: { A: new Set(['alpha', 'beta', 'delta']), B: new Set(['omega']) },
        totalCount: 5,
      },
      {
        time: Today.parseSeconds(4).dateTimeString,
        counts: { A: 0.5, B: 0.5 },
        objects: { A: new Set(['alpha']), B: new Set(['theta']) },
        totalCount: 2,
      },
      {
        time: Today.parseSeconds(6).dateTimeString,
        counts: { C: 1 },
        objects: { C: new Set(['phi']) },
        totalCount: 1,
      },
    ];

    const result = processGazeData(data, windowSize);

    console.log(processGazeData(visualAttentionData, 10));

    expect(result).toEqual(expected);
    // expect(processGazeData(visualAttentionData, 10)).toStrictEqual(expectedVisualAttentionData);
  });
});
