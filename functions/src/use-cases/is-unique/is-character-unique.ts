import { CharacterDb } from '../../data-access/types/data-access.type';
import { requiredParam } from '../../utils/validation-utils';

export const makeIsCharacterUnique = ({
  characterDb,
}: {
  characterDb: CharacterDb;
}) => {
  const isCharacterUnique = async (name: string) => {
    requiredParam(name, 'Name');
    const existingCharacter = await characterDb.isUnique({ name });
    if (existingCharacter) {
      return 'Character name is not unique';
    } else {
      return 'Character name is unique';
    }
  };
  return isCharacterUnique;
};
