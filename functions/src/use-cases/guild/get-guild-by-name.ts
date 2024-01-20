import { GuildDb } from '../../data-access/types/data-access.type';
import {
  requiredParam,
  validateStringType,
} from '../../utils/validation-utils';

export const makeGetGuildByName = ({ guildDb }: { guildDb: GuildDb }) => {
  const getGuildByName = async (name: string) => {
    requiredParam(name, 'Name');
    validateStringType(name, 'Name');
    return guildDb.findByName(name);
  };
  return getGuildByName;
};
