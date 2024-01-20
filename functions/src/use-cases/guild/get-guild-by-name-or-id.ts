import { isValidObject } from '../../data-access/is-valid-object';
import { GuildDb } from '../../data-access/types/data-access.type';
import { requiredParam } from '../../utils/validation-utils';

export const makeGetGuildByNameOrId = ({ guildDb }: { guildDb: GuildDb }) => {
  const getGuildByNameOrId = async (guild: string) => {
    requiredParam(guild, 'Guild');

    const guildQuery = isValidObject(guild) ? { _id: guild } : { name: guild };

    return guildDb.findOneByNameOrId(guildQuery);
  };
  return getGuildByNameOrId;
};
