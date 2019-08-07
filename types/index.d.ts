import _Vue, { PluginObject } from 'vue';

interface ThumbnailPluginOptions {
    /** 图片处理函数 */
    imageFilter: ImageFilter;
    /** 图片变换函数 */
    doTransform?: (images: string[], dataset: any, imageFilter: ImageFilter) => string[];
    /** 进入时添加的类型 */
    enterClass?: string;
    /** 离开时添加的类型 */
    leaveClass?: string;
}

interface ImageFilter {
    [name: string]: (listener: ImageFilterListener, options: ImageFilterOptions) => any,
}

interface ImageFilterListener {
    el: {
        dataset: {
            [propName: string]: any,
        },
    };
    src: string;
    ro?: {
        [propName: string]: any,
    };
}

interface ImageFilterOptions {
    supportWebp?: boolean;
}

/**
 * 用于生成imageFilter
 */
interface GenerateImageFilterOptions {
    bed?: {
        [key: string]: string,
    };
    isAliyun?: (listener: ImageFilterListener, options: ImageFilterOptions) => boolean;
    isQiniu?: (listener: ImageFilterListener, options: ImageFilterOptions) => boolean;
    isWeChat?: (listener: ImageFilterListener, options: ImageFilterOptions) => boolean;
}

export declare const install: (Vue: typeof _Vue, options: ThumbnailPluginOptions) => void;
export declare const doTransform: (images: string[], dataset: any, imageFilter: ImageFilter) => string[];
export declare const generateImageFilter: (generateOptions: GenerateImageFilterOptions) => void;