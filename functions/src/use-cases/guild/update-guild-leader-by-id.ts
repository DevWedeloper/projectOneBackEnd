import { guildCharacterUtils } from '..';
import { makeCharacter } from '../../character/character';
import { GuildDb } from '../../data-access/types/data-access.type';
import { makeGuild } from '../../guild/guild';
import { ICharacter } from '../../types/character.type';
import { IGuild } from '../../types/guild.type';
import { InvalidOperationError } from '../../utils/errors';
import { requiredParam } from '../../utils/validation-utils';

export const makeUpdateGuildLeaderById = ({
  guildDb,
}: {
  guildDb: GuildDb;
}) => {
  const updateGuildLeaderById = async (
    id: string,
    guild: IGuild,
    character: ICharacter,
  ) => {
    requiredParam(id, 'Id');
    requiredParam(guild, 'Guild');
    requiredParam(character, 'Character');

    makeGuild(guild);
    makeCharacter(character);

    const isChangingLeader: boolean =
      character && character.toString() !== guild.leader.toString();
    if (isChangingLeader) {
      const isLeaderNotMemberOfGuild: boolean =
        !character.guild ||
        guildCharacterUtils.isDifferentGuild(character.guild, id);
      if (isLeaderNotMemberOfGuild) {
        throw new InvalidOperationError(
          'New leader must be a member of the guild',
        );
      }
    }

    makeGuild({ ...guild, ...{ leader: character } });

    return guildDb.updateById(id, { leader: character });
  };
  return updateGuildLeaderById;
};
