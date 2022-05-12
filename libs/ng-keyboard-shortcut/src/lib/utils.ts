export function isFunction(x: any): x is () => void {
    return typeof x === "function";
}

export function invert<T extends string, U extends string> (obj: Record<T, U>) {
  const new_obj: Record<Extract<string,string>, string> = {};

  for (const prop in obj) {
    // eslint-disable-next-line no-prototype-builtins
    if (obj.hasOwnProperty(prop)) {
      new_obj[obj[prop]] = prop;
    }
  }
  return new_obj;
}

export const any = (fn: (params: unknown) => boolean, list: unknown[]) => {
    let idx = 0;
    while (idx < list.length) {
        if (fn(list[idx])) {
            return true;
        }
        idx += 1;
    }
    return false;
};

export const identity = (x: any) => x;

/**
 * @ignore
 * @param x
 * @returns boolean
 */
export const isNill = (x: unknown) => x == null;

/**
 * @ignore
 * @param xs
 * @param key
 * @returns any
 */
export function groupBy<T, K extends string = string>(xs: readonly T[], key: K): Record<K, T[]> {
  return xs.reduce(
    (result, x) => ({
      ...result,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      [x[key]]: [...(result[x[key]] || []), x]
    }),
    {} as Record<K, T[]>
  );
}


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

export const minMaxArrayProp = type => (property, array) =>
  // eslint-disable-next-line prefer-spread
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
