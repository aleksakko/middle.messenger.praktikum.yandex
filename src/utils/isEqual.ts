type Indexed<T = any> = {
    [key in string]: T;
} | null;

function isEqual(a: Indexed, b: Indexed): boolean {
        if (a == null || b == null) {
            return a === b;
        }

        const aProps = Object.getOwnPropertyNames(a);
        const bProps = Object.getOwnPropertyNames(b);
      
        if (aProps.length !== bProps.length) {
            return false;
        }
      
        for (let i = 0; i < aProps.length; i++) {
            const propName: any = aProps[i];
          
            const aValue = a[propName];
            const bValue = b[propName];
          
            if (typeof aValue === 'object' && typeof bValue === 'object') {
                if (!isEqual(aValue, bValue)) {
                    return false;
                }
            } else if (aValue !== bValue) {
                return false;
            }
        }
      
        return true;
    
}

export default isEqual;

export function isEqualObjAndArr(a: Indexed, b: Indexed): boolean {
    if (a == null || b == null) {
        return a === b;
    }

    const aType = Object.prototype.toString.call(a);
    const bType = Object.prototype.toString.call(b);

    if (aType !== bType) {
        return false;
    }

    if (aType === '[object Array]') {
        if (a.length !== b.length) {
            return false;
        }

        for (let i = 0; i < a.length; i++) {
            if (!isEqual(a[i], b[i])) {
                return false;
            }
        }

        return true;
    }

    const aProps = Object.getOwnPropertyNames(a);
    const bProps = Object.getOwnPropertyNames(b);

    if (aProps.length !== bProps.length) {
        return false;
    }

    for (let i = 0; i < aProps.length; i++) {
        const propName: any = aProps[i];

        const aValue = a[propName];
        const bValue = b[propName];

        if (typeof aValue === 'object' && typeof bValue === 'object') {
            if (!isEqual(aValue, bValue)) {
                return false;
            }
        } else if (aValue !== bValue) {
            return false;
        }
    }

    return true;
}
