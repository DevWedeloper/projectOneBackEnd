import { GuildDb } from '../../data-access/types/data-access.type';

export const makeGetAllGuilds = ({ guildDb }: { guildDb: GuildDb }) => {
  const getAllGuilds = async () => {
    return guildDb.getAll();
  };
  return getAllGuilds;
};
