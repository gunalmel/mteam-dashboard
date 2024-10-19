import {Annotations, Shape} from 'plotly.js';
import {ImageWithName, LayoutWithNamedImage} from '@/types';
import {actionsDictionary} from '@/app/ui/components/constants';

export default class PlotlyScatterLayout {
    readonly #shapes: Partial<Shape>[];
    readonly #annotations: Partial<Annotations>[];
    readonly #xAxisRange: [(string|number),(string|number)];
    readonly #images: Partial<ImageWithName>[];

    constructor(shapes: Partial<Shape>[], annotations: Partial<Annotations>[], xAxisRange: [(string|number),(string|number)], images: Partial<ImageWithName>[]) {
        this.#shapes = shapes;
        this.#annotations = annotations;
        this.#xAxisRange = xAxisRange;
        this.#images = images;
    }

    toPlotlyFormat(): LayoutWithNamedImage {
        return {
            title: {text: 'Clinical Review Timeline', y:0.98},
            margin: {
              t: 0, // Adjust this value to control the top margin
              l: 50, // Left margin
              r: 50, // Right margin
              b: 50, // Bottom margin
           },
            shapes: this.#shapes,
            annotations: this.#annotations,
            xaxis: {
                range: this.#xAxisRange,
                title: 'Time (seconds)',
                showgrid: false,
                tickformat: '%H:%M:%S',
            },
            yaxis: { visible: false, range: [-3, actionsDictionary.yMax + 2] },
            showlegend: false,
            autosize: true,
            modebar: {
                orientation: 'v',
            },
          images: this.#images
        };
    }
}
