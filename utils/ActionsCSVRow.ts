import {ActionsCSVDataRow} from "@/types";
// import {timeStampStringToSeconds, timeStampToDateString} from "@/utils/timeUtils";

export default class ActionsCSVRow {
    ///\(\d+\)([^(]+)\(action\)/; //this is lightweight action parser not ignoring the whitespace within parentheses and between beginning and end of the phase stage name
    static readonly #actionRegex = /^\s*\(\s*\d+\s*\)\s*(.*?)\s*\(\s*[^)]*action\s*\)\s*$/i;
    static readonly #cprPhrases ={
        start: ['begin cpr', 'enter cpr'],
        end: ['stop cpr', 'end cpr']
    }
    static readonly #phaseErrorPhrase = 'error-triggered';

    readonly #actionOrVitalName: string;
    // readonly #actionTime: { string: string; seconds: number };
    readonly #newValue?: string;
    readonly #oldValue?: string;
    readonly #score?: string;
    // readonly #speechCommand: string;
    readonly #subAction?: string;
    readonly #subActionTime?: string;
    // readonly #username: string;
    readonly #isAction: boolean;
    readonly #actionName: string;
    readonly #stageBoundary: boolean;
    readonly #triggersError: boolean;
    constructor(row: ActionsCSVDataRow) {
        const {
            // 'Time Stamp[Hr:Min:Sec]': timestamp,
            'Action/Vital Name': actionOrVitalName,
            'SubAction Time[Min:Sec]': subActionTime,
            'SubAction Name': subAction,
            'Score': score,
            'Old Value': oldValue,
            'New Value': newValue,
            // 'Username': username, //if the row reports the error at the end of the phase/stage this column shows phase/stage name otherwise username
            // 'Speech Command': speechCommand //if the row reports the error at the end of the phase/stage this column shows error explanation otherwise speech command
        } = row;

        // this.#actionTime = {
        //     string: timeStampToDateString(timestamp),
        //     seconds: timeStampStringToSeconds(timestamp)
        // };
        this.#actionOrVitalName = actionOrVitalName;
        this.#subActionTime = subActionTime;
        this.#subAction = subAction;
        this.#score = score;
        this.#oldValue = oldValue;
        this.#newValue = newValue;
        // this.#username = username;
        // this.#speechCommand = speechCommand;
        const parsedAction = this.#parseAction();
        this.#isAction = parsedAction.isAction;
        this.#actionName = parsedAction.name;
        this.#stageBoundary = this.#isTransitionBoundary();
        this.#triggersError = this.#isStageError();
    }

    #parseAction(): {isAction: boolean, name: string} {
        const actionMatch = ActionsCSVRow.#actionRegex.exec(this.#actionOrVitalName);
        return {
            isAction: actionMatch !== null,
            name: actionMatch ? actionMatch[1] : ''
        };
    }

    /**
     * If the row specifies stage/phase boundary then this is the stage/phase name
     */
    // get actionOrVitalName() {
    //     return this.#actionOrVitalName;
    // }
    // get actionTime() {
    //     return this.#actionTime;
    // }
    get actionName() {
        return this.#actionName;
    }
    get isAction() {
        return this.#isAction;
    }
    get isStageBoundary() {
        return this.#stageBoundary;
    }
    get triggeredError() {
        return this.#triggersError;
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

    #markCPRRow(row: ActionsCSVRow, cprType: 'start' | 'end') {
        return ActionsCSVRow.#cprPhrases[cprType].some((phrase) =>
            row.#subAction?.toLowerCase().includes(phrase.toLowerCase()),
        );
    }

    #isStageError() {
        return this.#oldValue?.trim().toLowerCase()===ActionsCSVRow.#phaseErrorPhrase;
    }

}


