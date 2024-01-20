import { CharacterTypeDb } from '../../data-access/types/data-access.type';

export const makeGetPaginatedCharacterTypes = ({
  characterTypeDb,
}: {
  characterTypeDb: CharacterTypeDb;
}) => {
  const getAllCharacterTypes = async () => {
    return characterTypeDb.getAll();
  };
  return getAllCharacterTypes;
};
