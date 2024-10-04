import {Image, Layout} from 'plotly.js';

export type ImageWithName = Image & {
    name: string;
};

export type LayoutWithNamedImage = Omit<Layout, 'images'> & {
    images: Partial<ImageWithName>[];
};
