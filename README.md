## Usage

```javascript
import Vue from 'vue';
import Thumbnail from '@forzoom/thumbnail';

const doTransform = function(images, dataset) {
    return images.map(imageUrl => imageUrl + '/160');
}

Vue.use(Thumbnail, {
    doTransform,
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

使用data-thumbnail-width将触发thumbnail的逻辑，将使用**data-thumbnail-width**的值替换**data-width**的值
```html
<img src="example.jpg" data-thumbnail-width="100" />
```

## requirement

1. 依赖于core-js@2
