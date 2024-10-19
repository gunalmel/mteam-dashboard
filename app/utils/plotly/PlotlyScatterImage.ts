import {ImageWithName} from '@/types';

export class PlotlyScatterImage {
    readonly source: string;
    readonly x: number | string;
    readonly y: number | string;
    readonly name: string;

    constructor(source: string, x:  number | string, y:  number | string, name: string) {
        this.source = source;
        this.x = x;
        this.y = y;
        this.name = name;
    }
    toPlotlyFormat(): ImageWithName {
        return {
            source: this.source,
            x: this.x,
            y: this.y,
            name: this.name,
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
