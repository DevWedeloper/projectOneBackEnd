import { CharacterStatsDb } from '../../data-access/types/data-access.type';
import {
  requiredParam,
  validateNumberType,
  validatePositiveNumber,
} from '../../utils/validation-utils';

export const makeGetTopWellRoundedCharacters = ({
  characterStatsDb,
}: {
  characterStatsDb: CharacterStatsDb;
}) => {
  const getTopWellRoundedCharacters = async (limit: number) => {
    requiredParam(limit, 'Limit');
    validateNumberType(limit, 'Limit');
    validatePositiveNumber(limit, 'Limit');
    return characterStatsDb.getTopWellRoundedCharacters(limit);
  };
  return getTopWellRoundedCharacters;
};
