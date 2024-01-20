import { GuildStatsDb } from '../../data-access/types/data-access.type';
import { ValidStatsAttribute } from '../../types/valid-stat-attribute.type';
import { InvalidPropertyError } from '../../utils/errors';
import {
  requiredParam,
  validateNumberType,
  validatePositiveNumber,
  validateStatsAttribute,
  validateStringType,
} from '../../utils/validation-utils';
import { attributeMapping } from '../utils/attribute-mapping';

export const makeGetTopGuildsByAverageAttribute = ({
  guildStatsDb,
}: {
  guildStatsDb: GuildStatsDb;
}) => {
  const getTopGuildsByAverageAttribute = async (
    attribute: ValidStatsAttribute,
    limit: number
  ) => {
    requiredParam(attribute, 'Attribute');
    requiredParam(limit, 'Limit');

    validateStringType(attribute, 'Attribute');
    validateNumberType(limit, 'Limit');

    validatePositiveNumber(limit, 'Limit');

    validateStatsAttribute(attribute);

    const actualAttribute = attributeMapping[attribute];
    if (!actualAttribute) {
      throw new InvalidPropertyError(`Invalid attribute: ${attribute}.`);
    }

    return guildStatsDb.getTopGuildsByAverageAttribute(actualAttribute, limit);
  };
  return getTopGuildsByAverageAttribute;
};
