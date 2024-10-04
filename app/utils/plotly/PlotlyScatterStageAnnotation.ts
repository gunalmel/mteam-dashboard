import {Annotations} from 'plotly.js';

export class PlotlyScatterStageAnnotation {
    readonly #x: string;
    readonly #text: string;
    readonly #fontColor: string;

    constructor(text: string, x: string, fontColor: string) {
        this.#x = x;
        this.#text = text;
        this.#fontColor = fontColor;
    }

    toPlotlyFormat(): Partial<Annotations>{
        return {
            xref: 'x',
            yref: 'paper',
            x: this.#x,
            y: 0.9,
            xanchor: 'left',
            yanchor: 'middle',
            text: this.#text,
            showarrow: false,
            font: {
                size: 16,
                color: this.#fontColor,
                family: 'Arial, sans-serif',
                weight: 700,
            },
            bgcolor: 'rgba(255, 255, 255, 0.8)',
            bordercolor: this.#fontColor, // same as text for uniformity
            borderwidth: 1,
            borderpad: 3,
        };
    }
}
