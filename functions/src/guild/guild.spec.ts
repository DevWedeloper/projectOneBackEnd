import { IGuildWithoutId } from '../types/guildType';
import { InvalidPropertyError, RequiredParameterError } from '../utils/errors';
import { makeGuild } from './guild';

describe('guild', () => {
  it('should create a guild with valid data', () => {
    const guild = makeGuild(validGuildData);
    expect(guild).toEqual(validGuildData);
  });

  // Required param

  it('should throw an error for unprovided param name', () => {
    const invalidGuildData = createInvalidGuildData({
      name: undefined,
    });
    expect(() => makeGuild(invalidGuildData)).toThrow(RequiredParameterError);
  });

  it('should throw an error for unprovided param leader', () => {
    const invalidGuildData = createInvalidGuildData({
      leader: undefined,
    });
    expect(() => makeGuild(invalidGuildData)).toThrow(RequiredParameterError);
  });

  it('should throw an error for unprovided param members', () => {
    const invalidGuildData = createInvalidGuildData({
      members: undefined,
    });
    expect(() => makeGuild(invalidGuildData)).toThrow(RequiredParameterError);
  });

  it('should throw an error for unprovided param totalMembers', () => {
    const invalidGuildData = createInvalidGuildData({
      totalMembers: undefined,
    });
    expect(() => makeGuild(invalidGuildData)).toThrow(RequiredParameterError);
  });

  it('should throw an error for unprovided param maxMembers', () => {
    const invalidGuildData = createInvalidGuildData({
      maxMembers: undefined,
    });
    expect(() => makeGuild(invalidGuildData)).toThrow(RequiredParameterError);
  });

  it('should throw an error for unprovided param totalHealth', () => {
    const invalidGuildData = createInvalidGuildData({
      totalHealth: undefined,
    });
    expect(() => makeGuild(invalidGuildData)).toThrow(RequiredParameterError);
  });

  it('should throw an error for unprovided param totalStrength', () => {
    const invalidGuildData = createInvalidGuildData({
      totalStrength: undefined,
    });
    expect(() => makeGuild(invalidGuildData)).toThrow(RequiredParameterError);
  });

  it('should throw an error for unprovided param totalAgility', () => {
    const invalidGuildData = createInvalidGuildData({
      totalAgility: undefined,
    });
    expect(() => makeGuild(invalidGuildData)).toThrow(RequiredParameterError);
  });

  it('should throw an error for unprovided param totalIntelligence', () => {
    const invalidGuildData = createInvalidGuildData({
      totalIntelligence: undefined,
    });
    expect(() => makeGuild(invalidGuildData)).toThrow(RequiredParameterError);
  });

  it('should throw an error for unprovided param totalArmor', () => {
    const invalidGuildData = createInvalidGuildData({
      totalArmor: undefined,
    });
    expect(() => makeGuild(invalidGuildData)).toThrow(RequiredParameterError);
  });

  it('should throw an error for unprovided param totalCritChance', () => {
    const invalidGuildData = createInvalidGuildData({
      totalCritChance: undefined,
    });
    expect(() => makeGuild(invalidGuildData)).toThrow(RequiredParameterError);
  });

  // Valid string type

  it('should throw an error for invalid string type name', () => {
    const invalidGuildData = createInvalidGuildData({ name: 12345 });
    expect(() => makeGuild(invalidGuildData)).toThrow(InvalidPropertyError);
  });

  // Valid number type

  it('should throw an error for invalid number type totalMembers', () => {
    const invalidGuildData = createInvalidGuildData({ totalMembers: '5000' });
    expect(() => makeGuild(invalidGuildData)).toThrow(InvalidPropertyError);
  });

  it('should throw an error for invalid number type maxMembers', () => {
    const invalidGuildData = createInvalidGuildData({ maxMembers: '5000' });
    expect(() => makeGuild(invalidGuildData)).toThrow(InvalidPropertyError);
  });

  it('should throw an error for invalid number type totalHealth', () => {
    const invalidGuildData = createInvalidGuildData({ totalHealth: '5000' });
    expect(() => makeGuild(invalidGuildData)).toThrow(InvalidPropertyError);
  });

  it('should throw an error for invalid number type totalStrength', () => {
    const invalidGuildData = createInvalidGuildData({ totalStrength: '5000' });
    expect(() => makeGuild(invalidGuildData)).toThrow(InvalidPropertyError);
  });

  it('should throw an error for invalid number type totalAgility', () => {
    const invalidGuildData = createInvalidGuildData({ totalAgility: '5000' });
    expect(() => makeGuild(invalidGuildData)).toThrow(InvalidPropertyError);
  });

  it('should throw an error for invalid number type totalIntelligence', () => {
    const invalidGuildData = createInvalidGuildData({
      totalIntelligence: '5000',
    });
    expect(() => makeGuild(invalidGuildData)).toThrow(InvalidPropertyError);
  });

  it('should throw an error for invalid number type totalArmor', () => {
    const invalidGuildData = createInvalidGuildData({ totalArmor: '5000' });
    expect(() => makeGuild(invalidGuildData)).toThrow(InvalidPropertyError);
  });

  it('should throw an error for invalid number type totalCritChance', () => {
    const invalidGuildData = createInvalidGuildData({
      totalCritChance: '5000',
    });
    expect(() => makeGuild(invalidGuildData)).toThrow(InvalidPropertyError);
  });

  // Valid number range

  it('should throw an error for invalid number range name.length min', () => {
    const invalidGuildData = createInvalidGuildData({ name: 'five_' });
    expect(() => makeGuild(invalidGuildData)).toThrow(InvalidPropertyError);
  });

  // Validate alphanumeric underscore

  it('should throw an error for invalid alphanumeric underscore name', () => {
    const invalidGuildData = createInvalidGuildData({
      name: '!@#$%^&*()',
    });
    expect(() => makeGuild(invalidGuildData)).toThrow(InvalidPropertyError);
  });

  // TODO: Partial check on leader

  // TODO: Partial check on member

  it('should freeze the guild on return', () => {
    const guild = makeGuild(validGuildData);
    expect(Object.isFrozen(guild)).toBe(true);
  });
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
