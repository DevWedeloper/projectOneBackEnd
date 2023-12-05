import { Request, Response } from 'express';
import * as CharacterModel from '../models/characterModel';
import { Character } from '../models/characterModel';
import * as GuildModel from '../models/guildModel';
import { Guild, IGuild } from '../models/guildModel';
import {
  isDifferentGuild,
  isLeader,
  joinGuild,
  leaveGuild,
  updateLeaderAndDeleteGuild,
  updateLeaderOrMembersGuild,
} from '../utils/guildCharacterUtils';

export const createGuild = async (
  req: Request,
  res: Response
): Promise<void | Response> => {
  try {
    const { name, character } = req.body;
    if (character.guild) {
      await updateLeaderOrMembersGuild(
        character.guild as IGuild,
        character._id.toString()
      );
    }

    const guildData = {
      name,
      leader: character,
      totalMembers: 1,
      maxMembers: 50,
    };

    const guild = await GuildModel.create(guildData);
    await CharacterModel.updateById(character._id, { guild: guild._id });
    return res
      .status(201)
      .json({ message: 'Guild created successfully', guild });
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
    const sortOrder: 'asc' | 'desc' =
      (req.query.sortOrder as 'asc' | 'desc') || 'asc';
    const searchQuery: string = (req.query.search as string) || '';

    const guilds = await GuildModel.getAll(
      page,
      pageSize,
      sortBy,
      sortOrder,
      searchQuery
    );
    return res.status(200).json(guilds);
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

    const guild = await GuildModel.findById(id);
    return res.status(200).json(guild);
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
    const limit = 10;

    const guild = await GuildModel.findMultipleByName(searchQuery, limit);
    return res.status(200).json(guild);
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
    const limit = 10;
    const { guild } = req.body;

    const members = await GuildModel.findMembersByGuild(
      guild._id,
      searchQuery,
      limit
    );
    return res.status(200).json(members);
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
    const { name } = req.body;

    const guild = await GuildModel.updateById(id, { name });
    return res.status(200).json({
      message: 'Guild name updated successfully',
      guild,
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

    const newLeader = character;

    const isChangingLeader: boolean =
      newLeader && newLeader.toString() !== guild.leader.toString();
    if (isChangingLeader) {
      const isLeaderNotMemberOfGuild: boolean =
        !newLeader.guild || isDifferentGuild(newLeader.guild, id);
      if (isLeaderNotMemberOfGuild) {
        return res
          .status(400)
          .json({ error: 'New leader must be a member of the guild' });
      }

      const previousLeader = await Character.findById(guild.leader);
      if (previousLeader && previousLeader.guild) {
        await joinGuild(previousLeader.toObject(), guild);
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

    return res.status(200).json({
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

    const newMember = character;

    if (newMember.guild && !isDifferentGuild(newMember.guild, id)) {
      return res
        .status(400)
        .json({ error: 'Member is already a member or leader of the guild' });
    }

    if (newMember.guild && isDifferentGuild(newMember.guild, id)) {
      const previousGuild = await Guild.findById(newMember.guild);
      if (!previousGuild) {
        return res.status(404).json({ error: 'Guild not found' });
      }

      await updateLeaderOrMembersGuild(
        previousGuild.toObject(),
        newMember._id.toString()
      );
    }

    await joinGuild(newMember, guild);
    const updatedGuild = await Guild.findById(id).populate({
      path: 'leader members',
      select: '_id name',
    });
    if (!updatedGuild) {
      return res.status(404).json({ error: 'Guild not found' });
    }

    return res.status(200).json({
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
    const { guild, character } = req.body;

    const newMember = character;

    if (
      !newMember.guild ||
      (newMember.guild && isDifferentGuild(newMember.guild, id))
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

    return res.status(200).json({
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
    return res
      .status(200)
      .json({ message: 'Guild deleted successfully', guild: guild });
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
      updateLeaderAndDeleteGuild(guild.toObject())
    );
    await Promise.all(deletePromises);
    return res.status(200).json({
      message: `${guilds.length} guilds deleted successfully.`,
    });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ error: 'Failed to delete guilds' });
    }
  }
};
