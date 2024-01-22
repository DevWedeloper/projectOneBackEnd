export const deepFreeze = <T>(obj: T): void => {
  if (obj === null || typeof obj !== 'object') {
    return;
  }

  Object.freeze(obj);

  Object.keys(obj).forEach((prop: string) => {
    const key = prop as keyof T;
    if (
      Object.prototype.hasOwnProperty.call(obj, key) &&
      obj[key] !== null &&
      (typeof obj[key] === 'object' || typeof obj[key] === 'function') &&
      !Object.isFrozen(obj[key])
    ) {
      deepFreeze(obj[key]);
    }
  });
};
