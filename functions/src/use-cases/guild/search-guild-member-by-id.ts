import { GuildDb } from '../../data-access/types/data-access.type';
import { makeGuild } from '../../guild/guild';
import { IGuild } from '../../types/guild.type';
import {
  requiredParam,
  validateNumberType,
  validatePositiveNumber,
  validateStringType,
} from '../../utils/validation-utils';

export const makeSearchGuildMemberById = ({
  guildDb,
}: {
  guildDb: GuildDb;
}) => {
  const searchGuildMemberById = async (
    guild: IGuild,
    searchQuery: string,
    limit: number,
  ) => {
    requiredParam(guild, 'Guild');
    requiredParam(searchQuery, 'Search query');
    requiredParam(limit, 'Limit');

    validateStringType(searchQuery, 'Search query');
    validateNumberType(limit, 'Limit');

    validatePositiveNumber(limit, 'Limit');

    makeGuild(guild);

    return guildDb.findMembersByGuild(guild._id, searchQuery, limit);
  };
  return searchGuildMemberById;
};
