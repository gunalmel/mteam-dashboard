import {Shape} from 'plotly.js';

export class PlotlyScatterStage {
    readonly #stageName: string;
    readonly #start: string;
    readonly #end: string;
    readonly #color: string;
    readonly #y0: number;
    readonly #y1: number;

    constructor(stageName: string, x:[string, string], y:[number,number], color: string) {
        this.#stageName = stageName;
        this.#start = x[0];
        this.#end = x[1];
        this.#color = color;
        this.#y0 = y[0];
        this.#y1 = y[1];
    }

    toPlotlyFormat(): Partial<Shape>{
        return {
            x0: this.#start,
            x1: this.#end,
            fillcolor: this.#color,
            name: this.#stageName,
            y0: this.#y0,
            y1: this.#y1,
            type: 'rect',
            xref: 'x',
            yref: 'y',
            line: { width: 0 },
            layer: 'below'
        };
    }
}
