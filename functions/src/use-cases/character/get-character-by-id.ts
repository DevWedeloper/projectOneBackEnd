import { CharacterDb } from '../../data-access/types/data-access.type';
import { requiredParam } from '../../utils/validation-utils';

export const makeGetCharacterById = ({
  characterDb,
}: {
  characterDb: CharacterDb;
}) => {
  const getCharacterById = async (id: string) => {
    requiredParam(id, 'Id');
    return characterDb.findById(id);
  };
  return getCharacterById;
};
