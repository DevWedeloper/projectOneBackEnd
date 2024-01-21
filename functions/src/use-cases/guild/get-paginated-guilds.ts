import { GuildDb } from '../../data-access/types/data-access.type';
import {
  requiredParam,
  validateNumberType,
  validatePositiveNumber,
  validateSortOrder,
  validateStringType,
} from '../../utils/validation-utils';

export const makeGetPaginatedGuilds = ({ guildDb }: { guildDb: GuildDb }) => {
  const getAllGuild = async (
    page: number,
    pageSize: number,
    sortBy: string,
    sortOrder: 'asc' | 'desc',
    searchQuery: string,
  ) => {
    requiredParam(page, 'Page');
    requiredParam(pageSize, 'Page size');
    requiredParam(sortBy, 'Sort by');
    requiredParam(sortOrder, 'Sort order');

    validateNumberType(page, 'Page');
    validateNumberType(pageSize, 'Page size');

    validateStringType(sortBy, 'Sort by');
    validateStringType(sortOrder, 'Sort order');

    validatePositiveNumber(page, 'Page');

    if (searchQuery) {
      validateStringType(searchQuery, 'Search query');
    }

    validateSortOrder(sortOrder, 'Sort order');

    return guildDb.getPaginated(page, pageSize, sortBy, sortOrder, searchQuery);
  };
  return getAllGuild;
};
