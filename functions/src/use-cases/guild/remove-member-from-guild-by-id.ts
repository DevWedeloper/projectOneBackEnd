import { guildCharacterUtils } from '..';
import { makeCharacter } from '../../character/character';
import { GuildDb } from '../../data-access/types/data-access.type';
import { makeGuild } from '../../guild/guild';
import { ICharacter } from '../../types/character.type';
import { IGuild } from '../../types/guild.type';
import { InvalidOperationError } from '../../utils/errors';
import { requiredParam } from '../../utils/validation-utils';

export const makeRemoveMemberFromGuildById = ({
  guildDb,
}: {
  guildDb: GuildDb;
}) => {
  const removeMemberFromGuildById = async (
    id: string,
    guild: IGuild,
    character: ICharacter,
  ) => {
    requiredParam(id, 'Id');
    requiredParam(guild, 'Guild');
    requiredParam(character, 'Character');

    makeGuild(guild);
    makeCharacter(character);

    if (
      !character.guild ||
      (character.guild &&
        guildCharacterUtils.isDifferentGuild(character.guild, id))
    ) {
      throw new InvalidOperationError('Character is not a part of the guild');
    }

    if (guildCharacterUtils.isLeader(guild, character._id)) {
      throw new InvalidOperationError('Cannot kick the leader of the guild');
    }

    await guildCharacterUtils.leaveGuild(character._id);

    return guildDb.findById(id);
  };
  return removeMemberFromGuildById;
};
