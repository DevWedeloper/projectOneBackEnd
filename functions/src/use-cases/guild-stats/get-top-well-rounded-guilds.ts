import { GuildStatsDb } from '../../data-access/types/data-access.type';
import {
  requiredParam,
  validateNumberType,
  validatePositiveNumber,
} from '../../utils/validation-utils';

export const makeGetTopWellRoundedGuilds = ({
  guildStatsDb,
}: {
  guildStatsDb: GuildStatsDb;
}) => {
  const getTopWellRoundedGuilds = async (limit: number) => {
    requiredParam(limit, 'Limit');
    validateNumberType(limit, 'Limit');
    validatePositiveNumber(limit, 'Limit');
    return guildStatsDb.getTopWellRoundedGuilds(limit);
  };
  return getTopWellRoundedGuilds;
};
