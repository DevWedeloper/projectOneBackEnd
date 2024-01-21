import { ICharacterWithoutId } from '../types/characterType';
import { InvalidPropertyError, RequiredParameterError } from '../utils/errors';
import { makeCharacter } from './character';

describe('character', () => {
  it('should create a character with valid data', () => {
    const character = makeCharacter(validCharacterData);
    expect(character).toEqual(validCharacterData);
  });

  // Required param

  it('should throw an error for unprovided param name', () => {
    const invalidCharacterData = createInvalidCharacterData({
      name: undefined,
    });
    expect(() => makeCharacter(invalidCharacterData)).toThrow(
      RequiredParameterError,
    );
  });

  it('should throw an error for unprovided param characterType', () => {
    const invalidCharacterData = createInvalidCharacterData({
      characterType: undefined,
    });
    expect(() => makeCharacter(invalidCharacterData)).toThrow(
      RequiredParameterError,
    );
  });

  it('should throw an error for unprovided param health', () => {
    const invalidCharacterData = createInvalidCharacterData({
      health: undefined,
    });
    expect(() => makeCharacter(invalidCharacterData)).toThrow(
      RequiredParameterError,
    );
  });

  it('should throw an error for unprovided param strength', () => {
    const invalidCharacterData = createInvalidCharacterData({
      strength: undefined,
    });
    expect(() => makeCharacter(invalidCharacterData)).toThrow(
      RequiredParameterError,
    );
  });

  it('should throw an error for unprovided param agility', () => {
    const invalidCharacterData = createInvalidCharacterData({
      agility: undefined,
    });
    expect(() => makeCharacter(invalidCharacterData)).toThrow(
      RequiredParameterError,
    );
  });

  it('should throw an error for unprovided param intelligence', () => {
    const invalidCharacterData = createInvalidCharacterData({
      intelligence: undefined,
    });
    expect(() => makeCharacter(invalidCharacterData)).toThrow(
      RequiredParameterError,
    );
  });

  it('should throw an error for unprovided param armor', () => {
    const invalidCharacterData = createInvalidCharacterData({
      armor: undefined,
    });
    expect(() => makeCharacter(invalidCharacterData)).toThrow(
      RequiredParameterError,
    );
  });

  it('should throw an error for unprovided param critChance', () => {
    const invalidCharacterData = createInvalidCharacterData({
      critChance: undefined,
    });
    expect(() => makeCharacter(invalidCharacterData)).toThrow(
      RequiredParameterError,
    );
  });

  // Valid string

  it('should throw an error for invalid string type name', () => {
    const invalidCharacterData = createInvalidCharacterData({ name: 12345 });
    expect(() => makeCharacter(invalidCharacterData)).toThrow(
      InvalidPropertyError,
    );
  });

  it('should throw an error for invalid string type characterType', () => {
    const invalidCharacterData = createInvalidCharacterData({
      characterType: 12345,
    });
    expect(() => makeCharacter(invalidCharacterData)).toThrow(
      InvalidPropertyError,
    );
  });

  // Valid number

  it('should throw an error for invalid number type health', () => {
    const invalidCharacterData = createInvalidCharacterData({ health: '5000' });
    expect(() => makeCharacter(invalidCharacterData)).toThrow(
      InvalidPropertyError,
    );
  });

  it('should throw an error for invalid number type strength', () => {
    const invalidCharacterData = createInvalidCharacterData({
      strength: '5000',
    });
    expect(() => makeCharacter(invalidCharacterData)).toThrow(
      InvalidPropertyError,
    );
  });

  it('should throw an error for invalid number type agility', () => {
    const invalidCharacterData = createInvalidCharacterData({
      agility: '5000',
    });
    expect(() => makeCharacter(invalidCharacterData)).toThrow(
      InvalidPropertyError,
    );
  });

  it('should throw an error for invalid number type intelligence', () => {
    const invalidCharacterData = createInvalidCharacterData({
      intelligence: '5000',
    });
    expect(() => makeCharacter(invalidCharacterData)).toThrow(
      InvalidPropertyError,
    );
  });

  it('should throw an error for invalid number type armor', () => {
    const invalidCharacterData = createInvalidCharacterData({ armor: '5000' });
    expect(() => makeCharacter(invalidCharacterData)).toThrow(
      InvalidPropertyError,
    );
  });

  it('should throw an error for invalid number type critChance', () => {
    const invalidCharacterData = createInvalidCharacterData({
      critChance: '5000',
    });
    expect(() => makeCharacter(invalidCharacterData)).toThrow(
      InvalidPropertyError,
    );
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

  it('should throw an error for invalid number range health min', () => {
    const invalidCharacterData = createInvalidCharacterData({ health: 999 });
    expect(() => makeCharacter(invalidCharacterData)).toThrow(
      InvalidPropertyError,
    );
  });

  it('should throw an error for invalid number range health max', () => {
    const invalidCharacterData = createInvalidCharacterData({ health: 10001 });
    expect(() => makeCharacter(invalidCharacterData)).toThrow(
      InvalidPropertyError,
    );
  });

  it('should throw an error for invalid number range strength min', () => {
    const invalidCharacterData = createInvalidCharacterData({ strength: 0.9 });
    expect(() => makeCharacter(invalidCharacterData)).toThrow(
      InvalidPropertyError,
    );
  });

  it('should throw an error for invalid number range strength max', () => {
    const invalidCharacterData = createInvalidCharacterData({ strength: 101 });
    expect(() => makeCharacter(invalidCharacterData)).toThrow(
      InvalidPropertyError,
    );
  });

  it('should throw an error for invalid number range agility min', () => {
    const invalidCharacterData = createInvalidCharacterData({ agility: 0.9 });
    expect(() => makeCharacter(invalidCharacterData)).toThrow(
      InvalidPropertyError,
    );
  });

  it('should throw an error for invalid number range agility max', () => {
    const invalidCharacterData = createInvalidCharacterData({ agility: 101 });
    expect(() => makeCharacter(invalidCharacterData)).toThrow(
      InvalidPropertyError,
    );
  });

  it('should throw an error for invalid number range intelligence min', () => {
    const invalidCharacterData = createInvalidCharacterData({
      intelligence: 0.9,
    });
    expect(() => makeCharacter(invalidCharacterData)).toThrow(
      InvalidPropertyError,
    );
  });

  it('should throw an error for invalid number range intelligence max', () => {
    const invalidCharacterData = createInvalidCharacterData({
      intelligence: 101,
    });
    expect(() => makeCharacter(invalidCharacterData)).toThrow(
      InvalidPropertyError,
    );
  });

  it('should throw an error for invalid number range armor min', () => {
    const invalidCharacterData = createInvalidCharacterData({ armor: 0.9 });
    expect(() => makeCharacter(invalidCharacterData)).toThrow(
      InvalidPropertyError,
    );
  });

  it('should throw an error for invalid number range armor max', () => {
    const invalidCharacterData = createInvalidCharacterData({ armor: 101 });
    expect(() => makeCharacter(invalidCharacterData)).toThrow(
      InvalidPropertyError,
    );
  });

  it('should throw an error for invalid number range critChance min', () => {
    const invalidCharacterData = createInvalidCharacterData({
      critChance: 0.0099,
    });
    expect(() => makeCharacter(invalidCharacterData)).toThrow(
      InvalidPropertyError,
    );
  });

  it('should throw an error for invalid number range critChance max', () => {
    const invalidCharacterData = createInvalidCharacterData({
      critChance: 1.01,
    });
    expect(() => makeCharacter(invalidCharacterData)).toThrow(
      InvalidPropertyError,
    );
  });

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
