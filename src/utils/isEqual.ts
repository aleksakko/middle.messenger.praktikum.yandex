type Indexed<T = any> = {
    [key in string]: T;
};

function isEqual(a: Indexed, b: Indexed): boolean {
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

export default isEqual
