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

    toPlotlyFormat(): Partial<LayoutWithNamedImage> {
        return {
            title: 'Clinical Review Timeline',
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
