import {Image} from 'plotly.js';

export class PlotlyScatterImage {
    readonly source: string;
    readonly x: number | string;
    readonly y: number | string;

    constructor(source: string, x:  number | string, y:  number | string) {
        this.source = source;
        this.x = x;
        this.y = y;
    }
    toPlotlyFormat(): Image {
        return {
            source: this.source,
            x: this.x,
            y: this.y,
            // name: this.name,
            sizex: 17000,
            sizey: 0.7,
            xref: 'x',
            yref: 'y',
            xanchor: 'center',
            yanchor: 'middle',
            layer:  'above',
            visible: true,
            sizing: 'contain',
            opacity: 1
        };
    }
}
