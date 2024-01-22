import { CharacterTypeDb } from '../../data-access/types/data-access.type';
import { ICharacterTypeWithoutId } from '../../types/character-type.type';

export const makePopulate = ({
  characterTypeDb,
}: {
  characterTypeDb: CharacterTypeDb;
}) => {
  const populate = async (data: ICharacterTypeWithoutId[]) => {
    return characterTypeDb.populate(data);
  };
  return populate;
};
