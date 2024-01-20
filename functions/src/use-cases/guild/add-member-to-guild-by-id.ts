import { guildCharacterUtils } from '..';
import { makeCharacter } from '../../character/character';
import { GuildDb } from '../../data-access/types/data-access.type';
import { makeGuild } from '../../guild/guild';
import { ICharacter } from '../../types/characterType';
import { IGuild } from '../../types/guildType';
import {
  InvalidOperationError
} from '../../utils/errors';
import { requiredParam } from '../../utils/validation-utils';

export const makeAddMemberToGuildById = ({ guildDb }: { guildDb: GuildDb }) => {
  const addMemberToGuildById = async (
    id: string,
    guild: IGuild,
    character: ICharacter
  ) => {
    requiredParam(id, 'Id');
    requiredParam(guild, 'Guild');
    requiredParam(character, 'Character');

    makeGuild(guild);
    makeCharacter(character);

    if (
      character.guild &&
      !guildCharacterUtils.isDifferentGuild(character.guild, id)
    ) {
      throw new InvalidOperationError(
        'Member is already a member or leader of the guild'
      );
    }

    if (
      character.guild &&
      guildCharacterUtils.isDifferentGuild(character.guild, id)
    ) {
      const previousGuild = await guildDb.findById(character.guild._id);
      await guildCharacterUtils.updateLeaderOrMembersGuild(
        previousGuild,
        character._id
      );
    }

    await guildCharacterUtils.joinGuild(character, guild);

    return guildDb.findById(id);
  };
  return addMemberToGuildById;
};
