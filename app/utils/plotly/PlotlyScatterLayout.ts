import {Annotations, LayoutAxis, Shape} from 'plotly.js';
import {ImageWithName, LayoutWithNamedImage} from '@/types';
import {actionsDictionary} from '@/app/ui/components/constants';

export default class PlotlyScatterLayout {
  readonly #title: string;
  readonly #shapes: Partial<Shape>[];
  readonly #annotations: Partial<Annotations>[];
  readonly #xAxisRange: [string | number, string | number];
  readonly #images: Partial<ImageWithName>[];
  #yaxis: Partial<LayoutAxis>;
  #showLegend: boolean;

  constructor(
    title: string,
    shapes: Partial<Shape>[],
    annotations: Partial<Annotations>[],
    xAxisRange: [string | number, string | number],
    images: Partial<ImageWithName>[]
  ) {
    this.#title = title;
    this.#shapes = shapes;
    this.#annotations = annotations;
    this.#xAxisRange = xAxisRange;
    this.#images = images;
    this.#yaxis = {visible: false, range: [-3, actionsDictionary.yMax + 2]};
    this.#showLegend = false;
  }

  set yaxis(value: Partial<LayoutAxis>) {
    this.#yaxis = value;
  }

  set showLegend(value: boolean) {
    this.#showLegend = value;
  }

  toPlotlyFormat(): LayoutWithNamedImage {
    return {
      title: {text: this.#title, y: 0.98},
      margin: {
        t: 0, // Adjust this value to control the top margin
        l: 50, // Left margin
        r: 50, // Right margin
        b: 50 // Bottom margin
      },
      shapes: this.#shapes,
      annotations: this.#annotations,
      xaxis: {
        range: this.#xAxisRange,
        title: 'Time (seconds)',
        showgrid: false,
        tickformat: '%H:%M:%S'
      },
      yaxis: this.#yaxis,
      autosize: true,
      modebar: {
        orientation: 'v'
      },
      images: this.#images,
      showlegend: this.#showLegend,
      legend: {
        x: 1,
        xanchor: 'right',
        y: 1
      }
    };
  }
}
