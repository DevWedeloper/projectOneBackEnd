import { Request, Response, NextFunction } from 'express';
import * as Character from '../models/characterModel';
import * as Guild from '../models/guildModel';
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
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  try {
    const { name, character } = req.body;
    if (character.guild) {
      await updateLeaderOrMembersGuild(
        character.guild,
        character._id.toString()
      );
    }

    const guildData = {
      name,
      leader: character,
      maxMembers: 50,
    };

    const guild = await Guild.create(guildData);
    await joinGuild(character._id, guild);
    return res
      .status(201)
      .json({ message: 'Guild created successfully', guild });
  } catch (error) {
    next(error);
  }
};

export const getAllGuilds = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  try {
    const page: number = parseInt(req.query.page as string) || 1;
    const pageSize: number = parseInt(req.query.pageSize as string) || 10;
    const sortBy: string = (req.query.sortBy as string) || 'name';
    const sortOrder: 'asc' | 'desc' =
      (req.query.sortOrder as 'asc' | 'desc') || 'asc';
    const searchQuery: string = (req.query.search as string) || '';

    const guilds = await Guild.getPaginated(
      page,
      pageSize,
      sortBy,
      sortOrder,
      searchQuery
    );
    return res.status(200).json(guilds);
  } catch (error) {
    next(error);
  }
};

export const getGuildById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  try {
    const { id } = req.params;

    const guild = await Guild.findById(id);
    return res.status(200).json(guild);
  } catch (error) {
    next(error);
  }
};

export const getGuildByName = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  try {
    const { name } = req.params;

    const guild = await Guild.findByName(name);
    return res.status(200).json(guild);
  } catch (error) {
    next(error);
  }
};

export const searchGuildsByName = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  try {
    const searchQuery = req.query.name as string;
    const limit = 10;

    const guild = await Guild.findMultipleByName(searchQuery, limit);
    return res.status(200).json(guild);
  } catch (error) {
    next(error);
  }
};

export const searchGuildMemberById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  try {
    const searchQuery = req.query.name as string;
    const limit = 10;
    const { guild } = req.body;

    const members = await Guild.findMembersByGuild(
      guild._id,
      searchQuery,
      limit
    );
    return res.status(200).json(members);
  } catch (error) {
    next(error);
  }
};

export const updateGuildNameById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const guild = await Guild.updateById(id, { name });
    return res.status(200).json({
      message: 'Guild name updated successfully',
      guild,
    });
  } catch (error) {
    next(error);
  }
};

export const updateGuildLeaderById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  try {
    const { id } = req.params;
    const { guild, character } = req.body;

    const isChangingLeader: boolean =
      character && character.toString() !== guild.leader.toString();
    if (isChangingLeader) {
      const isLeaderNotMemberOfGuild: boolean =
        !character.guild || isDifferentGuild(character.guild, id);
      if (isLeaderNotMemberOfGuild) {
        return res
          .status(400)
          .json({ error: 'New leader must be a member of the guild' });
      }
    }

    const updatedGuild = await Guild.updateById(id, { leader: character });
    return res.status(200).json({
      message: 'Guild leader updated successfully',
      guild: updatedGuild,
    });
  } catch (error) {
    next(error);
  }
};

export const addMemberToGuildById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  try {
    const { id } = req.params;
    const { guild, character } = req.body;

    if (character.guild && !isDifferentGuild(character.guild, id)) {
      return res
        .status(400)
        .json({ error: 'Member is already a member or leader of the guild' });
    }

    if (character.guild && isDifferentGuild(character.guild, id)) {
      const previousGuild = await Guild.findById(character.guild._id);
      await updateLeaderOrMembersGuild(previousGuild, character._id);
    }

    await joinGuild(character, guild);

    const updatedGuild = await Guild.findById(id);
    return res.status(200).json({
      message: 'Member added to guild successfully',
      guild: updatedGuild,
    });
  } catch (error) {
    next(error);
  }
};

export const removeMemberFromGuildById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  try {
    const { id } = req.params;
    const { guild, character } = req.body;

    if (
      !character.guild ||
      (character.guild && isDifferentGuild(character.guild, id))
    ) {
      return res
        .status(400)
        .json({ error: 'Member is not a part of the guild' });
    }

    if (isLeader(guild, character._id)) {
      return res
        .status(403)
        .json({ error: 'Cannot kick the leader of the guild' });
    }

    await leaveGuild(character._id);

    const updatedGuild = await Guild.findById(id);
    return res.status(200).json({
      message: 'Member removed from guild successfully',
      guild: updatedGuild,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteGuildById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  try {
    const { guild } = req.body;

    await updateLeaderAndDeleteGuild(guild);

    return res
      .status(200)
      .json({ message: 'Guild deleted successfully', guild: guild });
  } catch (error) {
    next(error);
  }
};

export const deleteAllGuilds = async (
  _: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  try {
    const result = await Guild.deleteAll();
    await Character.leaveAllGuild();

    return res.status(200).json({
      message: `${result.deletedCount} guilds deleted successfully.`,
    });
  } catch (error) {
    next(error);
  }
};
