import { CharacterDb } from '../../data-access/types/data-access.type';
import {
  requiredParam,
  validateStringType,
} from '../../utils/validation-utils';

export const makeGetCharacterByName = ({
  characterDb,
}: {
  characterDb: CharacterDb;
}) => {
  const getCharacterByName = async (name: string) => {
    requiredParam(name, 'Name');
    validateStringType(name, 'Name');
    return characterDb.findByName(name);
  };
  return getCharacterByName;
};
