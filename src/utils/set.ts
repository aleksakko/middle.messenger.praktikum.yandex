export type Indexed<T = any> = {
    [key in string]: T;
}

export function mergeObjAndArr(lhs: Indexed, rhs: Indexed): Indexed {
    if (Array.isArray(lhs) && Array.isArray(rhs)) {
      return lhs.concat(rhs);
    }
  
    for (const p in rhs) {
      if (!Object.prototype.hasOwnProperty.call(rhs, p)) continue;
  
      try {
        if (rhs[p].constructor === Object) {
          if (!lhs[p]) {
            lhs[p] = {} as Indexed;
          }
          lhs[p] = merge(lhs[p] as Indexed, rhs[p] as Indexed);
        } else if (Array.isArray(rhs[p])) {
          if (!Array.isArray(lhs[p])) {
            lhs[p] = [];
          }
          lhs[p] = lhs[p].concat(rhs[p]);
        } else {
          lhs[p] = rhs[p];
        }
      } catch (e) {
        lhs[p] = rhs[p];
      }
    }
  
    return lhs;
  }

export function merge(lhs: Indexed, rhs: Indexed): Indexed {
    for (const p in rhs) {
        if (!Object.prototype.hasOwnProperty.call(rhs, p)) continue;

        try {
            if (rhs[p].constructor === Object) {
                rhs[p] = merge(lhs[p] as Indexed, rhs[p] as Indexed);
            } else {
                lhs[p] = rhs[p];
            }
        } catch (e) {
            lhs[p] = rhs[p];
        }
    }

    return lhs;
}

// console.log(set({ foo: 5 }, 'bar.baz', 10)); // { foo: 5, bar: { baz: 10 } }
// console.log(set(3, 'foo.bar', 'baz')); // 3

export default function set(obj: Indexed | unknown, path: string, value: unknown): Indexed | unknown {
    if (typeof obj !== 'object' || obj === null) {
        return obj;
    }

    if (typeof path !== 'string') {
        throw new Error('path must be a string');
    }

    const result = path.split('.').reduceRight((acc, key: string) => ({
        [key]: acc,
    }), value as any);

    return merge(obj, result);
}
