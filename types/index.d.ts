import _Vue from 'vue';

interface ThumbnailPluginOptions {
    doTransform(images: string[], dataset: any): string[];
}

export declare const install: (Vue: typeof _Vue, options: ThumbnailPluginOptions) => void;