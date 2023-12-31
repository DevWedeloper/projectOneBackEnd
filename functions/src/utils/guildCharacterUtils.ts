import * as Character from '../models/characterModel';
import * as Guild from '../models/guildModel';
import { ICharacter } from '../types/characterType';
import { IGuild } from '../types/guildType';

export const joinGuild = async (
  character: ICharacter,
  guild: IGuild
) => {
  try {
    const checkGuild = await Guild.findById(guild._id);
    if (checkGuild.totalMembers >= checkGuild.maxMembers) {
      throw new Error('Guild is full. Cannot add more members.');
    }

    await Promise.all([
      Character.updateById(character._id, { guild }),
      Guild.addCharacterToGuild(character, guild)
    ]);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error('Failed to join guild: ' + error.message);
    }
  }
};

export const leaveGuild = async (characterId: string) => {
  try {
    const character = await Character.findById(
      characterId
    );

    await Promise.all([
      Character.updateById(characterId, { guild: null }),
      Guild.removeCharacterFromGuild(character),
    ]);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error('Failed to leave guild:' + error.message);
    }
  }
};

export const updateLeaderAndDeleteGuild = async (guild: IGuild) => {
  try {
    if (!guild.members) {
      throw new Error('No guild members found');
    }

    await Promise.all([
      Character.membersLeaveGuild(guild.members),
      Character.updateById(guild.leader._id.toString(), { guild: null }),
      Guild.deleteById(guild._id.toString()),
    ]);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(
        'Failed to remove all members and delete guild:' + error.message
      );
    }
  }
};

export const updateLeaderOrMembersGuild = async (
  guild: IGuild,
  memberId: string
) => {
  try {
    if (isLeader(guild, memberId)) {
      await updateLeaderAndDeleteGuild(guild);
    } else if (!isLeader(guild, memberId)) {
      await leaveGuild(memberId);
    } else {
      throw new Error('Is leader condition was not satisfied');
    }
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(
        `Failed to update leader and members guild: ${error.message}`
      );
    }
  }
};

export function isLeader(guild: IGuild, memberId: string): boolean {
  return guild && guild.leader._id.toString() === memberId.toString();
}

export function isDifferentGuild(
  guild: IGuild,
  oldGuildId: string
): boolean {
  return guild && guild._id.toString() !== oldGuildId.toString();
}
