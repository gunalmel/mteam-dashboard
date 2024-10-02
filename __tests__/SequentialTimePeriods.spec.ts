import SequentialTimePeriods from "@/utils/SequentialTimePeriods";

describe.skip('Should be able to build an actions stage transition map that will store start and end of each transition as we add each transition while processing csv file row by row', () => {
    const expectedDefaultTimeString = '2017-01-01 00:00:00';

    describe('add', () => {
        it('First Time Update: Given no period exists When updates Then the start and end time should be set to the default regardless of the time parameter', () => {
            const actual = new SequentialTimePeriods();

            actual.update('stage1', '2020-12');

            expect(actual.get('stage1')).toEqual({
                start: expectedDefaultTimeString,
                end: '2020-12',
            });
        });

        it('Updates the first period: Given only one period exists When updates Then the end date will be set to the time parameter, start date will stay unchanged', () => {
            const actual = new SequentialTimePeriods();

            actual.update('stage1');
            actual.update('stage1', '2024-01');

            expect(actual.get('stage1')).toEqual({
                start: expectedDefaultTimeString,
                end: '2024-01',
            });

            actual.update('stage1', '2025-01');

            expect(actual.get('stage1')).toEqual({
                start: expectedDefaultTimeString,
                end: '2025-01',
            });

            actual.update('stage1', '2026-01');

            expect(actual.get('stage1')).toEqual({
                start: expectedDefaultTimeString,
                end: '2026-01',
            });
        });

        it('Adds New: Given only the first period added When I enter new transition Then a new transition should be added to the map And the start period should be set to the date And the first periods end date should be set to the date', () => {
            const actual = new SequentialTimePeriods();

            actual.update('stage1');
            actual.update('stage2', '2020-12');

            expect(actual.get('stage1')).toEqual({
                start: expectedDefaultTimeString,
                end: expectedDefaultTimeString,
            });

            expect(actual.get('stage2')).toEqual({
                start: expectedDefaultTimeString,
                end: '2020-12',
            });
        });
    });

    describe('get', () => {
        const actual = new SequentialTimePeriods();

        it('When asked for nonexistent transition name Then should return undefined', () => {
            expect(actual.get('non-existent')).toBeUndefined();
        });

        it('When asked for an existing transition name Then the period should be returned', () => {
            actual.update('stage0');
            actual.update('stage1', '2020-01-01');
            actual.update('stage1','2020-12-31');

            expect(actual.get('stage1')).toEqual({
                start: expectedDefaultTimeString,
                end: '2020-12-31',
            });
        });
    });

    describe('getAll', () => {
        const actual = new SequentialTimePeriods();

        it('Given no transitions When asked for all Then should return empty object', () => {
            expect(actual.getAll()).toEqual({});
        });

        it('Given there are transitions When asked for all Then an object mapping transition name to periods should be returned', () => {
            actual.update('stage1');
            actual.update('stage2', '2020-01-01');
            actual.update('stage2','2020-12-31');
            actual.update('stage3','2021-01-01');

            expect(actual.getAll()).toEqual({
                stage1: { start: expectedDefaultTimeString, end: expectedDefaultTimeString },
                stage2: { start: expectedDefaultTimeString, end: '2020-12-31' },
                stage3: { start: '2020-12-31', end: '2021-01-01' },
            });
        });
    });
});
