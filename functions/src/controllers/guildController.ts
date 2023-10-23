import { Request, Response } from 'express';
import { Guild, IGuildDocument } from '../models/guildModel';
import { Character, ICharacterDocument } from '../models/characterModel';
import {
  joinGuild,
  leaveGuild,
  updateLeaderAndDeleteGuild,
  updateLeaderOrMembersGuild,
  isLeader,
  isDifferentGuild,
} from '../utils/guildCharacterUtils';

export const createGuild = async (
  req: Request,
  res: Response
): Promise<void | Response> => {
  try {
    const { name, leader } = req.body;
    const leaderCharacter = await Character.findById(leader);
    if (!leaderCharacter) {
      return res.status(404).json({ error: 'Character not found' });
    }

    const leaderHasPreviousGuild: boolean =
      leaderCharacter && leaderCharacter.guild ? true : false;
    if (leaderHasPreviousGuild) {
      const guild = await Guild.findById(leaderCharacter.guild);
      if (guild) {
        await updateLeaderOrMembersGuild(guild, leaderCharacter._id.toString());
      }
    }

    const totalMembers = 1;
    const guildData = {
      name,
      leader,
      totalMembers,
    };

    const savedGuild = await Guild.create(guildData);

    await Character.findOneAndUpdate(
      { _id: leaderCharacter._id },
      { $set: { guild: savedGuild._id } }
    );

    return res
      .status(201)
      .json({ message: 'Guild created successfully', guild: savedGuild });
  } catch (error) {
    if (error instanceof Error) {
      return res
        .status(500)
        .json({ error: 'Failed to create the guild', message: error.message });
    }
  }
};

export const getAllGuilds = async (
  req: Request,
  res: Response
): Promise<void | Response> => {
  try {
    const page: number = parseInt(req.query.page as string) || 1;
    const pageSize: number = parseInt(req.query.pageSize as string) || 10;
    const sortBy: string = (req.query.sortBy as string) || 'name';
    const sortOrder: string = (req.query.sortOrder as string) || 'asc';
    const searchQuery: string = (req.query.search as string) || '';

    const sortCriteria: { [key: string]: 'asc' | 'desc' } = {};
    sortCriteria[sortBy] = sortOrder === 'asc' ? 'asc' : 'desc';

    const query: {
      $or: Array<{
        name?: { $regex: string; $options: string };
        leader?: { $in: string[] };
        totalMembers?: number;
      }>;
    } = {
      $or: [
        { name: { $regex: searchQuery, $options: 'i' } },
        { leader: { $in: await getLeaderIdsByCharacterName(searchQuery) } },
      ],
    };

    if (searchQuery && !isNaN(parseInt(searchQuery))) {
      query.$or.push({ totalMembers: parseInt(searchQuery) });
    }

    const totalGuilds: number = await Guild.countDocuments(query);
    const totalPages: number = Math.ceil(totalGuilds / pageSize);

    const guildsQuery = Guild.find(query)
      .sort(sortCriteria)
      .populate({
        path: 'leader members',
        select: 'name _id',
      })
      .skip((page - 1) * pageSize)
      .limit(pageSize);

    const guilds: IGuildDocument[] = await guildsQuery;

    return res.json({
      page,
      pageSize,
      totalPages,
      totalGuilds,
      guilds,
    });
  } catch (error) {
    if (error instanceof Error) {
      return res
        .status(500)
        .json({ error: 'Failed to retrieve guilds', message: error.message });
    }
  }
};

export const getGuildById = async (
  req: Request,
  res: Response
): Promise<void | Response> => {
  try {
    const { id } = req.params;
    const guild = await Guild.findById(id).populate(
      'leader members',
      'name _id'
    );
    if (!guild) {
      return res.status(404).json({ error: 'Guild not found' });
    }

    return res.json(guild);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({
        error: 'Failed to retrieve the guild',
        message: error.message,
      });
    }
  }
};

export const searchGuildsByName = async (
  req: Request,
  res: Response
): Promise<void | Response> => {
  try {
    const searchQuery = req.query.name as string;
    const guild = await Guild.find({
      name: { $regex: searchQuery, $options: 'i' },
    });

    return res.json(guild);
  } catch (error) {
    if (error instanceof Error) {
      return res
        .status(500)
        .json({ error: 'Error searching guilds', message: error.message });
    }
  }
};

export const searchGuildMemberById = async (
  req: Request,
  res: Response
): Promise<void | Response> => {
  try {
    const searchQuery = req.query.name as string;
    const { guild } = req.body;
    const memberObjects = await Character.find({ _id: { $in: guild.members } });
    const searchResults = memberObjects.filter((member) =>
      member.name.includes(searchQuery)
    );

    return res.status(200).json(searchResults);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({
        error: 'Error searching guild members',
        message: error.message,
      });
    }
  }
};

export const updateGuildNameById = async (
  req: Request,
  res: Response
): Promise<void | Response> => {
  try {
    const { id } = req.params;
    const { name, ...guildDataToUpdate }: Partial<IGuildDocument> = req.body;

    const updatedGuild = await Guild.findByIdAndUpdate(
      id,
      { ...guildDataToUpdate, name: name },
      { new: true, runValidators: true }
    ).populate({
      path: 'leader members',
      select: '_id name',
    });

    if (!updatedGuild) {
      return res.status(404).json({ error: 'Failed to update the guild' });
    }

    return res.json({
      message: 'Guild name updated successfully',
      guild: updatedGuild,
    });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({
        error: 'Failed to update the guild name',
        message: error.message,
      });
    }
  }
};

export const updateGuildLeaderById = async (
  req: Request,
  res: Response
): Promise<void | Response> => {
  try {
    const { id } = req.params;
    const { guild, character, ...guildDataToUpdate } = req.body;

    const newLeader: ICharacterDocument | null = await Character.findById(
      character
    );
    if (!newLeader) {
      return res.status(404).json({ error: 'New leader not found' });
    }

    const isChangingLeader: boolean =
      newLeader && newLeader.toString() !== guild.leader.toString();
    if (isChangingLeader) {
      const isLeaderNotMemberOfGuild: boolean =
        !newLeader.guild ||
        isDifferentGuild(newLeader.guild as IGuildDocument, id);
      if (isLeaderNotMemberOfGuild) {
        return res
          .status(400)
          .json({ error: 'New leader must be a member of the guild' });
      }

      const previousLeader = await Character.findById(guild.leader);
      if (previousLeader && previousLeader.guild) {
        await joinGuild(previousLeader._id, guild._id);
      }

      await leaveGuild(newLeader._id);
      await Character.findOneAndUpdate(
        { _id: newLeader._id },
        { $set: { guild: guild._id } }
      );
    }

    const updatedGuild = await Guild.findByIdAndUpdate(
      id,
      { ...guildDataToUpdate, leader: newLeader },
      { new: true }
    ).populate({
      path: 'leader members',
      select: '_id name',
    });

    if (!updatedGuild) {
      return res.status(404).json({ error: 'Failed to update the guild' });
    }

    return res.json({
      message: 'Guild leader updated successfully',
      guild: updatedGuild,
    });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({
        error: 'Failed to update the guild leader',
        message: error.message,
      });
    }
  }
};

export const addMemberToGuildById = async (
  req: Request,
  res: Response
): Promise<void | Response> => {
  try {
    const { id } = req.params;
    const { guild, character } = req.body;

    const newMember = await Character.findById(character);
    if (!newMember) {
      return res.status(404).json({ error: 'Member not found' });
    }

    if (
      newMember.guild &&
      !isDifferentGuild(newMember.guild as IGuildDocument, id)
    ) {
      return res
        .status(400)
        .json({ error: 'Member is already a member or leader of the guild' });
    }

    if (
      newMember.guild &&
      isDifferentGuild(newMember.guild as IGuildDocument, id)
    ) {
      const previousGuild = await Guild.findById(newMember.guild);
      if (!previousGuild) {
        return res.status(404).json({ error: 'Guild not found' });
      }

      await updateLeaderOrMembersGuild(previousGuild, newMember._id.toString());
    }

    await joinGuild(newMember._id, guild);
    const updatedGuild = await Guild.findById(id).populate({
      path: 'leader members',
      select: '_id name',
    });
    if (!updatedGuild) {
      return res.status(404).json({ error: 'Guild not found' });
    }

    return res.json({
      message: 'Member added to guild successfully',
      guild: updatedGuild,
    });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({
        error: 'Failed to add member to the guild',
        message: error.message,
      });
    }
  }
};

export const removeMemberFromGuildById = async (
  req: Request,
  res: Response
): Promise<void | Response> => {
  try {
    const { id } = req.params;
    const { guild, member } = req.body;

    const newMember = await Character.findById(member);
    if (!newMember) {
      return res.status(404).json({ error: 'Member not found' });
    }

    if (
      !newMember.guild ||
      (newMember.guild &&
        isDifferentGuild(newMember.guild as IGuildDocument, id))
    ) {
      return res
        .status(400)
        .json({ error: 'Member is not a part of the guild' });
    }

    if (isLeader(guild, newMember._id.toString())) {
      return res
        .status(403)
        .json({ error: 'Cannot kick the leader of the guild' });
    }

    await leaveGuild(newMember._id);
    const updatedGuild = await Guild.findById(id).populate({
      path: 'leader members',
      select: '_id name',
    });
    if (!updatedGuild) {
      return res.status(404).json({ error: 'Guild not found' });
    }

    return res.json({
      message: 'Member removed from guild successfully',
      guild: updatedGuild,
    });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({
        error: 'Failed to add member to the guild',
        message: error.message,
      });
    }
  }
};

export const deleteGuildById = async (
  req: Request,
  res: Response
): Promise<void | Response> => {
  try {
    const { guild } = req.body;
    const leaderCharacter = await Character.findById(guild.leader);
    if (!leaderCharacter) {
      return res.status(404).json({ error: 'Leader not found' });
    }

    await updateLeaderAndDeleteGuild(guild);
    return res.json({ message: 'Guild deleted successfully', guild: guild });
  } catch (error) {
    if (error instanceof Error) {
      return res
        .status(500)
        .json({ error: 'Failed to delete the guild', message: error.message });
    }
  }
};

export const deleteAllGuilds = async (
  req: Request,
  res: Response
): Promise<void | Response> => {
  try {
    const guilds = await Guild.find({});
    const deletePromises = guilds.map((guild) =>
      updateLeaderAndDeleteGuild(guild)
    );
    await Promise.all(deletePromises);
    return res.json({
      message: `${guilds.length} guilds deleted successfully.`,
    });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ error: 'Failed to delete guilds' });
    }
  }
};

const getLeaderIdsByCharacterName = async (
  leaderName: string
): Promise<string[]> => {
  const leaderSearchResults = await Character.find({
    name: { $regex: leaderName, $options: 'i' },
  }).distinct('_id');

  return leaderSearchResults.map((leader) => leader._id);
};
