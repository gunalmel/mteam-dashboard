import CsvDateTimeStamp from '@/utils/CsvDateTimeStamp';

export default class ActionsCsvRow {
  ///\(\d+\)([^(]+)\(action\)/; //this is lightweight action parser not ignoring the whitespace within parentheses and between beginning and end of the phase stage name
  static readonly #actionRegex =
    /^\s*\(\s*\d+\s*\)\s*(.*?)\s*\(\s*[^)]*action\s*\)\s*$/i;
  static readonly #cprPhrases = {
    start: ['begin cpr', 'enter cpr'],
    end: ['stop cpr', 'end cpr'],
  };
  static readonly #errorRowDistanceToActionRowInSeconds = 3;
  static readonly #phaseErrorPhrase = 'error-triggered';

  readonly #actionOrVitalName: string;
  readonly #timeStamp: CsvDateTimeStamp;
  readonly #newValue?: string;
  readonly #oldValue: string;
  readonly #score?: string;
  readonly #subAction: string;
  readonly #subActionTime?: string;
  readonly #username: string;
  readonly #isAction: boolean;
  readonly #actionName: string;
  readonly #actionAnnotation: string;
  readonly #stageName: string;
  readonly #stageBoundary: boolean;
  readonly #triggeredError: boolean;
  readonly #speechCommand: string;

  constructor(row: { [key: string]: string }) {
    const {
      'Time Stamp[Hr:Min:Sec]': timeStamp,
      'Action/Vital Name': actionOrVitalName,
      'SubAction Time[Min:Sec]': subActionTime,
      'SubAction Name': subAction,
      Score: score,
      'Old Value': oldValue,
      'New Value': newValue,
      Username: username, //if the row reports the error at the end of the phase/stage this column shows phase/stage name otherwise username
      'Speech Command': speechCommand, //if the row reports the error at the end of the phase/stage this column shows error explanation otherwise speech command
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
    this.#isAction = parsedAction.isAction;
    this.#actionName = this.#isAction ? this.#subAction : '';
    this.#actionAnnotation = this.isScatterPlotData
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

  get isScatterPlotData() {
    return (
      this.#isAction &&
      (this.#subActionTime ||
        this.#subAction ||
        this.#score ||
        this.#oldValue ||
        this.#newValue)
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
    return (
      this.#isAction &&
      !(
        this.#subActionTime ||
        this.#subAction ||
        this.#score ||
        this.#oldValue ||
        this.#newValue
      )
    );
  }

  #markCPRRow(row: ActionsCsvRow, cprType: 'start' | 'end') {
    return ActionsCsvRow.#cprPhrases[cprType].some((phrase) =>
      row.#subAction?.toLowerCase().includes(phrase.toLowerCase()),
    );
  }

  #actionMatch(actionString: string) {
    const actionMatch = ActionsCsvRow.#actionRegex.exec(actionString);
    return {
      isAction: actionMatch !== null,
      name: actionMatch ? actionMatch[1] : '',
    };
  }

  #parseAction(): { isAction: boolean; name: string } {
    return this.#actionMatch(this.#actionOrVitalName);
  }

  #parseError() {
    const triggered =
      this.#oldValue.trim().toLowerCase() === ActionsCsvRow.#phaseErrorPhrase;
    const errorMatch = ActionsCsvRow.#actionRegex.exec(this.#username);
    return { triggered, stageName: errorMatch ? errorMatch[1] : '' };
  }

  canMarkError(timeStamp: CsvDateTimeStamp) {
    return (
      timeStamp &&
      timeStamp.seconds &&
      Math.abs(timeStamp.seconds - this.#timeStamp.seconds) <
        ActionsCsvRow.#errorRowDistanceToActionRowInSeconds
    );
  }
}
