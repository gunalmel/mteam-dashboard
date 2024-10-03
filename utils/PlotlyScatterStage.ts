import {Shape} from 'plotly.js';

export class PlotlyScatterStage {
    static readonly #Y_VALS = {
        error: {y0: -1, y1: -4},
        stage: {y0: 0, y1: 12}
    };
    readonly #stageName: string;
    readonly #start: string;
    readonly #end: string;
    readonly #color: string;
    readonly #y0: number;
    readonly #y1: number;

    constructor(stageName: string, start: string, end: string, color: string, type: 'error' | 'stage' = 'stage') {
        this.#stageName = stageName;
        this.#start = start;
        this.#end = end;
        this.#color = color;
        this.#y0 = PlotlyScatterStage.#Y_VALS[type].y0;
        this.#y1 = PlotlyScatterStage.#Y_VALS[type].y1;
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
        }
    }
}
