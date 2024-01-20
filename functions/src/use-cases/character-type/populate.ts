import { CharacterTypeDb } from '../../data-access/types/data-access.type';
import { ICharacterTypeWithoutId } from '../../types/characterTypeType';

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
