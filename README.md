## Usage

```javascript
import Vue from 'vue';
import Thumbnail from '@forzoom/thumbnail';

const doTransform = function(images, dataset) {
    return images.map(imageUrl => imageUrl + '/160');
}

Vue.use(Thumbnail, {
    doTransform,
});
```

## requirement

1. Promise polyfill
