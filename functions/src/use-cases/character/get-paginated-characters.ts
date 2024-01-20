import { CharacterDb } from '../../data-access/types/data-access.type';
import {
  requiredParam,
  validateNumberType,
  validatePositiveNumber,
  validateSortOrder,
  validateStringType,
} from '../../utils/validation-utils';

export const makeGetPaginatedCharacters = ({
  characterDb,
}: {
  characterDb: CharacterDb;
}) => {
  const getAllCharacters = async (
    page: number,
    pageSize: number,
    sortBy: string,
    sortOrder: 'asc' | 'desc',
    searchQuery: string
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

    return characterDb.getPaginated(
      page,
      pageSize,
      sortBy,
      sortOrder,
      searchQuery
    );
  };
  return getAllCharacters;
};
