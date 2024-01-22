import { deepFreeze } from './deep-freeze';

describe('deepFreeze function', () => {
  it('should freeze a simple object', () => {
    const simpleObject = {
      prop1: 'value1',
      prop2: 42,
    };

    deepFreeze(simpleObject);

    expect(Object.isFrozen(simpleObject)).toBe(true);

    expect(() => (simpleObject.prop1 = 'new value')).toThrow(TypeError);
  });

  it('should freeze an object with nested properties', () => {
    interface NestedObject {
      prop1: string;
      prop2: {
        nestedProp: number;
      };
    }

    const nestedObject: NestedObject = {
      prop1: 'value1',
      prop2: {
        nestedProp: 42,
      },
    };

    deepFreeze(nestedObject);

    expect(Object.isFrozen(nestedObject)).toBe(true);
    expect(Object.isFrozen(nestedObject.prop2)).toBe(true);

    // Ensure nested properties are also frozen
    expect(() => (nestedObject.prop2.nestedProp = 100)).toThrow(TypeError);
  });

  it('should not throw an error for non-object types', () => {
    const nonObject = 'not an object';

    expect(() => deepFreeze(nonObject)).not.toThrow();
  });
});
