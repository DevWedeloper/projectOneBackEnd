import { makeCharacter } from '../../character/character';
import { CharacterDb, GuildDb } from '../../data-access/types/data-access.type';
import { makeGuild } from '../../guild/guild';
import { ICharacter } from '../../types/character.type';
import { IGuild } from '../../types/guild.type';
import { InvalidOperationError } from '../../utils/errors';

export const makeGuildCharacterUtils = ({
  characterDb,
  guildDb,
}: {
  characterDb: CharacterDb;
  guildDb: GuildDb;
}) => {
  const joinGuild = async (character: ICharacter, guild: IGuild) => {
    const checkGuild = await guildDb.findById(guild._id);
    makeGuild(checkGuild);
    makeCharacter({ ...character, ...guild });

    await Promise.all([
      characterDb.updateById(character._id, { guild }),
      guildDb.addCharacterToGuild(character, guild),
    ]);
  };

  const leaveGuild = async (characterId: string) => {
    const character = await characterDb.findById(characterId);
    makeCharacter({ ...character, ...{ guild: null } });

    await Promise.all([
      characterDb.updateById(characterId, { guild: null }),
      guildDb.removeCharacterFromGuild(character),
    ]);
  };

  const updateLeaderAndDeleteGuild = async (guild: IGuild) => {
    const foundGuild = await guildDb.findById(guild._id);
    if (!foundGuild.members) {
      throw new InvalidOperationError('No guild members found');
    }

    await Promise.all([
      characterDb.membersLeaveGuild(guild.members),
      characterDb.updateById(guild.leader._id.toString(), { guild: null }),
      guildDb.deleteById(guild._id.toString()),
    ]);
  };

  const updateLeaderOrMembersGuild = async (
    guild: IGuild,
    memberId: string,
  ) => {
    if (isLeader(guild, memberId)) {
      await updateLeaderAndDeleteGuild(guild);
    } else if (!isLeader(guild, memberId)) {
      await leaveGuild(memberId);
    } else {
      throw new InvalidOperationError('Is leader condition was not satisfied');
    }
  };

  const isLeader = (guild: IGuild, memberId: string): boolean => {
    return guild && guild.leader._id.toString() === memberId.toString();
  };

  const isDifferentGuild = (guild: IGuild, oldGuildId: string): boolean => {
    return guild && guild._id.toString() !== oldGuildId.toString();
  };

  return Object.freeze({
    joinGuild,
    leaveGuild,
    updateLeaderAndDeleteGuild,
    updateLeaderOrMembersGuild,
    isLeader,
    isDifferentGuild,
  });
};
