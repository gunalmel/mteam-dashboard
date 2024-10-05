import ActionsCsvRow from '@/app/lib/csv/ActionsCsvRow';
import CsvDateTimeStamp from '@/app/lib/csv/CsvDateTimeStamp';

function createMockRow(timeStamp: string, action: string, subAction: string, subActionTime: string, score: string, oldValue: string, newValue: string, username: string, speechCommand: string) {
  return {
    'Time Stamp[Hr:Min:Sec]': timeStamp,
    'Action/Vital Name': action,
    'SubAction Time[Min:Sec]': subActionTime,
    'SubAction Name': subAction,
    'Score': score,
    'Old Value': oldValue,
    'New Value': newValue,
    'Username': username,
    'Speech Command': speechCommand
  };
}

describe('ActionsCsvRow: Should parse the csv row for building actions graph', () => {
  it('should correctly parse the timestamp', () => {
    const timeStamp = '00:01:30';
    const row = createMockRow(timeStamp, '', 'subAction', 'subActionTime', 'score', 'oldValue', 'newValue', 'user1', 'command1');

    const expected = new CsvDateTimeStamp(timeStamp);
    const actual = new ActionsCsvRow(row, {});

    expect(actual.timeStamp.seconds).toBe(90);
    expect(actual.timeStamp).toStrictEqual(expected);
    expect(actual.isAt(expected)).toBe(true);
    expect(actual.isAt(new CsvDateTimeStamp())).toBe(false);
  });

  describe('Identify the action name to match icon, stage name to label stages and error to decide where to plot the row in the stage errors section or in the scatter plot area', () => {
    it.each([['(1)Test(action)', 'Expected Action'],
      [' (  2 )  Test  ( action  ) ', 'Expected Action'],
      ['something', 'Not marked with (\\d+)\\w(action)'],
      ['', 'Not marked with (\\d+)\\w(action)']])('Action name: action/vital name is \'%s\' action name is: \'%s\'', (actionVitalName, expected) => {
      const row = createMockRow('00:01:30', actionVitalName, expected, '00:00:30', '10', 'oldValue', 'newValue', 'user1', 'command1');

      const actual = new ActionsCsvRow(row, {});

      expect(actual.actionOrVitalName).toBe(actionVitalName);
      expect(actual.actionName).toBe(expected);
    });

    it.each([['(1)Test(action)', 'stage1'],
      ['(2)No stage name mapped(action)', undefined],
      ['something', '']])('Without error: action/vital name is \'%s\' stage name is: \'%s\'', (actionVitalName, expected) => {
      const row = createMockRow('00:01:30', actionVitalName, '', '00:00:30', '10', 'oldValue', 'newValue', 'user1', 'command1');

      const actual = new ActionsCsvRow(row, {'Test':'stage1'});

      expect(actual.stageName).toBe(expected);
    });

    it.each([['intubation', 'errOR-triGGered', '(1)Test(action)', 'stage1', true],
      ['xray-chest', 'ERROR-TRIGGERED', '(2)No stage name mapped(action)', undefined, true],
      ['something', 'error-triggered', 'umich1', '', true],
      ['Test(action)', 'something', 'umich1', '', false]])
      ('with error: action/vital name is \'%s\' old value is: \'%s\' username is: \'%s\'',
      (actionVitalName, oldValue, username, expected, expectedTriggeredError) => {
      const row = createMockRow('00:01:30', actionVitalName, '', '00:00:30', '10', oldValue, 'newValue', username, 'command1');

      const actual = new ActionsCsvRow(row, {'Test':'stage1'});

      expect(actual.triggeredError).toBe(expectedTriggeredError);
      expect(actual.stageName).toBe(expected);
      expect(actual.errorExplanation).toBe(expectedTriggeredError?'command1':'');
    });
  });

  describe('Identify the transition boundary so that we can shade the stages/phases on the actions scatter plot', () => {
    it('not marked with (action), always returns false',()=>{
      const row = createMockRow('00:01:30', 'intubation', '', '', '', '', '', '', '');

      const actual = new ActionsCsvRow(row, {});

      expect(actual.isStageBoundary).toBe(false);
    });

    it.each([
      ['(1)V-Tach 2D(action)','','','','','',true],
      ['(1)V-Tach 2D(action)','a','','','','',false],
      ['(1)V-Tach 2D(action)','','b','','','',false],
      ['(1)V-Tach 2D(action)','','','c','','',false],
      ['(1)V-Tach 2D(action)','','','','d','',false],
      ['(1)V-Tach 2D(action)','','','','','e',false],
    ])('action: \'%s\', subaction: \'%s\', subActionTime: \'%s\', score: \'%s\', oldValue: \'%s\', newValue: \'%s\', expected: \'%s\'', (actionString, subAction, subActionTime, score, oldValue, newValue, expected) => {
      const row = createMockRow('00:01:30', actionString, subAction, subActionTime, score, oldValue, newValue, 'user1', 'command1');

      const actual = new ActionsCsvRow(row, {});

      expect(actual.isStageBoundary).toBe(expected);
    });
  });

  describe('Identify the data point to be displayed on the scatter plot and annotation for it to display', () => {
    it.each([
      ['(1)V-Tach 2D(action)','','','','','',false],
      ['(1)V-Tach 2D(action)','a','','','','',true],
      ['(1)V-Tach 2D(action)','','b','','','',true],
      ['(1)V-Tach 2D(action)','','','c','','',true],
      ['(1)V-Tach 2D(action)','','','','d','',true],
      ['(1)V-Tach 2D(action)','','','','','e',true],
      ['(1)V-Tach 2D(action)','begin CPR','','','','',false],
      ['(1)V-Tach 2D(action)','eNd cpr','','','','',false],
      ['(1)V-Tach 2D(action)','enter cpr','','','','',false],
      ['(1)V-Tach 2D(action)','stop cpr','','','','',false]
    ])('\'action: \'%s\', subaction: \'%s\', subActionTime: \'%s\', score: \'%s\', oldValue: \'%s\', newValue: \'%s\', expected: \'%s\'', (actionString, subAction, subActionTime, score, oldValue, newValue, expected) => {
      const row = createMockRow('00:01:30', actionString, subAction, subActionTime, score, oldValue, newValue, 'user1', 'command1');

      const actual = new ActionsCsvRow(row, {});

      expect(actual.isScatterPlotData()).toBe(expected);
      expect(actual.actionAnnotation).toBe(expected?`00:01:30, ${subAction}`:'');
    });
  });

  describe('Identify cpr starts/end points so that on the plot we can draw a line between the start and end of cpr', () => {
    it.each([
      ['Begin CPR', true],
      ['beGin CpR', true],
      ['Begin Something', false],
      ['', false]
    ])('when the cpr related phrase is \'%s\' Then cpr starts is: \'%s\'', (subAction, expected) => {
      const row = createMockRow('00:01:30', '', subAction, '', '', '', '', '', '');

      const actual = new ActionsCsvRow(row, {});

      expect(actual.doesCPRStart()).toBe(expected);
    });
    it.each([
      ['End CPR', true],
      ['end CpR', true],
      ['End Something', false],
      ['', false]
    ])('when the cpr related phrase is \'%s\' Then cpr ends is: \'%s\'', (subAction, expected) => {
      const row = createMockRow('00:01:30', '', subAction, '', '', '', '', '', '');

      const actual = new ActionsCsvRow(row, {});

      expect(actual.doesCPREnd()).toBe(expected);
    });
  });

  it('if the row\'s timestamp is close enough to another row\'s timestamp then it\'s capable of marking that row as error', () => {
    const row = createMockRow('00:01:30', 'intubation', '', '', '', '', '', '', '');
    const neighborRow = createMockRow('00:01:32', 'intubation', '', '', '', '', '', '', '');
    const notNeighborRow = createMockRow('00:01:33', 'intubation', '', '', '', '', '', '', '');

    const actual = new ActionsCsvRow(row, {});
    const actualNeighbor = new ActionsCsvRow(neighborRow, {});
    const actualNotNeighbor = new ActionsCsvRow(notNeighborRow, {});

    expect(actual.isCloseEnough(actualNeighbor.timeStamp)).toBe(true);
    expect(actual.isCloseEnough(actualNotNeighbor.timeStamp)).toBe(false);
  });
});
