import { makeCharacter } from '../../character/character';
import { CharacterDb } from '../../data-access/types/data-access.type';
import { ICharacterWithoutId } from '../../types/character.type';
import { InvalidPropertyError } from '../../utils/errors';
import { requiredParam } from '../../utils/validation-utils';

export const makeUpdateCharacterAttributeById = ({
  characterDb,
}: {
  characterDb: CharacterDb;
}) => {
  const updateCharacterAttributeById = async (
    id: string,
    query: Partial<ICharacterWithoutId>,
  ) => {
    requiredParam(id, 'Id');
    requiredParam(query, 'Attribute and attribute value');

    const character = await characterDb.findById(id);

    for (const key in query) {
      if (!(key in character)) {
        throw new InvalidPropertyError(`Invalid property: ${key}`);
      }

      const expectedType = typeof character[key as keyof ICharacterWithoutId];
      const actualType = typeof query[key as keyof ICharacterWithoutId];

      if (expectedType !== actualType) {
        throw new InvalidPropertyError(
          `Invalid type for property ${key}. Expected ${expectedType}, got ${actualType}.`,
        );
      }
    }

    makeCharacter({ ...character, ...query });

    return characterDb.updateById(id, query);
  };
  return updateCharacterAttributeById;
};
