import {Data, PlotType} from 'plotly.js';

export class PlotlyCurrentTimeMarker {
  readonly #type:PlotType ;
  readonly #mode:'number' | 'lines' | 'text' | 'delta' | 'gauge' | 'markers' | 'lines+markers' | 'text+markers' | 'text+lines' | 'text+lines+markers' | 'none' | 'number+delta' | 'gauge+number' | 'gauge+number+delta' | 'gauge+delta';
  readonly #x:string[];// = [currentTimeFormatted, currentTimeFormatted];
  readonly #y:number[];// Adjust y range as needed - must be equal or greater than y1 value in createTransition boundary
  readonly #line:{color:string, width:number};
  readonly #name:string;

  constructor(x: string[], y: number[], color = 'red', width = 2) {
    this.#type = 'scatter';
    this.#mode = 'lines';
    this.#line = {color, width};
    this.#x = x;
    this.#y = y;
    this.#name = 'Video Tracer';
  }

  toPlotlyFormat(): Data{
    return {
      type: this.#type,
      mode: this.#mode,
      x: this.#x,
      y: this.#y,
      line: this.#line,
      name: this.#name,
      showlegend: false
    };
  }
}
