import { ICharacter, Character } from '../models/characterModel';
import { Guild, IGuild } from '../models/guildModel';

export const joinGuild = async (
  character: ICharacter,
  guild: IGuild
) => {
  try {
    const checkGuild = await Guild.findById(guild._id).
      populate({
        path: 'leader members',
        select: 'name _id critChance',
      });
    if (checkGuild && checkGuild.totalMembers >= checkGuild.maxMembers) {
      throw new Error('Guild is full. Cannot add more members.');
    }

    await Promise.all([
      Character.findByIdAndUpdate(character._id, { guild: guild._id }),
      Guild.findByIdAndUpdate(guild, {
        $push: { members: character as unknown as IGuild },
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
    const character: ICharacter | null = await Character.findById(
      characterId
    );
    const guildId = character!.guild as IGuild;

    await Promise.all([
      Character.findByIdAndUpdate(characterId, { guild: null }),
      Guild.findByIdAndUpdate(guildId, {
        $pull: { members: characterId as unknown as IGuild },
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
    const guildId = guild._id;
    const leaderId = guild.leader._id.toString();

    await Promise.all([
      Character.updateMany(
        { _id: { $in: guild.members } },
        { $unset: { guild: 1 } }
      ),
      Character.findByIdAndUpdate(leaderId, { $unset: { guild: 1 } }),
      Guild.findByIdAndDelete(guildId),
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
    } else {
      await leaveGuild(memberId);
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
