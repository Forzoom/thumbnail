## Usage

```typescript
import Vue from 'vue';
import Thumbnail from '@forzoom/thumbnail';

const imageFilter = Thumbnail.generateImageFilter({
    bed: {
        aliyun: 'https://aliyun.example.com',
    },
    isAliyun(listener: ImageFilterListener, options: ImageFilterOptions) {
        return /aliyun.example.com/.test(listener.src);
    },
})

Vue.use(Thumbnail, {
    imageFilter,
    enterClass: 'add-blur',
    leaveClass: 'transition-blur',
});
```

```css
.add-blur {
    transition: 0.3s filter, 0.3s -webkit-filter;
    -webkit-filter: blur(4px);
    filter: blur(4px);
}
// 图片模糊第二层
.transition-blur {
    -webkit-filter: blur(0px);
    filter: blur(0px);
}
```

<hr>

### 使用data-width
```html
<img v-thumbnail="https://aliyun.example.com/test.jpg" data-width="100" />
```
生成内容(以阿里云为例)
```html
<img src="https://aliyun.example.com/test.jpg?x-oss-process=image/resize,w_100" />
```
需要配置
```typescript
const imageFilter = Thumbnail.generateImageFilter({
    isAliyun(listener: ImageFilterListener, options: ImageFilterOptions) {
        return /aliyun.exmaple.com/.test(listener.src);
    },
});
Vue.use({
    imageFilter,
});
```

<hr>

### 让thumbnail自动添加域名
```html
<img v-thumbnail="/test.jpg" />
```
生成内容
```html
<img src="https://aliyun.example.com/test.jpg" />
```
需要配置
```typescript
const imageFilter = Thumbnail.generateImageFilter({
    bed: {
        aliyun: 'https://aliyun.example.com',
        qiniu: 'https://qiniu.example.com',
        default: 'https://aliyun.example.com', // 当没有域名是将默认使用default对应的域名
    },
});
Vue.use({
    imageFilter,
});
```
选择不同的域名，使用data-bed
```html
<img v-thumbnail="/test.jpg" data-bed="qiniu" />
```
生成内容
```html
<img src="https://qiniu.example.com/test.jpg" />
```

<hr>

使用data-thumbnail-width将触发thumbnail的逻辑，将使用**data-thumbnail-width**的值替换**data-width**的值
```html
<img v-thumbnail="example.jpg" data-thumbnail-width="100" />
```

## requirement

1. 依赖于core-js@2

## Roadmap

1. doTransform不需要由ThumbnailPluginOptions.doTransform提供