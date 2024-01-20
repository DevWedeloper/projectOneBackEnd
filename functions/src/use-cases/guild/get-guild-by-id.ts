import { GuildDb } from '../../data-access/types/data-access.type';
import { requiredParam } from '../../utils/validation-utils';

export const makeGetGuildById = ({ guildDb }: { guildDb: GuildDb }) => {
  const getGuildById = async (id: string) => {
    requiredParam(id, 'Id');
    return guildDb.findById(id);
  };
  return getGuildById;
};
