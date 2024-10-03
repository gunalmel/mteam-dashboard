import ActionStages from '@/utils/ActionStages';
import CsvDateTimeStamp from '@/utils/CsvDateTimeStamp';
import {parseTime} from '@/utils/timeUtils';
import CsvTimeInterval from '@/utils/CsvTimeInterval';

describe('Should be able to build an actions stage transition map that will store start and end of each transition as we add each transition while processing csv file row by row', () => {
    const expectedDefaultTimeString = CsvDateTimeStamp.defaultTime.dateTimeString;

    describe('add', () => {
        it('First Time Update: Given no period exists When updates Then the start and end time should be set to the default regardless of the time parameter', () => {
            const actual = new ActionStages();
            const timeStr = '0:3:0';

            actual.update('stage1', new CsvDateTimeStamp(timeStr));

            expect(actual.getDateTimeString('stage1')).toEqual({
                start: expectedDefaultTimeString,
                end: parseTime(timeStr).dateTimeString,
            });
        });

        it('Updates the first period: Given only one period exists When updates Then the end date will be set to the time parameter, start date will stay unchanged', () => {
            const actual = new ActionStages();
            let timeStr = '0:3:0';

            actual.update('stage1');
            actual.update('stage1', new CsvDateTimeStamp(timeStr));

            expect(actual.getDateTimeString('stage1')).toEqual({
                start: expectedDefaultTimeString,
                end: parseTime(timeStr).dateTimeString,
            });

            timeStr = '0:4:0'
            actual.update('stage1', new CsvDateTimeStamp(timeStr));

            expect(actual.getDateTimeString('stage1')).toEqual({
                start: expectedDefaultTimeString,
                end: parseTime(timeStr).dateTimeString,
            });

            timeStr = '0:5:0'
            actual.update('stage1', new CsvDateTimeStamp(timeStr));

            expect(actual.getDateTimeString('stage1')).toEqual({
                start: expectedDefaultTimeString,
                end: parseTime(timeStr).dateTimeString,
            });
        });

        it('Adds New: Given only the first period added When I enter new transition Then a new transition should be added to the map And the start period should be set to the date And the first periods end date should be set to the date', () => {
            const actual = new ActionStages();
            let timeStr = '0:3:0';

            actual.update('stage1');
            actual.update('stage2', new CsvDateTimeStamp(timeStr));

            expect(actual.getDateTimeString('stage1')).toEqual({
                start: expectedDefaultTimeString,
                end: expectedDefaultTimeString,
            });

            expect(actual.getDateTimeString('stage2')).toEqual({
                start: expectedDefaultTimeString,
                end: parseTime(timeStr).dateTimeString,
            });
        });
    });

    describe('get', () => {
        const actual = new ActionStages();

        it('When asked for nonexistent transition name Then should return default value', () => {
            expect(actual.getDateTimeString('non-existent')).toEqual({
                start: new CsvDateTimeStamp().dateTimeString,
                end: new CsvDateTimeStamp().dateTimeString
            });
        });

        it('When asked for an existing transition name Then the period should be returned', () => {
            actual.update('stage0');
            actual.update('stage1', new CsvDateTimeStamp('3:0:00'));
            actual.update('stage1',new CsvDateTimeStamp('04:01:1'));

            expect(actual.getDateTimeString('stage1')).toEqual({
                start: expectedDefaultTimeString,
                end: parseTime('4:1:1').dateTimeString,
            });
        });
    });

    describe('get', () => {

        it('When asked for a period by name Then the period mapped to that name should be returned.',()=>{
            const actual = new ActionStages();
            actual.update('stage1');
            actual.update('stage2', new CsvDateTimeStamp('3:1:1'));
            actual.update('stage3', new CsvDateTimeStamp('3:1:02'));
            actual.update('stage4', new CsvDateTimeStamp('3:01:3'));

            expect(actual.get('stage1').end.timeStampString).toEqual('00:00:00');
            expect(actual.get('stage2').end.timeStampString).toEqual('03:01:01');
            expect(actual.get('stage3').end.timeStampString).toEqual('03:01:02');
            expect(actual.get('stage4').end.timeStampString).toEqual('03:01:03');
        })
    });

    describe('getMap', () => {
        const actual = new ActionStages();

        it('Given no periods When asked for all Then should return empty map', () => {
            expect(actual.getMap()).toEqual(new Map());
        });

        it('Given there are periods When asked for all Then a map of period names to periods should be returned', () => {
            const defaultTime = new CsvDateTimeStamp()
            const time1 = new CsvDateTimeStamp('3:1:1');
            const time2 = new CsvDateTimeStamp('3:1:02');
            const time3 = new CsvDateTimeStamp('3:01:3');

            const expected= new Map(
                [['stage1', new CsvTimeInterval(defaultTime, defaultTime)],
                    ['stage2',new CsvTimeInterval(defaultTime, time2)],
                    ['stage3',new CsvTimeInterval(time2, time3)]]);

            actual.update('stage1');
            actual.update('stage2', time1);
            actual.update('stage2', time2);
            actual.update('stage3', time3);

            expect(actual.getMap()).toEqual(expected);
        });
    });
});
