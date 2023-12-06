import * as Character from '../models/characterModel';
import { ICharacter } from '../models/characterModel';
import * as Guild from '../models/guildModel';
import { IGuild } from '../models/guildModel';

export const joinGuild = async (
  character: ICharacter,
  guild: IGuild
) => {
  try {
    const checkGuild = await Guild.findById(guild._id);
    if (checkGuild && checkGuild.totalMembers >= checkGuild.maxMembers) {
      throw new Error('Guild is full. Cannot add more members.');
    }

    await Promise.all([
      Character.updateById(character._id, { guild: guild._id }),
      Guild.updateById(guild._id, {
        $push: { members: character },
        $inc: {
          totalMembers: 1,
          totalHealth: character.health || 0,
          totalStrength: character.strength || 0,
          totalAgility: character.agility || 0,
          totalIntelligence: character.intelligence || 0,
          totalArmor: character.armor || 0,
          totalCritChance: character.critChance || 0,
        },
      }),
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

    if (!character) {
      throw new Error('Character doesn\'t exist');
    }

    if (!character.guild) {
      throw new Error('Character guild doesn\'t exist');
    }

    await Promise.all([
      Character.updateById(characterId, { guild: null }),
      Guild.updateById(character.guild._id, {
        $pull: { members: characterId },
        $inc: {
          totalMembers: -1,
          totalHealth: -(character?.health || 0),
          totalStrength: -(character?.strength || 0),
          totalAgility: -(character?.agility || 0),
          totalIntelligence: -(character?.intelligence || 0),
          totalArmor: -(character?.armor || 0),
          totalCritChance: -(character?.critChance || 0),
        },
      }),
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
      Character.updateById(guild.leader._id.toString(), { $unset: { guild: 1 } }),
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
