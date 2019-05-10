import _Vue from 'vue';

interface ThumbnailPluginOptions {
    /** 图片变换函数 */
    doTransform(images: string[], dataset: any): string[];
    /** 进入时添加的类型 */
    enterClass: string;
    /** 离开时添加的类型 */
    leaveClass: string;
}

export declare const install: (Vue: typeof _Vue, options: ThumbnailPluginOptions) => void;