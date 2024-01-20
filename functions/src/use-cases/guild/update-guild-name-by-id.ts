import { GuildDb } from '../../data-access/types/data-access.type';
import { makeGuild } from '../../guild/guild';
import {
  requiredParam,
  validateStringType,
} from '../../utils/validation-utils';

export const makeUpdateGuildNameById = ({ guildDb }: { guildDb: GuildDb }) => {
  const updateGuildNameById = async (id: string, name: string) => {
    requiredParam(id, 'Id');
    requiredParam(name, 'Name');

    validateStringType(name, 'Name');

    const guild = await guildDb.findById(id);
    makeGuild({ ...guild, name });

    return guildDb.updateById(id, { name });
  };
  return updateGuildNameById;
};
