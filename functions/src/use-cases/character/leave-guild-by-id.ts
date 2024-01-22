import { guildCharacterUtils } from '..';
import { CharacterDb, GuildDb } from '../../data-access/types/data-access.type';
import { ICharacter } from '../../types/character.type';
import { InvalidOperationError } from '../../utils/errors';
import { requiredParam } from '../../utils/validation-utils';

export const makeLeaveGuildById = ({
  characterDb,
  guildDb,
}: {
  characterDb: CharacterDb;
  guildDb: GuildDb;
}) => {
  const leaveGuildById = async (id: string, character: ICharacter) => {
    requiredParam(id, 'Id');
    requiredParam(character, 'Character');

    if (!character.guild) {
      throw new InvalidOperationError('Character does not have a guild.');
    }

    const previousGuild = await guildDb.findById(character.guild._id);

    await guildCharacterUtils.updateLeaderOrMembersGuild(previousGuild, id);

    return characterDb.findById(id);
  };
  return leaveGuildById;
};
