import { guildCharacterUtils } from '..';
import { makeCharacter } from '../../character/character';
import { CharacterDb, GuildDb } from '../../data-access/types/data-access.type';
import { makeGuild } from '../../guild/guild';
import { ICharacter } from '../../types/character.type';
import { IGuild } from '../../types/guild.type';
import { InvalidOperationError } from '../../utils/errors';
import { requiredParam } from '../../utils/validation-utils';

export const makeJoinGuildById = ({
  characterDb,
  guildDb,
}: {
  characterDb: CharacterDb;
  guildDb: GuildDb;
}) => {
  const joinGuildById = async (
    id: string,
    character: ICharacter,
    guild: IGuild,
  ) => {
    requiredParam(id, 'Id');
    requiredParam(character, 'Character');
    requiredParam(guild, 'Guild');

    makeCharacter(character);
    makeGuild(guild);

    if (character.guild) {
      const previousGuild = await guildDb.findById(character.guild._id);
      if (
        guildCharacterUtils.isDifferentGuild(
          previousGuild,
          guild._id.toString(),
        )
      ) {
        await guildCharacterUtils.updateLeaderOrMembersGuild(previousGuild, id);
      } else {
        throw new InvalidOperationError('Already a member of this guild');
      }
    }

    await guildCharacterUtils.joinGuild(character, guild);

    return characterDb.findById(id);
  };
  return joinGuildById;
};
