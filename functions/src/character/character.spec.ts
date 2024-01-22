import { ICharacterWithoutId } from '../types/characterType';
import { InvalidPropertyError, RequiredParameterError } from '../utils/errors';
import { makeCharacter } from './character';

describe('character', () => {
  it('should create a character with valid data', () => {
    const character = makeCharacter(validCharacterData);
    expect(character).toEqual(validCharacterData);
  });

  // Required param

  [
    'name',
    'characterType',
    'health',
    'strength',
    'agility',
    'intelligence',
    'armor',
    'critChance',
  ].forEach((param) => {
    it(`should throw an error for unprovided param ${param}`, () => {
      const invalidCharacterData = createInvalidCharacterData({
        [param]: undefined,
      });
      expect(() => makeCharacter(invalidCharacterData)).toThrow(
        RequiredParameterError,
      );
    });
  });

  // Valid string

  ['name', 'characterType'].forEach((property) => {
    it(`should throw an error for invalid string type ${property}`, () => {
      const invalidGuildData = createInvalidCharacterData({ [property]: 1 });
      expect(() => makeCharacter(invalidGuildData)).toThrow(
        InvalidPropertyError,
      );
    });
  });

  // Valid number

  [
    'health',
    'strength',
    'agility',
    'intelligence',
    'armor',
    'critChance',
  ].forEach((property) => {
    it(`should throw an error for invalid number type ${property}`, () => {
      const invalidGuildData = createInvalidCharacterData({
        [property]: 'string',
      });
      expect(() => makeCharacter(invalidGuildData)).toThrow(
        InvalidPropertyError,
      );
    });
  });

  // Valid number range

  it('should throw an error for invalid number range name.length min', () => {
    const invalidCharacterData = createInvalidCharacterData({ name: 'five_' });
    expect(() => makeCharacter(invalidCharacterData)).toThrow(
      InvalidPropertyError,
    );
  });

  it('should throw an error for invalid number range name.length max', () => {
    const invalidCharacterData = createInvalidCharacterData({
      name: 'twenty_letter_word_12',
    });
    expect(() => makeCharacter(invalidCharacterData)).toThrow(
      InvalidPropertyError,
    );
  });

  testNumberRange('health', 1000, 10000);
  testNumberRange('strength', 1, 100);
  testNumberRange('agility', 1, 100);
  testNumberRange('intelligence', 1, 100);
  testNumberRange('armor', 1, 100);
  testNumberRange('critChance', 0.01, 1);

  // Validate alphanumeric underscore

  it('should throw an error for invalid alphanumeric underscore name', () => {
    const invalidCharacterData = createInvalidCharacterData({
      name: '!@#$%^&*()',
    });
    expect(() => makeCharacter(invalidCharacterData)).toThrow(
      InvalidPropertyError,
    );
  });

  // TODO: Partial check on guild

  it('should freeze the guild object if provided', () => {
    const character = makeCharacter(validCharacterData);
    expect(Object.isFrozen(character.guild)).toBe(true);
  });

  it('should freeze the character on return', () => {
    const character = makeCharacter(validCharacterData);
    expect(Object.isFrozen(character)).toBe(true);
  });
});

const validCharacterData: ICharacterWithoutId = {
  name: 'JohnDoe',
  characterType: 'Warrior',
  health: 5000,
  strength: 80,
  agility: 60,
  intelligence: 40,
  armor: 75,
  critChance: 0.05,
  guild: null,
};

const createInvalidCharacterData = (
  overrides: Partial<Record<keyof ICharacterWithoutId, unknown>>,
): ICharacterWithoutId => {
  const defaultInvalidData: Partial<
    Record<keyof ICharacterWithoutId, unknown>
  > = {
    ...validCharacterData,
    ...overrides,
  };
  return defaultInvalidData as ICharacterWithoutId;
};

function testNumberRange(
  property: string,
  minValue: number,
  maxValue: number,
): void {
  it(`should throw an error for invalid number range ${property} min`, () => {
    const invalidCharacterData = createInvalidCharacterData({
      [property]: minValue - 0.1,
    });
    expect(() => makeCharacter(invalidCharacterData)).toThrow(
      InvalidPropertyError,
    );
  });

  it(`should throw an error for invalid number range ${property} max`, () => {
    const invalidCharacterData = createInvalidCharacterData({
      [property]: maxValue + 0.1,
    });
    expect(() => makeCharacter(invalidCharacterData)).toThrow(
      InvalidPropertyError,
    );
  });
}
