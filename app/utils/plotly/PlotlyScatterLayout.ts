import {Annotations, Image, Layout, LayoutAxis, Shape} from 'plotly.js';
import {actionsDictionary} from '@/app/ui/components/constants';

export default class PlotlyScatterLayout {
  readonly #title: string;
  readonly #shapes: Partial<Shape>[];
  readonly #annotations: Partial<Annotations>[];
  readonly #xAxisRange: [string | number, string | number];
  readonly #images: Partial<Image>[];
  #yaxis: Partial<LayoutAxis>;
  #showLegend: boolean;

  constructor(
    title: string,
    shapes: Partial<Shape>[],
    annotations: Partial<Annotations>[],
    xAxisRange: [string | number, string | number],
    images: Partial<Image>[]
  ) {
    this.#title = title;
    this.#shapes = shapes;
    this.#annotations = annotations;
    this.#xAxisRange = xAxisRange;
    this.#images = images;
    this.#yaxis = {visible: false, range: [-4.25, actionsDictionary.yMax + 2]};
    this.#showLegend = false;
  }

  set yaxis(value: Partial<LayoutAxis>) {
    this.#yaxis = value;
  }

  set showLegend(value: boolean) {
    this.#showLegend = value;
  }

  toPlotlyFormat(): Partial<Layout> {
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
