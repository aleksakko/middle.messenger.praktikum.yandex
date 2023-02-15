export function validate(validateRules) {
    return function (target, propertyKey, descriptor) {
      const originalMethod = descriptor.value;
  
      descriptor.value = async function(...args) {
        const validateData = userLoginValidator(args[0]);
        if (!validateData.isCorrect) {
          throw new Error(validateData);
        }
  
        return originalMethod.apply(this, args);
      }
  
      return descriptor;
    }
  }
  
export function handleError(handler) {
    return function (target, propertyKey, descriptor) {
      const originalMethod = descriptor.value;
  
      descriptor.value = async function(...args) {
        try {
          return originalMethod.apply(this, args);
        } catch (error) {
          return handler(error);
        }
      }
  
      return descriptor;
    }
}
