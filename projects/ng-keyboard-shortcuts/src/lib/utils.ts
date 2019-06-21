/**
 * @ignore
 * @param x
 * @returns {x is Function}
 */
export function isFunction(x: any): x is Function {
    return typeof x === 'function';
}

/**
 * @ignore
 * @param {Function} fn
 * @param {any[]} list
 * @returns {boolean}
 */
export const any = (fn: Function, list: any[]) => {
    let idx = 0;
    while (idx < list.length) {
        if (fn(list[idx])) {
            return true;
        }
        idx += 1;
    }
    return false;
};
/**
 * ignore
 * @param x
 * @returns {any}
 */
export const identity = x => x;

/**
 * @ignore
 * @param x
 * @returns {boolean}
 */
export const isNill = x => x == null;

/**
 * @ignore
 * @param xs
 * @param key
 * @returns {any}
 */
export const groupBy = (xs, key) =>
    xs.reduce(
        (result, x) => ({
            ...result,
            [x[key]]: [...(result[x[key]] || []), x]
        }),
        {}
    );


/**
 * @ignore
 * @param {any[]} first
 * @param {any[]} second
 * @returns {any}
 */
export const difference = (first: any[], second: any[]) =>
    first.filter(item => !second.includes(item));

/**
 * @ignore
 * @param preds
 * @returns {(...args) => (boolean)}
 */
export const allPass = preds => (...args) => {
    let idx = 0;
    const len = preds.length;
    while (idx < len) {
        if (!preds[idx].apply(this, args)) {
            return false;
        }
        idx += 1;
    }
    return true;
};

/**
 * @ignore
 * @returns {any}
 */
export const guid = () =>
    Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
