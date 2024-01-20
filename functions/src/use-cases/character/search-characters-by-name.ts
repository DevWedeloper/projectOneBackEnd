import { CharacterDb } from '../../data-access/types/data-access.type';
import {
  requiredParam,
  validateNumberType,
  validatePositiveNumber,
  validateStringType,
} from '../../utils/validation-utils';

export const makeSearchCharactersByName = ({
  characterDb,
}: {
  characterDb: CharacterDb;
}) => {
  const searchCharactersByName = async (searchQuery: string, limit: number) => {
    validateStringType(searchQuery, 'Search query');
    requiredParam(limit, 'Limit');
    validateNumberType(limit, 'Limit');
    validatePositiveNumber(limit, 'Limit');
    return characterDb.findMultipleByName(searchQuery, limit);
  };
  return searchCharactersByName;
};
