export function loadImage(src: string) {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.onload = () => {
            resolve();
        };
        image.src = src;
    });
}

export function supportWebp() {
    if (typeof window === 'undefined') {
        return false;
    }

    let support = true;
    const d = document;

    try {
        const el = d.createElement('object');
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

export const isSupportWebp: boolean = supportWebp();

/**
 * 是否是null或者undefined
 *
 * @param {} v 参数
 *
 * @return {boolean}
 */
export function isUndef(v: any): v is (null | undefined) {
    return v === null || v === undefined;
}
