import CsvDateTimeStamp from '@/app/lib/csv/CsvDateTimeStamp';
import { areAllNullOrEmpty, isAnyNotNullOrEmpty } from '@/app/utils/validation';

export default class ActionsCsvRow {
  static readonly #ACTION_REGEX = /^\s?\(\s*\d+\s*\)\s?([^()]+)\([^)]*action\s*\)\s?$/i;
  static readonly #CPR_PHRASES = {
    start: ['begin cpr', 'enter cpr'],
    end: ['end cpr', 'stop cpr']
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
  readonly #markedAction: boolean;
  readonly #actionName: string;
  readonly #actionAnnotation: string;
  readonly #stageName: string;
  readonly #stageBoundary: boolean;
  readonly #triggeredError: boolean;
  readonly #errorExplanation: string;
  readonly #speechCommand: string;
  readonly #stageNameMap: Record<string, string>;

  constructor(row: Record<string, string>, stageNameMap: Record<string, string>) {
    this.#timeStamp = new CsvDateTimeStamp(row['Time Stamp[Hr:Min:Sec]']);
    this.#actionOrVitalName = row['Action/Vital Name'];
    this.#subActionTime = row['SubAction Time[Min:Sec]'];
    this.#subAction = row['SubAction Name'];
    this.#score = row['Score'];
    this.#oldValue = row['Old Value'] ?? '';
    this.#newValue = row['New Value'];
    this.#username = row['Username'];
    this.#speechCommand = row['Speech Command'];
    this.#stageNameMap = stageNameMap;

    const parsedAction = this.#parseAction();
    const parsedError = this.#parseError();

    this.#triggeredError = parsedError.triggered;
    this.#markedAction = parsedAction.markedAsAction;
    this.#actionName = this.#markedAction ? this.#subAction : 'Not marked with (\\d+)\\w(action)'; //
    this.#actionAnnotation = this.isScatterPlotData()
      ? `${this.#timeStamp.timeStampString}, ${this.#actionName}`
      : '';
    this.#stageName = parsedError.triggered
      ? parsedError.stageName
      : parsedAction.name;
    this.#errorExplanation = parsedError.triggered
      ? this.#speechCommand
      : '';
    this.#stageBoundary = this.#doesStageEnd();
  }

  get timeStamp() {
    return this.#timeStamp;
  }

  get actionOrVitalName() {
    return this.#actionOrVitalName;
  }

  get actionName() {
    return this.#actionName;
  }

  get actionAnnotation() {
    return this.#actionAnnotation;
  }

  get stageName() {
    return this.#stageName;
  }

  get errorExplanation() {
    return this.#errorExplanation;
  }

  isScatterPlotData() {
    return (
      this.#markedAction &&
      isAnyNotNullOrEmpty(this.#subActionTime, this.#subAction, this.#score, this.#oldValue, this.#newValue) &&
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
    return this.#cprMatch('start');
  }

  doesCPREnd() {
    return this.#cprMatch('end');
  }

  isCloseEnough(timeStamp: CsvDateTimeStamp) {
    return (
      Math.abs(timeStamp.seconds - this.#timeStamp.seconds) <
      ActionsCsvRow.#ERROR_ROW_DISTANCE_TO_ACTION_ROW_IN_SECONDS
    );
  }

  #doesStageEnd() {
    return this.#markedAction && areAllNullOrEmpty(this.#subActionTime, this.#subAction, this.#score, this.#oldValue, this.#newValue);
  }

  #cprMatch(cprType: 'start' | 'end') {
    return ActionsCsvRow.#CPR_PHRASES[cprType].some((phrase) =>
      this.#subAction?.toLowerCase().includes(phrase.toLowerCase())
    );
  }

  #actionMatch(actionString: string) {
    return ActionsCsvRow.#ACTION_REGEX.exec(actionString);
  }

  #parseAction() {
    const actionMatch = this.#actionMatch(this.#actionOrVitalName);
    return {
      markedAsAction: actionMatch !== null,
      name: actionMatch ? this.#stageNameMap[actionMatch[1].trim()] : ''
    };
  }

  #parseError() {
    const triggered = this.#oldValue.trim().toLowerCase() === ActionsCsvRow.#STAGE_ERROR_PHRASE;
    const errorMatch = this.#actionMatch(this.#username);
    return { triggered, stageName: errorMatch ? this.#stageNameMap[errorMatch[1]] : '' };
  }
}
