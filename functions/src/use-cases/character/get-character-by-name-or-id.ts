import { isValidObject } from '../../data-access/is-valid-object';
import { CharacterDb } from '../../data-access/types/data-access.type';
import { requiredParam } from '../../utils/validation-utils';

export const makeGetCharacterByNameOrId = ({
  characterDb,
}: {
  characterDb: CharacterDb;
}) => {
  const getCharacterByNameOrId = async (character: string) => {
    requiredParam(character, 'Character');

    const characterQuery = isValidObject(character)
      ? { _id: character }
      : { name: character };

    return characterDb.findOneByNameOrId(characterQuery);
  };
  return getCharacterByNameOrId;
};
