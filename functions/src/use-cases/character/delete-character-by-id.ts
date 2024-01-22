import { guildCharacterUtils } from '..';
import { makeCharacter } from '../../character/character';
import { CharacterDb } from '../../data-access/types/data-access.type';
import { ICharacter } from '../../types/character.type';
import { requiredParam } from '../../utils/validation-utils';

export const makeDeleteCharacterById = ({
  characterDb,
}: {
  characterDb: CharacterDb;
}) => {
  const deleteCharacterById = async (id: string, character: ICharacter) => {
    requiredParam(id, 'Id');
    requiredParam(character, 'Character');

    makeCharacter(character);

    if (character.guild) {
      if (guildCharacterUtils.isLeader(character.guild, id)) {
        await guildCharacterUtils.updateLeaderAndDeleteGuild(character.guild);
      } else {
        await guildCharacterUtils.leaveGuild(id);
      }
    }

    return characterDb.deleteById(id);
  };
  return deleteCharacterById;
};
