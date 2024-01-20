import { GuildDb } from '../../data-access/types/data-access.type';
import { requiredParam } from '../../utils/validation-utils';

export const makeIsGuildUnique = ({ guildDb }: { guildDb: GuildDb }) => {
  const isGuildUnique = async (name: string) => {
    requiredParam(name, 'Name');
    const existingGuild = await guildDb.isUnique({ name });
    if (existingGuild) {
      return 'Guild name is not unique';
    } else {
      return 'Guild name is unique';
    }
  };
  return isGuildUnique;
};
