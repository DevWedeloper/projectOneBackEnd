import { GuildDb } from '../../data-access/types/data-access.type';
import {
  requiredParam,
  validateNumberType,
  validatePositiveNumber,
  validateStringType,
} from '../../utils/validation-utils';

export const makeSearchGuildsByName = ({ guildDb }: { guildDb: GuildDb }) => {
  const searchGuildsByName = async (searchQuery: string, limit: number) => {
    requiredParam(searchQuery, 'Search query');
    requiredParam(limit, 'Limit');

    validateStringType(searchQuery, 'Search query');
    validateNumberType(limit, 'Limit');

    validatePositiveNumber(limit, 'Limit');

    return guildDb.findMultipleByName(searchQuery, limit);
  };
  return searchGuildsByName;
};
