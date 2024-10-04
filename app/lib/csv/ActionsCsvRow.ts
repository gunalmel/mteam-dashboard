import CsvDateTimeStamp from '@/app/lib/csv/CsvDateTimeStamp';
import {areAllNullOrEmpty, isAnyNotNullOrEmpty} from '@/app/utils/validation';

export default class ActionsCsvRow {
  ///\(\d+\)([^(]+)\(action\)/; //this is lightweight action parser not ignoring the whitespace within parentheses and between beginning and end of the phase stage name
  static readonly #ACTION_REGEX = /^\s?\(\s*\d+\s*\)\s?([^()]+)\([^)]*action\s*\)\s?$/i;
  static readonly #CPR_PHRASES = {
    start: ['begin cpr', 'enter cpr'],
    end: ['stop cpr', 'end cpr']
  };
  static readonly #ERROR_ROW_DISTANCE_TO_ACTION_ROW_IN_SECONDS = 3;
  static readonly #STAGE_ERROR_PHRASE = 'error-triggered';

  readonly #actionOrVitalName: string;
  readonly #timeStamp: CsvDateTimeStamp;
  readonly #newValue?: string;
  readonly #oldValue: string;
  readonly #score?: string;
  readonly #subAction: string;
  readonly #subActionTime?: string;
  readonly #username: string;
  readonly isAction: boolean;
  readonly #actionName: string;
  readonly #actionAnnotation: string;
  readonly #stageName: string;
  readonly #stageBoundary: boolean;
  readonly #triggeredError: boolean;
  readonly #speechCommand: string;

  constructor(row: Record<string, string>) {
    const {
      'Time Stamp[Hr:Min:Sec]': timeStamp,
      'Action/Vital Name': actionOrVitalName,
      'SubAction Time[Min:Sec]': subActionTime,
      'SubAction Name': subAction,
      Score: score,
      'Old Value': oldValue,
      'New Value': newValue,
      Username: username, //if the row reports the error at the end of the phase/stage this column shows phase/stage name otherwise username
      'Speech Command': speechCommand //if the row reports the error at the end of the phase/stage this column shows error explanation otherwise speech command
    } = row;

    this.#timeStamp = new CsvDateTimeStamp(timeStamp);
    this.#actionOrVitalName = actionOrVitalName;
    this.#subActionTime = subActionTime;
    this.#subAction = subAction;
    this.#score = score;
    this.#oldValue = oldValue ?? '';
    this.#newValue = newValue;
    this.#username = username;
    this.#speechCommand = speechCommand;
    const parsedAction = this.#parseAction();
    const parsedError = this.#parseError();
    this.#triggeredError = parsedError.triggered;
    this.isAction = parsedAction.isAction;
    this.#actionName = this.isAction ? this.#subAction : 'Not an Action';
    this.#actionAnnotation = this.isScatterPlotData()
      ? `${this.#timeStamp.timeStampString}, ${this.#actionName}`
      : '';
    this.#stageName = parsedError.triggered
      ? parsedError.stageName
      : parsedAction.name;
    this.#stageBoundary = this.#isTransitionBoundary();
  }

  /**
   * If the row specifies stage/phase boundary then this is the stage/phase name, if error then the error name
   */
  get actionOrVitalName() {
    return this.#actionOrVitalName;
  }

  get actionName() {
    return this.#actionName;
  }

  get actionAnnotation() {
    return this.#actionAnnotation;
  }

  get timeStamp() {
    return this.#timeStamp;
  }

  get stageName() {
    return this.#stageName;
  }

  get speechCommand() {
    return this.#speechCommand;
  }

  isScatterPlotData() {
    return (
      this.isAction &&
      isAnyNotNullOrEmpty(this.#subActionTime, this.#subAction, this.#score,
        this.#oldValue, this.#newValue) &&
      !this.doesCPRStart() && !this.doesCPREnd()
    );
  }

  get isStageBoundary() {
    return this.#stageBoundary;
  }

  get triggeredError() {
    return this.#triggeredError;
  }

  isAt(timeStamp: CsvDateTimeStamp) {
    return this.#timeStamp.seconds === timeStamp.seconds;
  }

  doesCPRStart() {
    return this.#markCPRRow(this, 'start');
  }

  doesCPREnd() {
    return this.#markCPRRow(this, 'end');
  }

  #isTransitionBoundary() {
    return this.isAction && areAllNullOrEmpty(this.#subActionTime,
      this.#subAction, this.#score, this.#oldValue, this.#newValue);
  }

  #markCPRRow(row: ActionsCsvRow, cprType: 'start' | 'end') {
    return ActionsCsvRow.#CPR_PHRASES[cprType].some((phrase) =>
      row.#subAction?.toLowerCase().includes(phrase.toLowerCase())
    );
  }

  #actionMatch(actionString: string) {
    const actionMatch = ActionsCsvRow.#ACTION_REGEX.exec(actionString);
    return {
      isAction: actionMatch !== null,
      name: actionMatch ? actionMatch[1].trim() : 'Could not extract action name from acton/vital name'
    };
  }

  #parseAction(): {isAction: boolean; name: string} {
    return this.#actionMatch(this.#actionOrVitalName);
  }

  #parseError() {
    const triggered =
      this.#oldValue.trim().toLowerCase() === ActionsCsvRow.#STAGE_ERROR_PHRASE;
    const errorMatch = ActionsCsvRow.#ACTION_REGEX.exec(this.#username);
    return {triggered, stageName: errorMatch ? errorMatch[1] : ''};
  }

  canMarkError(timeStamp: CsvDateTimeStamp) {
    return (
      timeStamp?.seconds &&
      Math.abs(timeStamp.seconds - this.#timeStamp.seconds) <
      ActionsCsvRow.#ERROR_ROW_DISTANCE_TO_ACTION_ROW_IN_SECONDS
    );
  }
}
