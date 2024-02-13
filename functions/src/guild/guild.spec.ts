import { IGuildWithoutId } from '../types/guild.type';
import { InvalidPropertyError, RequiredParameterError } from '../utils/errors';
import { makeGuild } from './guild';

describe('guild', () => {
  it('should create a guild with valid data', () => {
    const guild = makeGuild(validGuildData);
    expect(guild).toEqual(validGuildData);
  });

  [
    'name',
    'leader',
    'members',
    'totalMembers',
    'maxMembers',
    'totalHealth',
    'totalStrength',
    'totalAgility',
    'totalIntelligence',
    'totalArmor',
    'totalCritChance',
  ].forEach((param) => {
    it(`should throw an error for unprovided param ${param}`, () => {
      const invalidGuildData = createInvalidGuildData({ [param]: undefined });
      expect(() => makeGuild(invalidGuildData)).toThrow(RequiredParameterError);
    });
  });

  it('should throw an error for invalid string type name', () => {
    const invalidGuildData = createInvalidGuildData({ name: 12345 });
    expect(() => makeGuild(invalidGuildData)).toThrow(InvalidPropertyError);
  });

  [
    'totalMembers',
    'maxMembers',
    'totalHealth',
    'totalStrength',
    'totalAgility',
    'totalIntelligence',
    'totalArmor',
    'totalCritChance',
  ].forEach((property) => {
    it(`should throw an error for invalid number type ${property}`, () => {
      const invalidGuildData = createInvalidGuildData({ [property]: 'string' });
      expect(() => makeGuild(invalidGuildData)).toThrow(InvalidPropertyError);
    });
  });

  it('should throw an error for invalid number range name.length min', () => {
    const invalidGuildData = createInvalidGuildData({ name: 'five_' });
    expect(() => makeGuild(invalidGuildData)).toThrow(InvalidPropertyError);
  });

  it('should throw an error for invalid number range name.length max', () => {
    const invalidCharacterData = createInvalidGuildData({
      name: 'twenty_letter_word_12',
    });
    expect(() => makeGuild(invalidCharacterData)).toThrow(InvalidPropertyError);
  });

  it('should throw an error for invalid alphanumeric underscore name', () => {
    const invalidGuildData = createInvalidGuildData({
      name: '!@#$%^&*()',
    });
    expect(() => makeGuild(invalidGuildData)).toThrow(InvalidPropertyError);
  });

  // TODO: Partial check on leader

  // TODO: Partial check on member

  // TODO: Check members.length if equal to totalMembers

  // TODO: Check if members.length or totalMembers is greater than or equal to maxMembers

  it('should freeze the guild on return', () => {
    const guild = makeGuild(validGuildData);
    expect(Object.isFrozen(guild)).toBe(true);
  });

  // TODO: Return only valid parameters
});

const validGuildData: IGuildWithoutId = {
  name: 'exemptthong',
  leader: {
    name: 'JohnDoe',
    characterType: 'Warrior',
    health: 5000,
    strength: 80,
    agility: 60,
    intelligence: 40,
    armor: 75,
    critChance: 0.05,
    guild: null,
  },
  members: [
    {
      name: 'compact_tis',
    },
  ],
  totalMembers: 1,
  maxMembers: 50,
  totalHealth: 0,
  totalStrength: 0,
  totalAgility: 0,
  totalIntelligence: 0,
  totalArmor: 0,
  totalCritChance: 0,
} as unknown as IGuildWithoutId;

const createInvalidGuildData = (
  overrides: Partial<Record<keyof IGuildWithoutId, unknown>>,
): IGuildWithoutId => {
  const defaultInvalidData: Partial<Record<keyof IGuildWithoutId, unknown>> = {
    ...validGuildData,
    ...overrides,
  };
  return defaultInvalidData as IGuildWithoutId;
};
