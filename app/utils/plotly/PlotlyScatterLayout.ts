import {Annotations, Shape} from 'plotly.js';
import {LayoutWithNamedImage} from '@/types';
import {yValues} from '@/app/ui/components/constants';

export default class PlotlyScatterLayout {
    readonly #shapes: Partial<Shape>[];
    readonly #annotations: Partial<Annotations>[];
    readonly #xAxisRange: [(string|number),(string|number)];

    constructor(shapes: Partial<Shape>[], annotations: Partial<Annotations>[], xAxisRange: [(string|number),(string|number)]) {
        this.#shapes = shapes;
        this.#annotations = annotations;
        this.#xAxisRange = xAxisRange;
    }

    toPlotlyFormat(): Partial<LayoutWithNamedImage> {
        // Find the maximum yValue from the yValues object
        const maxYValue = Math.max(...Object.values(yValues));

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
            yaxis: { visible: false, range: [-3, maxYValue + 2] },
            showlegend: false,
            autosize: true,
            modebar: {
                orientation: 'v',
            },
        };
    }
}
