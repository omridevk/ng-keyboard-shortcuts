export function isFunction(x: any): x is Function {
    return typeof x === "function";
}

export const invert = obj => {
    const new_obj = {};

    for (const prop in obj) {
        if (obj.hasOwnProperty(prop)) {
            new_obj[obj[prop]] = prop;
        }
    }
    return new_obj;
};

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
export const prop = prop => object => object[prop];

const minMaxArrayProp = type => (property, array) =>
    Math[type].apply(Math, array.map(prop(property)));

export const maxArrayProp = (property, array) => {
    return array.reduce(
        (acc, curr) => {
            const propFn = prop(property);
            const currentValue = propFn(curr);
            const previousValue = propFn(acc);
            return currentValue > previousValue ? curr : acc;
        },
        { [property]: 0 }
    );
};
