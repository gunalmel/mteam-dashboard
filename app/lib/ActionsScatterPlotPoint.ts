import ActionsCsvRow from '@/app/lib/csv/ActionsCsvRow';
import {getIcon, actionsDictionary} from '@/app/ui/components/constants';
import CsvDateTimeStamp from '@/app/lib/csv/CsvDateTimeStamp';
import {PlotlyScatterImage} from '@/app/utils/plotly/PlotlyScatterImage';
import {ActionImage, ImageWithName} from '@/types';

export default class ActionsScatterPlotPoint {
    static readonly ERROR_MARKER_COLOR = 'red';
    static readonly CORRECT_MARKER_COLOR = 'green';

    readonly x: CsvDateTimeStamp;
    readonly y: number;
    readonly name: string;
    readonly hovertext: string;
    readonly icon: ActionImage;
    readonly plotlyImage: ImageWithName;
    /**
     * will be displayed somewhere around the data on the plot
     */
    readonly dataText: string;
    color: string = ActionsScatterPlotPoint.CORRECT_MARKER_COLOR;

    constructor(parsedCsvRow: ActionsCsvRow){
        this.x = parsedCsvRow.timeStamp;
        this.y = actionsDictionary.get(parsedCsvRow.actionName).y;
        this.name = parsedCsvRow.actionName;
        this.hovertext = parsedCsvRow.actionAnnotation;
        this.dataText = this.#extractImageText(this.name);
        this.icon = getIcon(this.name);
        this.plotlyImage = this.#createImage();
    }

    markError() {
        this.color=ActionsScatterPlotPoint.ERROR_MARKER_COLOR;
    }

    markCorrect() {
        this.color=ActionsScatterPlotPoint.CORRECT_MARKER_COLOR;
    }

    #extractImageText(name:string) {
        const shockMatch = /\b\d+J\b/.exec(name);
        return shockMatch ? shockMatch[0] : '';
    }

    #createImage(){
        return new PlotlyScatterImage(this.icon.url, this.x.dateTimeString, this.y, this.icon.name).toPlotlyFormat();
    }
}
