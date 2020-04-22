'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

require('core-js/modules/es.symbol');
require('core-js/modules/es.symbol.description');
require('core-js/modules/es.symbol.iterator');
require('core-js/modules/es.array.for-each');
require('core-js/modules/es.array.index-of');
require('core-js/modules/es.array.iterator');
require('core-js/modules/es.array.last-index-of');
require('core-js/modules/es.number.constructor');
require('core-js/modules/es.object.keys');
require('core-js/modules/es.object.to-string');
require('core-js/modules/es.regexp.exec');
require('core-js/modules/es.string.iterator');
require('core-js/modules/es.string.search');
require('core-js/modules/web.dom-collections.for-each');
require('core-js/modules/web.dom-collections.iterator');
require('core-js/modules/es.promise');
var url = _interopDefault(require('url'));

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
function supportWebp() {
  if (typeof window === 'undefined') {
    return false;
  }

  var support = true;
  var d = document;

  try {
    var el = d.createElement('object');
    el.type = 'image/webp';
    el.style.visibility = 'hidden';
    el.innerHTML = '!';
    d.body.appendChild(el);
    support = !el.offsetWidth;
    d.body.removeChild(el);
  } catch (err) {
    support = false;
  }

  return support;
}
var isSupportWebp = supportWebp();
/**
 * 是否是null或者undefined
 *
 * @param {} v 参数
 *
 * @return {boolean}
 */

function isUndef(v) {
  return v === null || v === undefined;
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
    bind: genFn(false),
    update: genFn(true)
  });
}

function setSrc(el, src, bindType) {
  if (bindType) {
    if (bindType === 'poster') {
      el.setAttribute('poster', src);
    } else {
      // @ts-ignore
      el.style[bindType] = "url(".concat(src, ")");
    }
  } else {
    el.setAttribute('src', src);
  }
}

function genFn(cache) {
  return function fn(el, binding) {
    // 当cache时需要检查 value 和 oldValue
    if (!options || cache && binding.value === binding.oldValue) {
      return;
    }

    var dataset = el.dataset;
    /** 原始链接 */

    var originSrc = binding.value;
    var bindType = binding.arg;
    var thumbnailWidth = dataset.thumbnailWidth;
    var dt = options.doTransform || doTransform;

    if (!thumbnailWidth || isNaN(Number(thumbnailWidth))) {
      var result = dt([originSrc], dataset, options.imageFilter);
      setSrc(el, result[0], bindType);
    } else {
      el.classList.add(options.enterClass || '');

      var _result = dt([originSrc], _objectSpread({}, dataset, {
        width: thumbnailWidth
      }), options.imageFilter);

      var thumbnailSrc = _result[0];
      setSrc(el, thumbnailSrc, bindType); // 缩略图已经加载完成

      loadImage(thumbnailSrc).then(function () {
        var _dt = dt([originSrc], dataset, options.imageFilter),
            _dt2 = _slicedToArray(_dt, 1),
            src = _dt2[0];

        loadImage(src).then(function () {
          setSrc(el, src, bindType);
          el.classList.add(options.leaveClass || '');

          function removeClass() {
            // tip: 少部分设备不支持multiple parameters，所以这里分开remove，基本保证最大兼容性
            el.classList.remove(options.enterClass || '');
            el.classList.remove(options.leaveClass || '');
          } // 为了保证只在这个el上添加一次transitionend


          el.ontransitionend = removeClass;
        });
      });
    }
  };
}
/** 执行转换 */


function doTransform(images) {
  var dataset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var imageFilter = arguments.length > 2 ? arguments[2] : undefined;
  var result = [];
  var filterKeys = Object.keys(imageFilter);
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    var _loop = function _loop() {
      var image = _step.value;
      var listener = {
        el: {
          dataset: dataset
        },
        src: image
      };
      filterKeys.forEach(function (key) {
        var fn = imageFilter[key];
        fn(listener, {
          supportWebp: isSupportWebp
        });
      });
      result.push(listener.src);
    };

    for (var _iterator = images[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      _loop();
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator["return"] != null) {
        _iterator["return"]();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return result;
}

function generateImageFilter(generateOptions) {
  var imageFilter = {
    /**
     * 添加存储数据所使用的对象
     */
    addData: function addData(listener, options) {
      if (!listener.ro) {
        listener.ro = {};
      }

      var dataset = listener.el.dataset;

      if (dataset.avatar === 'true' || dataset.avatar) {
        listener.ro.avatar = true;
      }
    },

    /**
     * 添加domain
     */
    domain: function domain(listener, options) {
      var src = listener.src;

      if (!src || !generateOptions.bed) {
        return;
      }

      if (src.indexOf('https://') === 0 || src.indexOf('http://') === 0 || src.indexOf('//') === 0) {
        return;
      }

      if (src[0] !== '/') {
        return;
      }

      var dataset = listener.el.dataset;
      var bedName = dataset.bed;
      var domain = generateOptions.bed[bedName] || generateOptions.bed["default"];

      if (domain) {
        listener.src = domain + src;
      }
    },

    /**
     * 优先处理webp，但是如何判断是否是一个png呢?
     */
    webp: function webp(listener, options) {
      if (!options.supportWebp) {
        return;
      }

      var dataset = listener.el.dataset;

      if (dataset.webp === false || dataset.webp === 'false') {
        return;
      }

      listener.ro.webp = true;
    },

    /**
     * 渐进显示
     */
    interlace: function interlace(listener, options) {
      var dataset = listener.el.dataset;

      if (isUndef(dataset.interlace)) {
        return;
      }

      listener.ro.interlace = dataset.interlace;
    },

    /**
     * 图片缩放，暂时只识别width
     */
    size: function size(listener, options) {
      var dataset = listener.el.dataset;

      if (isUndef(dataset.width)) {
        return;
      }

      listener.ro.width = dataset.width;
    },

    /**
     * 添加七牛处理
     */
    qiniu: function qiniu(listener, options) {
      if (generateOptions.isQiniu && generateOptions.isQiniu(listener, options)) {
        var data = listener.ro;
        var keys = Object.keys(data);

        if (keys.length === 0) {
          return;
        } // 处理


        var qs = '?imageView2/2';
        var append = false;

        if (data.width) {
          qs += "/w/".concat(data.width);
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
    aliyun: function aliyun(listener, options) {
      if (generateOptions.isAliyun && generateOptions.isAliyun(listener, options)) {
        var data = listener.ro;
        var keys = Object.keys(data);

        if (keys.length === 0) {
          return;
        } // 处理


        var qs = 'image';
        var append = false;

        if (data.width) {
          qs += "/resize,w_".concat(data.width);
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
          var result = url.parse(listener.src, true);
          delete result.search;

          if (result.query) {
            result.query['x-oss-process'] = qs;
          } else {
            result.query = {
              'x-oss-process': qs
            };
          }

          listener.src = url.format(result);
        }
      }
    },

    /**
     * 处理微信头像图片
     */
    wx: function wx(listener, options) {
      if (generateOptions.isWeChat && generateOptions.isWeChat(listener, options)) {
        var data = listener.ro;
        var keys = Object.keys(data);

        if (keys.length === 0) {
          return;
        }

        var optionalKeys = [46, 64, 96, 132, 640];

        if (data.width) {
          var targetWidth = 640; // 尝试选择靠近这个width的option

          for (var i = 0, len = optionalKeys.length; i < len; i++) {
            if (optionalKeys[i] > data.width) {
              targetWidth = optionalKeys[i];
              break;
            }
          }

          if (targetWidth === 640) {
            targetWidth = 0;
          }

          var pos = listener.src.lastIndexOf('/');
          listener.src = listener.src.substr(0, pos) + '/' + targetWidth;
        }
      }
    },

    /**
     * 没有图片的时候
     */
    none: function none(listener, options) {
      if (isUndef(listener.src) || listener.src === '') {
        var data = listener.ro;
        var keys = Object.keys(data);

        if (keys.length === 0) {
          return;
        } // 使用默认头像


        if (data.avatar && generateOptions.defaultImageUrl) {
          listener.src = generateOptions.defaultImageUrl;
        }
      }
    }
  };
  return imageFilter;
}

var index = {
  install: install,
  doTransform: doTransform,
  generateImageFilter: generateImageFilter
};

module.exports = index;
