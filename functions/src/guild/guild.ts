import { IGuildWithoutId } from '../types/guildType';
import { InvalidOperationError } from '../utils/errors';
import {
  requiredParam,
  validateAlphanumericUnderscore,
  validateNumberRange,
  validateNumberType,
  validateStringType,
} from '../utils/validation-utils';

export const makeGuild = ({
  name,
  leader,
  members,
  totalMembers,
  maxMembers,
  totalHealth,
  totalStrength,
  totalAgility,
  totalIntelligence,
  totalArmor,
  totalCritChance,
}: IGuildWithoutId): IGuildWithoutId => {
  requiredParam(name, 'Name');
  requiredParam(leader, 'Leader');
  requiredParam(members, 'Members');
  requiredParam(totalMembers, 'Total members');
  requiredParam(maxMembers, 'Max members');
  requiredParam(totalHealth, 'Total Health');
  requiredParam(totalStrength, 'Total Strength');
  requiredParam(totalAgility, 'Total Agility');
  requiredParam(totalIntelligence, 'Total Intelligence');
  requiredParam(totalArmor, 'Total Armor');
  requiredParam(totalCritChance, 'Total Crit Chance');

  validateStringType(name, 'Name');

  validateNumberType(totalMembers, 'Total members');
  validateNumberType(maxMembers, 'Max members');
  validateNumberType(totalHealth, 'Total Health');
  validateNumberType(totalStrength, 'Total Strength');
  validateNumberType(totalAgility, 'Total Agility');
  validateNumberType(totalIntelligence, 'Total Intelligence');
  validateNumberType(totalArmor, 'Total Armor');
  validateNumberType(totalCritChance, 'Total Crit Chance');

  validateNumberRange(name.length, 6, 20, 'Name length');

  validateAlphanumericUnderscore(name, 'Name');

  // TODO: Partial check on leader
  Object.freeze(leader);

  members.map((member) => {
    // TODO: Partial check on member
    Object.freeze(member);
  });

  if (members.length !== totalMembers) {
    throw new InvalidOperationError(
      'Members length and total members are not in sync.',
    );
  }

  if (members.length >= maxMembers) {
    throw new InvalidOperationError('Guild is full.');
  }

  return Object.freeze({
    name,
    leader,
    members,
    totalMembers,
    maxMembers,
    totalHealth,
    totalStrength,
    totalAgility,
    totalIntelligence,
    totalArmor,
    totalCritChance,
  });
};
