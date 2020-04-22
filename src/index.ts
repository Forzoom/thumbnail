import _Vue, { VNodeDirective } from 'vue';
import {
    loadImage,
    isUndef,
    isSupportWebp,
} from './utils';
import {
    ThumbnailPluginOptions,
    ImageFilterListener,
    GenerateImageFilterOptions,
    ImageFilter,
} from '../types';
import url from 'url';

let installed: boolean = false;
let options: ThumbnailPluginOptions | null = null;

function install(Vue: typeof _Vue, _options: ThumbnailPluginOptions) {
    if (installed || !_options) {
        return;
    }
    installed = true;
    options = _options

    Vue.directive('thumbnail', {
        bind: genFn(false),
        update: genFn(true),
    });
}

function setSrc(el: HTMLElement, src: string, bindType?: string) {
    if (bindType) {
        if (bindType === 'poster') {
            el.setAttribute('poster', src);
        } else {
            // @ts-ignore
            el.style[bindType] = `url(${src})`;
        }
    } else {
        el.setAttribute('src', src);
    }
}

function genFn(cache: boolean) {
    return function fn(el: HTMLElement, binding: VNodeDirective) {
        // 当cache时需要检查 value 和 oldValue
        if (!options || (cache && binding.value === binding.oldValue)) {
            return;
        }
        const dataset = el.dataset;
        /** 原始链接 */
        const originSrc = binding.value;
        const bindType = binding.arg;
        const thumbnailWidth = dataset.thumbnailWidth;
        const dt = options!.doTransform || doTransform;
    
        if (!thumbnailWidth || isNaN(Number(thumbnailWidth))) {
            const result = dt([ originSrc ], dataset, options.imageFilter);
            setSrc(el, result[0], bindType);
        } else {
            el.classList.add(options!.enterClass || '');
            const result = dt([ originSrc ], {
                ...dataset,
                width: thumbnailWidth,
            }, options.imageFilter);
            const thumbnailSrc = result[0];
            setSrc(el, thumbnailSrc, bindType);
    
            // 缩略图已经加载完成
            loadImage(thumbnailSrc).then(() => {
                const [ src ] = dt([ originSrc ], dataset, options!.imageFilter);
    
                loadImage(src).then(() => {
                    setSrc(el, src, bindType);
                    el.classList.add(options!.leaveClass || '');
    
                    function removeClass() {
                        // tip: 少部分设备不支持multiple parameters，所以这里分开remove，基本保证最大兼容性
                        el.classList.remove(options!.enterClass || '');
                        el.classList.remove(options!.leaveClass || '');
                    }
    
                    // 为了保证只在这个el上添加一次transitionend
                    el.ontransitionend = removeClass;
                });
            });
        }
    }
}

/** 执行转换 */
function doTransform(images: string[], dataset: any = {}, imageFilter: ImageFilter): string[] {
    const result: string[] = [];
    const filterKeys = Object.keys(imageFilter);
    for (const image of images) {
        const listener: ImageFilterListener = {
            el: {
                dataset,
            },
            src: image,
        };
        filterKeys.forEach((key) => {
            const fn = imageFilter[key];
            fn(listener, {
                supportWebp: isSupportWebp,
            });
        });
        result.push(listener.src);
    }
    return result;
}

function generateImageFilter(generateOptions: GenerateImageFilterOptions) {
    const imageFilter: ImageFilter = {
        /**
         * 添加存储数据所使用的对象
         */
        addData(listener, options) {
            if (!listener.ro) {
                listener.ro = {};
            }
            const dataset = listener.el.dataset;
            if (dataset.avatar === 'true' || dataset.avatar) {
                listener.ro.avatar = true;
            }
        },
        /**
         * 添加domain
         */
        domain(listener, options) {
            const src = listener.src;
            if (!src || !generateOptions.bed) {
                return;
            }
            if (src.indexOf('https://') === 0 || src.indexOf('http://') === 0 || src.indexOf('//') === 0) {
                return;
            }
            if (src[0] !== '/') {
                return;
            }
            const dataset = listener.el.dataset;
            const bedName = dataset.bed;
            const domain = generateOptions.bed[bedName] || generateOptions.bed.default;
            if (domain) {
                listener.src = domain + src;
            }
        },
        /**
         * 优先处理webp，但是如何判断是否是一个png呢?
         */
        webp(listener, options) {
            if (!options.supportWebp) {
                return;
            }
            const dataset = listener.el.dataset;
            if (dataset.webp === false || dataset.webp === 'false') {
                return;
            }
            listener.ro!.webp = true;
        },
        /**
         * 渐进显示
         */
        interlace(listener, options) {
            const dataset = listener.el.dataset;
            if (isUndef(dataset.interlace)) {
                return;
            }
            listener.ro!.interlace = dataset.interlace;
        },
        /**
         * 图片缩放，暂时只识别width
         */
        size(listener, options) {
            const dataset = listener.el.dataset;
            if (isUndef(dataset.width)) {
                return;
            }
            listener.ro!.width = dataset.width;
        },
        /**
         * 添加七牛处理
         */
        qiniu(listener, options) {
            if (generateOptions.isQiniu && generateOptions.isQiniu(listener, options)) {
                const data = listener.ro!;
                const keys = Object.keys(data);
                if (keys.length === 0) {
                    return;
                }
                // 处理
                let qs = '?imageView2/2';
                let append = false;
                if (data.width) {
                    qs += `/w/${data.width}`;
                    append = true;
                }
                if (data.webp) {
                    qs += '/format/webp';
                    append = true;
                }
                if (append) {
                    listener.src += qs;
                }
            }
        },
        /**
         * 阿里云
         */
        aliyun(listener, options) {
            if (generateOptions.isAliyun && generateOptions.isAliyun(listener, options)) {
                const data = listener.ro!;
                const keys = Object.keys(data);
                if (keys.length === 0) {
                    return;
                }
                // 处理
                let qs = 'image';
                let append = false;
                if (data.width) {
                    qs += `/resize,w_${data.width}`;
                    append = true;
                }
                if (data.webp) {
                    qs += '/format,webp';
                    append = true;
                }
                if (data.interlace) {
                    qs += '/interlace,1';
                    append = true;
                }
                if (append) {
                    const result = url.parse(listener.src, true);
                    delete result.search;
                    if (result.query) {
                        result.query['x-oss-process'] = qs;
                    } else {
                        result.query = {
                            'x-oss-process': qs,
                        };
                    }
                    listener.src = url.format(result);
                }
            }
        },
        /**
         * 处理微信头像图片
         */
        wx(listener, options) {
            if (generateOptions.isWeChat && generateOptions.isWeChat(listener, options)) {
                const data = listener.ro!;
                const keys = Object.keys(data);
                if (keys.length === 0) {
                    return;
                }
                const optionalKeys = [
                    46,
                    64,
                    96,
                    132,
                    640,
                ];
                if (data.width) {
                    let targetWidth = 640;
                    // 尝试选择靠近这个width的option
                    for (let i = 0, len = optionalKeys.length; i < len; i++) {
                        if (optionalKeys[i] > data.width) {
                            targetWidth = optionalKeys[i];
                            break;
                        }
                    }
                    if (targetWidth === 640) {
                        targetWidth = 0;
                    }
                    const pos = listener.src.lastIndexOf('/');
                    listener.src = listener.src.substr(0, pos) + '/' + targetWidth;
                }
            }
        },
        /**
         * 没有图片的时候
         */
        none(listener, options) {
            if (isUndef(listener.src) || listener.src === '') {
                const data = listener.ro!;
                const keys = Object.keys(data);
                if (keys.length === 0) {
                    return;
                }
                // 使用默认头像
                if (data.avatar && generateOptions.defaultImageUrl) {
                    listener.src = generateOptions.defaultImageUrl;
                }
            }
        },
    };

    return imageFilter;
}

export default {
    install,
    doTransform,
    generateImageFilter,
}
