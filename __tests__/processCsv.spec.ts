import Papa from 'papaparse';
import fs from 'fs';
import {processRow} from "@/utils/dataUtils";
import SequentialTimePeriods from "@/utils/SequentialTimePeriods";
import CompressionLines from "@/utils/CompressionLines";
import ErrorAction from "@/utils/ErrorAction";

describe("Should be able to parse the csv file produced by equipment to build the data needed by plotly js so that action scatter data can be plotted on a timeline", () => {
    const fileStream = fs.createReadStream('./__tests__/test-action-data.csv');
    const error: ErrorAction = new ErrorAction();
    const stageMap: SequentialTimePeriods = new SequentialTimePeriods();//{ [key: string]: { start: string, end: string } } = {};
    const timestampsInDateString: string[] = [];
    const actionColors: string[] = [];
    const yValues: number[] = [];
    const subActions: string[] = [];
    const actionAnnotations: string[] = [];
    const compressionLines = new CompressionLines();
    const phaseErrors: { [key: string]: Array<{ [key: string]: string }> } = {};

    it("Hey", (done)=>{
        let count = 0;
        Papa.parse(fileStream, {
            header: true,
            step: function (row: Papa.ParseStepResult<{ [key: string]: string }>) {
                count++;
                // processRow(row.data, error, stageMap, timestampsInDateString, actionColors, yValues, subActions, actionAnnotations, compressionLines, phaseErrors);
            },
            complete: function(results, file) {
                console.log('parsing complete read', count, 'records.');
                console.log(timestampsInDateString.length, actionColors.length, subActions.length);
                // timestampsInDateString.forEach((v, i) => {
                //     console.log(subActions[i], v, actionColors[i]);
                // });
                done();
            }
        });
    }, 50000)
});
