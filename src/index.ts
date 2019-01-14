import _Vue, { VNodeDirective } from 'vue';
import { loadImage } from './utils';
import { ThumbnailPluginOptions } from '../types';

let installed: boolean = false;
let options: ThumbnailPluginOptions | null = null;

function install(Vue: typeof _Vue, _options: ThumbnailPluginOptions) {
    if (installed || !_options) {
        return;
    }
    installed = true;
    options = _options

    Vue.directive('thumbnail', {
        bind: fn,
        update: fn,
    });
}

function setSrc(el: HTMLElement, src: string, bindType?: string) {
    if (bindType) {
        // @ts-ignore
        el.style[bindType] = `url(${src})`;
    } else {
        el.setAttribute('src', src);
    }
}

function fn(el: HTMLElement, binding: VNodeDirective) {
    if (binding.value === binding.oldValue) {
        return;
    }
    const dataset = el.dataset;
    /** 原始链接 */
    const originSrc = binding.value;
    const bindType = binding.arg;
    const thumbnailWidth = dataset.thumbnailWidth;

    if (!thumbnailWidth || isNaN(Number(thumbnailWidth))) {
        const [ src ] = options!.doTransform([ originSrc ], dataset);
        setSrc(el, src, bindType);
    } else {
        el.classList.add('image-blur1');
        const [ thumbnailSrc ] = options!.doTransform([ originSrc ], {
            ...dataset,
            width: thumbnailWidth,
        });
        setSrc(el, thumbnailSrc, bindType);

        // 缩略图已经加载完成
        loadImage(thumbnailSrc).then(() => {
            const [ src ] = options!.doTransform([ originSrc ], dataset);

            loadImage(src).then(() => {
                setSrc(el, src, bindType);
                el.classList.add('image-blur2');

                function removeClass() {
                    // tip: 少部分设备不支持multiple parameters，所以这里分开remove，基本保证最大兼容性
                    el.classList.remove('image-blur1');
                    el.classList.remove('image-blur2');
                }

                // 为了保证只在这个el上添加一次transitionend
                el.ontransitionend = removeClass;
            });
        });
    }
}

export default {
    install,
}
