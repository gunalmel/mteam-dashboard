import { VisualAttentionData } from '@/types';
import {processVisualAttentionData} from '@/app/lib/processVisualAttentionData';
import {Today} from '@/app/utils/TodayDateTimeConverter';
import {data as visualAttentionData} from '../test-visual-attention-data.json';
import {data as expectedVisualAttentionData} from '../../build/test-data/expected-visual-attention.json';

describe('processVisualAttentionData', () => {
  it('should calculate category counts in sliding windows', () => {
    const data: VisualAttentionData[] = [
      { time: 1, category: 'A', object: 'alpha' },
      { time: 2, category: 'B', object: 'omega' },
      { time: 2.5, category: 'B', object: 'omega' },
      { time: 3, category: 'A', object: 'beta' },
      { time: 4, category: 'A', object: 'alpha' },
      { time: 5, category: 'B', object: 'theta'},
      { time: 5.1, category: null, object: null },
      { time: 5.2, category: undefined, object: undefined },
      { time: 5.3, category: null },
      { time: 5.4, category: 'C', object: 'phi' }
    ];
    const windowSize = 2;
    const expected = [
      //e.g.: objectNames: {A: 'alpha, beta', B: new Set('alpha, beta')},
      { time: Today.parseSeconds(2).dateTimeString, counts: { A: 0.5, B:0.5 },  totalCount: 4 },
      { time: Today.parseSeconds(4).dateTimeString, counts: { A: 0.5, B: 0.5 }, totalCount: 2 },
      { time: Today.parseSeconds(6).dateTimeString, counts: { C: 1 }, totalCount: 1 }
    ];

    const result = processVisualAttentionData(data, windowSize);

    expect(result).toEqual(expected);
    expect(processVisualAttentionData(visualAttentionData, 10)).toStrictEqual(expectedVisualAttentionData);
  });
});
