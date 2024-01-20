import { CharacterDb } from '../../data-access/types/data-access.type';

export const makeGetPaginatedWithoutGuild = ({
  characterDb,
}: {
  characterDb: CharacterDb;
}) => {
  const getAllWithoutGuild = async () => {
    return characterDb.getAllWithoutGuild();
  };
  return getAllWithoutGuild;
};
