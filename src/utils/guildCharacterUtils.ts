import { ICharacterDocument, Character } from "../models/characterModel";
import { Guild, IGuildDocument } from "../models/guildModel";

export const joinGuild = async (characterId: string, guildId: IGuildDocument) => {
  try {
    await Promise.all([
      Character.findByIdAndUpdate(characterId, { guild: guildId }),
      Guild.findByIdAndUpdate(
        guildId,
        {
          $push: { members: characterId as unknown as IGuildDocument },
          $inc: { totalMembers: 1 }
        }
      )
    ]);
  } catch (error) {
    throw new Error('Failed to join guild', error.message);
  }
};
  
export const leaveGuild = async (characterId: string) => {
  try {
    const character: ICharacterDocument | null = await Character.findById(characterId);
    const guildId = character.guild as IGuildDocument;

    await Promise.all([
      Character.findByIdAndUpdate(characterId, { guild: null }),
      Guild.findByIdAndUpdate(
        guildId,
        {
          $pull: { members: characterId as unknown as IGuildDocument },
          $inc: { totalMembers: -1 }
        }
      )
    ]);
  } catch (error) {
    throw new Error('Failed to leave guild', error.message);
  }
};
  
export const updateLeaderAndDeleteGuild = async (guild: IGuildDocument) => {
  try {
    const guildId = guild._id;
    const leaderId = guild.leader.toString();
    
    await Promise.all([
      Character.updateMany(
        { _id: { $in: guild.members } },
        { $unset: { guild: 1 } }
      ),
      Character.findByIdAndUpdate(leaderId, { $unset: { guild: 1 } }),
      Guild.findByIdAndDelete(guildId)
    ]);
  } catch (error) {
    throw new Error('Failed to remove all members and delete guild', error.message);
  }
}

export const updateLeaderOrMembersGuild = async (guild: IGuildDocument, memberId: string) => {
  try {
    if (isLeader(guild, memberId)) {
      await updateLeaderAndDeleteGuild(guild);
    } else {
      await leaveGuild(memberId);
    }
  } catch (error) {
    throw new Error(`Failed to update leader and members guild: ${error.message}`);
  }
};

export function isLeader(guild: IGuildDocument, memberId: string): boolean {
  return guild && guild.leader.toString() === memberId;
}

export function isDifferentGuild(guild: IGuildDocument, oldGuildId: string): boolean {
  return guild && guild._id.toString() !== oldGuildId;
}
