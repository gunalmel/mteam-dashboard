import {PlotData} from 'plotly.js';

export class ScatterPlotlyData {
    readonly x: string[];
    readonly y: number[];
    readonly text: string[];
    readonly hovertext: string[];
    readonly customdata: string[];
    readonly colors: string[];

    constructor(x: string[] = [], y: number[] = [], text: string[] = [], hovertext: string[] = [], customdata: string[] = [], colors: string[] = []) {
        this.x = x;
        this.y = y;
        this.text = text;
        this.hovertext = hovertext;
        this.customdata = customdata;
        this.colors = colors;
    }

    toPlotlyFormat(): Partial<PlotData>{
        return {
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
        }
    }
}
