import { CharacterTypeDb } from '../../data-access/types/data-access.type';
import { requiredParam } from '../../utils/validation-utils';

export const makeGetCharacterType = ({
  characterTypeDb,
}: {
  characterTypeDb: CharacterTypeDb;
}) => {
  const getCharacterType = async (characterType: string) => {
    requiredParam(characterType, 'Character Type');
    return characterTypeDb.findOne(characterType);
  };
  return getCharacterType;
};
