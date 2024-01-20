import {
  CharacterDb,
  GuildDb,
} from '../../data-access/types/data-access.type';

export const makeDeleteAllGuilds = ({
  characterDb,
  guildDb,
}: {
  characterDb: CharacterDb;
  guildDb: GuildDb;
}) => {
  const deleteAllGuilds = async () => {
    const result = await guildDb.deleteAll();
    await characterDb.leaveAllGuild();
    
    return result;
  };
  return deleteAllGuilds;
};
