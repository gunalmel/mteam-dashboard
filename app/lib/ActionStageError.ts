import ActionsCsvRow from '@/app/lib/csv/ActionsCsvRow';
import { ImageWithName } from '@/types';
import { PlotlyScatterImage } from '@/app/utils/plotly/PlotlyScatterImage';
import { getIcon } from '@/app/ui/components/constants';

export default class ActionStageError {
  readonly #name: string;
  readonly #explanation: string;
  readonly #annotation: string;
  readonly #icon: { unicode: string; image: string; name: string };
  readonly image: ImageWithName;

  constructor(row: ActionsCsvRow) {
    this.#name = row.actionOrVitalName;
    this.#explanation = row.triggeredError ? row.speechCommand : '';
    this.#annotation = `${this.#name}${this.#explanation ? ' - ' + this.#explanation : ''}`;
    // this.severity = row.triggeredError?row.subActionTime:''; //Warning|Error|Critical Error
    // this.actionExplanation = row.triggeredError?row.subAction:''; //Action-Should-Be-Performed|Action-Should-Not-Be-Performed
    // this.actionPerformed = row.triggeredError?row.score:''; //Action-Performed|Action-Not-Performed
    // this.status = row.oldValue;//uses oldValue = Error-Triggered | Error-Not-Triggered
    // this.user = row.newValue; // 'New Value': newValue, //umich1|NA
    this.#icon = getIcon(this.#name);
    this.image = this.#createImage();
  }

  /**
   * Creates image templates whose x/y values needed to be updated later.The positions of images will not be decided until the total n
   * umber of error images to be displayed is known
   */
  #createImage() {
    return new PlotlyScatterImage(
      this.#icon.image,
      '',
      0,
      this.#annotation,
    ).toPlotlyFormat();
  }
}
