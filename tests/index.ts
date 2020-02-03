import { ImageFilter, ImageFilterListener, ImageFilterOptions } from '../types/index';

const el: ImageFilterListener = {
    el: document.getElementById('test')!,
    src: 'https://example.com',
}
const options: ImageFilterOptions = {}
const fn: ImageFilter = {
    addData: (el: ImageFilterListener, options: ImageFilterOptions) => {

    }
};

fn.addData(el, options);
