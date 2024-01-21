import { CharacterDb, GuildDb } from '../../data-access/types/data-access.type';

export const makeDeleteAllCharacters = ({
  characterDb,
  guildDb,
}: {
  characterDb: CharacterDb;
  guildDb: GuildDb;
}) => {
  const deleteAllCharacters = async () => {
    const [characterDeletionResult, guildDeletionResult] = await Promise.all([
      characterDb.deleteAll(),
      guildDb.deleteAll(),
    ]);
    return { characterDeletionResult, guildDeletionResult };
  };
  return deleteAllCharacters;
};
