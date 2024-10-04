import ActionsCsvRow from '@/app/lib/csv/ActionsCsvRow';

describe('CSV row markers should identify rows to assign data points to correct variables that will act as input to plotly js scatter plot', () => {

  describe('Identify the transition boundary so that we can shade the stages/phases on the actions scatter plot', () => {
    it.each([
      ['(1)V-Tach 2D(action)','','','','','',true],
      ['(1)V-Tach 2D(action)','a','','','','',false],
      ['(1)V-Tach 2D(action)','','b','','','',false],
      ['(1)V-Tach 2D(action)','','','c','','',false],
      ['(1)V-Tach 2D(action)','','','','d','',false],
      ['(1)V-Tach 2D(action)','','','','','e',false],
    ])('when the action phrase is \'%s\' Then isStageBoundary is: \'%s\'', (actionString, subActionTime, subAction, score, oldValue, newValue, expected) => {
      const actual = new ActionsCsvRow({
        'Action/Vital Name': actionString,
        'New Value': newValue,
        'Old Value': oldValue,
        'Speech Command': 'speech command',
        'SubAction Time[Min:Sec]': subActionTime,
        'Time Stamp[Hr:Min:Sec]': '03:03:08',
        Score: score,
        Username: 'umich1',
        'SubAction Name': subAction
      });
      expect(actual.isStageBoundary).toBe(expected);
    });
  });

  describe('Identify the action taken so we can use that to identify phase/stage transitions, extract phase/stage name or decide to plot this point on action scatter plot', () => {
    it.each([
      ['(1)V-Tach 2D(action)', true, 'V-Tach 2D'],
      [' ( 1  )  V-Tach 2D  (  action ) ', true, 'V-Tach 2D'],
      ['(2)V-Tach 2A.1(action)', true, 'V-Tach 2A.1'],
      ['PR(vital)', false, 'Could not extract action name from acton/vital name'],
      ['XY(action)', false, 'Could not extract action name from acton/vital name'],
      ['', false, 'Could not extract action name from acton/vital name'],
    ])('isScatterPlotData: When the action phrase is \'%s\' Then isScatterPlotData is: \'%s\' And the stageName is: \'%s\'', (actionString, expectedIsAction, expectedActionName) => {
      const actual = new ActionsCsvRow({
        'Action/Vital Name': actionString,
        'SubAction Name': 'stg',
        'SubAction Time[Min:Sec]': '',
        Score: '',
        'Old Value': '',
        'New Value': '',
        'Speech Command': '',
        'Time Stamp[Hr:Min:Sec]': '',
        Username: '',
      });
      expect(actual.isAction).toBe(expectedIsAction);
      expect(actual.isScatterPlotData()).toBe(expectedIsAction);
      expect(actual.stageName).toBe(expectedActionName);
    });
  });

  describe('Identify cpr starts/end points so that on the plot we can draw a line between the start and end of cpr', () => {
    it.each([
      ['Begin CPR', true],
      ['beGin CpR', true],
      ['Begin Something', false],
      ['', false]
    ])('when the cpr related phrase is \'%s\' Then cpr starts is: \'%s\'', (subAction, expected) => {
      const actual = new ActionsCsvRow({
        'Action/Vital Name': '',
        'Speech Command': '',
        'Time Stamp[Hr:Min:Sec]': '',
        Username: '',
        'SubAction Name': subAction
      });

      expect(actual.doesCPRStart()).toBe(expected);
    });
    it.each([
      ['End CPR', true],
      ['end CpR', true],
      ['End Something', false],
      ['', false]
    ])('when the cpr related phrase is \'%s\' Then cpr ends is: \'%s\'', (subAction, expected) => {
      const actual = new ActionsCsvRow({
        'Action/Vital Name': '',
        'Speech Command': '',
        'Time Stamp[Hr:Min:Sec]': '',
        Username: '',
        'SubAction Name': subAction
      });

      expect(actual.doesCPREnd()).toBe(expected);
    });
  });

  describe('Identify the error triggers so that we can color code the actions that triggered error and plot the actions that needed to be taken but not taken', () => {
    it.each([
      ['Error-Triggered',true],
      ['erRor-triggered',true],
      ['  erRor-triggered ',true],
      ['something',false],
      ['',false]
    ])('when the old value phrase is \'%s\' Then triggeredError is: \'%s\'', (oldValue, expected) => {
      const actual = new ActionsCsvRow({
        'Action/Vital Name': 'actionString',
        'New Value': 'newValue',
        'Old Value': oldValue,
        'Speech Command': 'speech command',
        'SubAction Time[Min:Sec]': 'subActionTime',
        'Time Stamp[Hr:Min:Sec]': '03:03:08',
        Score: 'score',
        Username: 'umich1',
        'SubAction Name': 'subAction'
      });
      expect(actual.triggeredError).toBe(expected);
    });
  });
});
