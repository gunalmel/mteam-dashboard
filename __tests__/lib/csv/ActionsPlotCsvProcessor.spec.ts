import Papa from 'papaparse';
import fs from 'fs';
import ActionsPlotCsvProcessor from '@/app/lib/csv/ActionsPlotCsvProcessor';
import {default as expectedLayout} from '../../expected-data/expected-csv-layout.json' assert { type: 'json' };
import {default as expectedStageErrors} from '../../expected-data/expected-csv-stage-errors.json';
import {default as expectedCompressionLines} from '../../expected-data/expected-csv-compression-lines.json';
import {default as expectedScatterDataImages} from '../../expected-data/expected-csv-scatter-data-images.json';
import {default as expectedScatterPlotData} from '../../expected-data/expected-csv-scatter-plot-data.json';

describe('Should be able to parse the csv file produced by equipment to build the data needed by plotly js so that action scatter data can be plotted on a timeline', () => {
  const fileStream = fs.createReadStream('./__tests__/test-action-data.csv');

  it('When process row is run on csw rows Then action scatter plot data should be created', (done) => {
    let count = 0;
    const csvProcessor = new ActionsPlotCsvProcessor();
    Papa.parse(fileStream, {
      header: true,
      step: function (row: Papa.ParseStepResult<Record<string, string>>) {
        count++;
        csvProcessor.rowProcessor(row);
      },
      complete: function () {
        try {
          expect(csvProcessor.layout()).toStrictEqual(expectedLayout);
          expect(csvProcessor.collectStageErrors()).toStrictEqual(expectedStageErrors);
          //The last 3 collections below should not be compared with strict because the classes creating the objects are compared to json expected values.
          expect(csvProcessor.collectCompressionLines()).toEqual(expectedCompressionLines);
          expect(csvProcessor.createScatterPlotData()).toEqual(expectedScatterPlotData);//37
          expect(csvProcessor.collectScatterDataImages()).toEqual(expectedScatterDataImages);
          //csvProcessor.stages 6
          //csvProcessor.stages.plotlyShapes 6 x 2 (error and plot)
          //stage errors 5,6,6,6,3,2
          expect(count).toBe(686);
          done();
        } catch (error) {
          done(error);
        }
      },
    });

  }, 50000);
});
