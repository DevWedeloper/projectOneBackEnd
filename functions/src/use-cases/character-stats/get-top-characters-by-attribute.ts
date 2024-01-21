import { CharacterStatsDb } from '../../data-access/types/data-access.type';
import { ValidStatsAttribute } from '../../types/valid-stat-attribute.type';
import {
  requiredParam,
  validateNumberType,
  validatePositiveNumber,
  validateStatsAttribute,
  validateStringType,
} from '../../utils/validation-utils';

export const makeGetTopCharactersByAttribute = ({
  characterStatsDb,
}: {
  characterStatsDb: CharacterStatsDb;
}) => {
  const getTopCharactersByAttribute = async (
    attribute: ValidStatsAttribute,
    limit: number,
  ) => {
    requiredParam(attribute, 'Attribute');
    requiredParam(limit, 'Limit');

    validateStringType(attribute, 'Attribute');
    validateNumberType(limit, 'Limit');

    validatePositiveNumber(limit, 'Limit');

    validateStatsAttribute(attribute);

    return characterStatsDb.getTopCharactersByAttribute(attribute, limit);
  };
  return getTopCharactersByAttribute;
};
