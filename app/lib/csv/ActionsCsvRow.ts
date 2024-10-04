import CsvDateTimeStamp from '@/app/lib/csv/CsvDateTimeStamp';
import { areAllNullOrEmpty, isAnyNotNullOrEmpty } from '@/app/utils/validation';
import { STAGE_NAME_MAP } from '@/app/ui/components/constants';

export default class ActionsCsvRow {
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
  readonly #errorExplanation: string;
  readonly #speechCommand: string;

  constructor(row: Record<string, string>) {
    this.#timeStamp = new CsvDateTimeStamp(row['Time Stamp[Hr:Min:Sec]']);
    this.#actionOrVitalName = row['Action/Vital Name'];
    this.#subActionTime = row['SubAction Time[Min:Sec]'];
    this.#subAction = row['SubAction Name'];
    this.#score = row['Score'];
    this.#oldValue = row['Old Value'] ?? '';
    this.#newValue = row['New Value'];
    this.#username = row['Username'];
    this.#speechCommand = row['Speech Command'];

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
    this.#errorExplanation = parsedError.triggered
      ? this.#speechCommand
      : '';
    this.#stageBoundary = this.#isTransitionBoundary();
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

  get timeStamp() {
    return this.#timeStamp;
  }

  get stageName() {
    return this.#stageName;
  }

  get errorExplanation() {
    return this.#errorExplanation;
  }

  isScatterPlotData() {
    return (
      this.isAction &&
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
    return this.#markCPRRow('start');
  }

  doesCPREnd() {
    return this.#markCPRRow('end');
  }

  canMarkError(timeStamp: CsvDateTimeStamp) {
    return (
      timeStamp?.seconds &&
      Math.abs(timeStamp.seconds - this.#timeStamp.seconds) <
      ActionsCsvRow.#ERROR_ROW_DISTANCE_TO_ACTION_ROW_IN_SECONDS
    );
  }

  #isTransitionBoundary() {
    return this.isAction && areAllNullOrEmpty(this.#subActionTime, this.#subAction, this.#score, this.#oldValue, this.#newValue);
  }

  #markCPRRow(cprType: 'start' | 'end') {
    return ActionsCsvRow.#CPR_PHRASES[cprType].some((phrase) =>
      this.#subAction?.toLowerCase().includes(phrase.toLowerCase())
    );
  }

  #actionMatch(actionString: string) {
    const actionMatch = ActionsCsvRow.#ACTION_REGEX.exec(actionString);
    return {
      isAction: actionMatch !== null,
      name: actionMatch ? STAGE_NAME_MAP[actionMatch[1].trim()] : 'Error:ActionsCsvRow.ts can not found'
    };
  }

  #parseAction() {
    return this.#actionMatch(this.#actionOrVitalName);
  }

  #parseError() {
    const triggered = this.#oldValue.trim().toLowerCase() === ActionsCsvRow.#STAGE_ERROR_PHRASE;
    const errorMatch = ActionsCsvRow.#ACTION_REGEX.exec(this.#username);
    return { triggered, stageName: errorMatch ? STAGE_NAME_MAP[errorMatch[1]] : '' };
  }
}
