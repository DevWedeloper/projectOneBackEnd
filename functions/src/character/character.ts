import { ICharacterWithoutId } from '../types/characterType';
import {
  requiredParam,
  validateAlphanumericUnderscore,
  validateNumberRange,
  validateNumberType,
  validateStringType,
} from '../utils/validation-utils';

export const makeCharacter = ({
  name,
  characterType,
  health,
  strength,
  agility,
  intelligence,
  armor,
  critChance,
  guild,
}: ICharacterWithoutId): ICharacterWithoutId => {
  requiredParam(name, 'Name');
  requiredParam(characterType, 'Character Type');
  requiredParam(health, 'Health');
  requiredParam(strength, 'Strength');
  requiredParam(agility, 'Agility');
  requiredParam(intelligence, 'Intelligence');
  requiredParam(armor, 'Armor');
  requiredParam(critChance, 'Crit Chance');

  validateStringType(name, 'Name');
  validateStringType(characterType, 'Character Type');

  validateNumberType(health, 'Health');
  validateNumberType(strength, 'Strength');
  validateNumberType(agility, 'Agility');
  validateNumberType(intelligence, 'Intelligence');
  validateNumberType(armor, 'Armor');
  validateNumberType(critChance, 'Crit Chance');

  validateNumberRange(name.length, 6, 20, 'Name length');
  validateNumberRange(health, 1000, 10000, 'Health');
  validateNumberRange(strength, 1, 100, 'Strength');
  validateNumberRange(agility, 1, 100, 'Agility');
  validateNumberRange(intelligence, 1, 100, 'Intelligence');
  validateNumberRange(armor, 1, 100, 'Armor');
  validateNumberRange(critChance, 0.01, 1, 'Crit Chance');

  validateAlphanumericUnderscore(name, 'Name');

  if (guild) {
    // TODO: Partial check on guild
    Object.freeze(guild);
  }

  return Object.freeze({
    name,
    characterType,
    health,
    strength,
    agility,
    intelligence,
    armor,
    critChance,
    guild,
  });
};
