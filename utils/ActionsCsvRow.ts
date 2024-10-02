import CsvDateTimeStamp from '@/utils/CsvDateTimeStamp';

export default class ActionsCsvRow {
    ///\(\d+\)([^(]+)\(action\)/; //this is lightweight action parser not ignoring the whitespace within parentheses and between beginning and end of the phase stage name
    static readonly #actionRegex = /^\s*\(\s*\d+\s*\)\s*(.*?)\s*\(\s*[^)]*action\s*\)\s*$/i;
    static readonly #cprPhrases ={
        start: ['begin cpr', 'enter cpr'],
        end: ['stop cpr', 'end cpr']
    }
    static readonly #errorRowDistanceToActionRowInSeconds = 3;
    static readonly #phaseErrorPhrase = 'error-triggered';

    readonly #actionOrVitalName: string;
    readonly #timeStamp: CsvDateTimeStamp;
    readonly #newValue?: string;
    readonly #oldValue: string;
    readonly #score?: string;
    readonly #errorExplanation: string;
    readonly #subAction: string;
    readonly #subActionTime?: string;
    readonly #username: string;
    readonly #isAction: boolean;
    readonly #stageName: string;
    readonly #stageBoundary: boolean;
    readonly #triggeredError: boolean;
    constructor(row: {[key:string]:string}) {
        const {
            'Time Stamp[Hr:Min:Sec]': timeStamp,
            'Action/Vital Name': actionOrVitalName,
            'SubAction Time[Min:Sec]': subActionTime,
            'SubAction Name': subAction,
            'Score': score,
            'Old Value': oldValue,
            'New Value': newValue,
            'Username': username, //if the row reports the error at the end of the phase/stage this column shows phase/stage name otherwise username
            'Speech Command': speechCommand //if the row reports the error at the end of the phase/stage this column shows error explanation otherwise speech command
        } = row;

        this.#timeStamp = new CsvDateTimeStamp(timeStamp);
        this.#actionOrVitalName = actionOrVitalName;
        this.#subActionTime = subActionTime;
        this.#subAction = subAction;
        this.#score = score;
        this.#oldValue = oldValue??'';
        this.#newValue = newValue;
        this.#username = username;
        const parsedAction = this.#parseAction();
        const parsedError = this.#parseError();
        this.#triggeredError = parsedError.triggered;
        this.#isAction = parsedAction.isAction;
        this.#stageName = parsedError.triggered?parsedError.stageName:parsedAction.name;
        this.#stageBoundary = this.#isTransitionBoundary();
        this.#errorExplanation = parsedError.triggered?speechCommand:'';
    }

    #parseAction(): {isAction: boolean, name: string} {
        const actionMatch = ActionsCsvRow.#actionRegex.exec(this.#actionOrVitalName);
        return {
            isAction: actionMatch !== null,
            name: actionMatch ? actionMatch[1] : ''
        };
    }

    /**
     * If the row specifies stage/phase boundary then this is the stage/phase name
     */
    get actionOrVitalName() {
        return this.#actionOrVitalName;
    }
    get subAction(){
        return this.#subAction;
    }
    get timeStamp() {
        return this.#timeStamp;
    }
    get stageName() {
        return this.#stageName;
    }
    get errorExplanation(){
        return this.#errorExplanation;
    }
    get isScatterPlotData() {
        return this.#isAction&&(this.#subActionTime||this.#subAction||this.#score||this.#oldValue||this.#newValue);
    }
    get isStageBoundary() {
        return this.#stageBoundary;
    }
    get triggeredError() {
        return this.#triggeredError
    }

    isAt(timeStamp: CsvDateTimeStamp) {
        return this.#timeStamp.seconds===timeStamp.seconds;
    }

    doesCPRStart() {
        return this.#markCPRRow(this, 'start');
    }

    doesCPREnd() {
        return this.#markCPRRow(this, 'end');
    }

    #isTransitionBoundary() {
        return this.#isAction && !(this.#subActionTime||this.#subAction||this.#score||this.#oldValue||this.#newValue);
    }

    #markCPRRow(row: ActionsCsvRow, cprType: 'start' | 'end') {
        return ActionsCsvRow.#cprPhrases[cprType].some((phrase) =>
            row.#subAction?.toLowerCase().includes(phrase.toLowerCase()),
        );
    }

    #parseError() {
        const errorStatus = {triggered: this.#oldValue.trim().toLowerCase()===ActionsCsvRow.#phaseErrorPhrase, stageName:''};
        if(errorStatus.triggered){
            const match = ActionsCsvRow.#actionRegex.exec(this.#username);
            errorStatus.stageName = match ? match[1] : ''
        }
        return errorStatus;
    }

    canMarkError(timeStamp: CsvDateTimeStamp) {
        return Math.abs((timeStamp?.seconds??0) - this.#timeStamp.seconds)<ActionsCsvRow.#errorRowDistanceToActionRowInSeconds;
    }
}


