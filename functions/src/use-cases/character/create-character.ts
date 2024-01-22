import { makeCharacter } from '../../character/character';
import { CharacterDb } from '../../data-access/types/data-access.type';
import { ICharacterWithoutId } from '../../types/character.type';

export const makeCreateCharacter = ({
  characterDb,
}: {
  characterDb: CharacterDb;
}) => {
  const createCharacter = async (data: ICharacterWithoutId) => {
    const character = makeCharacter(data);
    return characterDb.create(character);
  };
  return createCharacter;
};
