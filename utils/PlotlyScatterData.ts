import {HoverLabel, PlotData} from 'plotly.js';

export class PlotlyScatterData {
    readonly x: (string | number)[];
    readonly y: (string | number)[];
    readonly text: string[];
    readonly hovertext: string[];
    readonly customdata: string[];
    readonly colors: string[];
    readonly hoverlabel: Partial<HoverLabel>|undefined;
    readonly #plotlyImage: Partial<PlotData>;

    constructor(x: (string | number)[] = [], y: (string | number)[] = [], text: string[] = [], hovertext: string[] = [], customdata: string[] = [], colors: string[] = [], hoverlabel?: (Partial<HoverLabel>|undefined)) {
        this.x = x;
        this.y = y;
        this.text = text;
        this.hovertext = hovertext;
        this.customdata = customdata;
        this.colors = colors;
        this.hoverlabel = hoverlabel;
        this.#plotlyImage = {
            x: this.x,
            y: this.y,
            text: this.text,
            hovertext: this.hovertext,
            customdata: this.customdata,
            marker: {
                size: 18,
                symbol: 'square',
                color: this.colors
            },
            mode: 'text+markers',
            type: 'scatter',
            hoverinfo: 'text',
            textposition: 'bottom center',
            textfont: { size: 8 }
        };
    }

    toPlotlyFormat(): Partial<PlotData>{
        return this.hoverlabel?{...this.#plotlyImage, hoverlabel: this.hoverlabel}:this.#plotlyImage;
    }
}
