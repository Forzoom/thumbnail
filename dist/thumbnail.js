(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = global || self, global.Thumbnail = factory());
}(this, function () { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */

    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

    function loadImage(src) {
        return new Promise(function (resolve, reject) {
            var image = new Image();
            image.onload = function () {
                resolve();
            };
            image.src = src;
        });
    }

    var installed = false;
    var options = null;
    function install(Vue, _options) {
        if (installed || !_options) {
            return;
        }
        installed = true;
        options = _options;
        Vue.directive('thumbnail', {
            bind: fn,
            update: fn,
        });
    }
    function setSrc(el, src, bindType) {
        if (bindType) {
            // @ts-ignore
            el.style[bindType] = "url(" + src + ")";
        }
        else {
            el.setAttribute('src', src);
        }
    }
    function fn(el, binding) {
        if (binding.value === binding.oldValue) {
            return;
        }
        var dataset = el.dataset;
        /** 原始链接 */
        var originSrc = binding.value;
        var bindType = binding.arg;
        var thumbnailWidth = dataset.thumbnailWidth;
        if (!thumbnailWidth || isNaN(Number(thumbnailWidth))) {
            var src = options.doTransform([originSrc], dataset)[0];
            setSrc(el, src, bindType);
        }
        else {
            el.classList.add('image-blur1');
            var thumbnailSrc = options.doTransform([originSrc], __assign({}, dataset, { width: thumbnailWidth }))[0];
            setSrc(el, thumbnailSrc, bindType);
            // 缩略图已经加载完成
            loadImage(thumbnailSrc).then(function () {
                var src = options.doTransform([originSrc], dataset)[0];
                loadImage(src).then(function () {
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
    var index = {
        install: install,
    };

    return index;

}));
