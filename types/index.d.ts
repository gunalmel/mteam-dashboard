import {Image, Layout} from "plotly.js";

//papaparse library always returns a string for each value in the csv file even if it's missing
export interface ActionsCSVDataRow {
    'Time Stamp[Hr:Min:Sec]': string,
    'Action/Vital Name': string,
    'SubAction Time[Min:Sec]'?: string,
    'SubAction Name'?: string,
    'Score'?: string,
    'Old Value'?: string,
    'New Value'?: string,
    'Username': string,
    'Speech Command': string
}

export interface ErrorAction {
    triggered: boolean;
    name: string;
    time: number;
}

export type ImageWithName = Image & {
    name: string;
};

export type LayoutWithNamedImage = Omit<Layout, 'images'> & {
    images: Array<Partial<ImageWithName>>;
};
