(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('core-js/modules/es6.number.constructor'), require('core-js/modules/es6.promise'), require('core-js/modules/es6.object.to-string')) :
  typeof define === 'function' && define.amd ? define(['core-js/modules/es6.number.constructor', 'core-js/modules/es6.promise', 'core-js/modules/es6.object.to-string'], factory) :
  (global = global || self, global.Thumbnail = factory());
}(this, function () { 'use strict';

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function _objectSpread(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};
      var ownKeys = Object.keys(source);

      if (typeof Object.getOwnPropertySymbols === 'function') {
        ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
          return Object.getOwnPropertyDescriptor(source, sym).enumerable;
        }));
      }

      ownKeys.forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    }

    return target;
  }

  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();
  }

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  function _iterableToArrayLimit(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance");
  }

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
      update: fn
    });
  }

  function setSrc(el, src, bindType) {
    if (bindType) {
      // @ts-ignore
      el.style[bindType] = "url(".concat(src, ")");
    } else {
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
      var _doTransform = options.doTransform([originSrc], dataset),
          _doTransform2 = _slicedToArray(_doTransform, 1),
          src = _doTransform2[0];

      setSrc(el, src, bindType);
    } else {
      el.classList.add(options.enterClass);

      var _doTransform3 = options.doTransform([originSrc], _objectSpread({}, dataset, {
        width: thumbnailWidth
      })),
          _doTransform4 = _slicedToArray(_doTransform3, 1),
          thumbnailSrc = _doTransform4[0];

      setSrc(el, thumbnailSrc, bindType); // 缩略图已经加载完成

      loadImage(thumbnailSrc).then(function () {
        var _doTransform5 = options.doTransform([originSrc], dataset),
            _doTransform6 = _slicedToArray(_doTransform5, 1),
            src = _doTransform6[0];

        loadImage(src).then(function () {
          setSrc(el, src, bindType);
          el.classList.add(options.leaveClass);

          function removeClass() {
            // tip: 少部分设备不支持multiple parameters，所以这里分开remove，基本保证最大兼容性
            el.classList.remove(options.enterClass);
            el.classList.remove(options.leaveClass);
          } // 为了保证只在这个el上添加一次transitionend


          el.ontransitionend = removeClass;
        });
      });
    }
  }

  var index = {
    install: install
  };

  return index;

}));
