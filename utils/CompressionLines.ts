import { Datum, ScatterData } from 'plotly.js';

export default class CompressionLines {
  plotData: Array<CompressionLine>;
  constructor(lines: Array<CompressionLine> = []) {
    this.plotData = lines;
  }
  addStart(x: Datum, hovertext: string) {
    this.plotData.push(new CompressionLine(x, hovertext));
  }
  updateEnd(x: Datum, hovertext: string) {
    this.plotData[this.plotData.length - 1].add(x, hovertext);
  }
}

export class CompressionLine implements Partial<ScatterData> {
  x: Array<Datum>;
  y: Array<Datum>;
  readonly hovertext: string[];
  readonly text: string = '';
  readonly mode = 'lines';
  readonly type = 'scatter';
  readonly hoverinfo = 'text';
  readonly textposition = 'top center';
  readonly textfont: { size: number } = { size: 16 };
  readonly line: { color: string } = {
    color: 'rgb(0, 150, 0)',
  };
  constructor(x: Datum | Array<Datum> = [], hovertext: string | string[] = []) {
    this.x = Array.isArray(x)?x:[x];
    this.y = [0.5, 0.5];
    this.hovertext = Array.isArray(hovertext)?hovertext:[hovertext];
  }
  add(x: Datum, hovertext: string) {
    this.x.push(x);
    this.hovertext.push(hovertext);
  }
}