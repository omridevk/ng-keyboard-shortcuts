
export function isFunction(x: any): x is Function {
    return typeof x === "function";
}

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

export const identity = x => x;

/**
 * @ignore
 * @param x
 * @returns boolean
 */
export const isNill = x => x == null;

/**
 * @ignore
 * @param xs
 * @param key
 * @returns any
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
 * @param first
 * @param second
 * @returns any[]
 */
export const difference = (first: any[], second: any[]) =>
    first.filter(item => !second.includes(item));

/**
 * @ignore
 * @param preds
 * @returns (...args) => boolean;
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
 * @returns string
 */
export const guid = () =>
    Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
