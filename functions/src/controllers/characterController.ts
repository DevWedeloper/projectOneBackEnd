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

export const createCharacter = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  try {
    const character = await Character.create(req.body);
    return res.status(201).json({
      message: 'Character created successfully',
      character,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllCharacters = async (
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

    const characters = await Character.getPaginated(
      page,
      pageSize,
      sortBy,
      sortOrder,
      searchQuery
    );
    return res.status(200).json(characters);
  } catch (error) {
    next(error);
  }
};

export const getCharacterById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  try {
    const { id } = req.params;

    const character = await Character.findById(id);
    return res.status(200).json(character);
  } catch (error) {
    next(error);
  }
};

export const getCharacterByName = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  try {
    const { name } = req.params;

    const character = await Character.findByName(name);
    return res.status(200).json(character);
  } catch (error) {
    next(error);
  }
};

export const searchCharactersByName = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  try {
    const searchQuery = req.query.name as string;
    const limit = 10;

    const character = await Character.findMultipleByName(searchQuery, limit);
    return res.status(200).json(character);
  } catch (error) {
    next(error);
  }
};

export const updateCharacterAttributeById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  const { attribute } = req.params;
  try {
    const { id } = req.params;
    const { [attribute]: attributeValue } = req.body;

    const character = await Character.updateById(id, {
      [attribute]: attributeValue,
    });
    return res.status(200).json({
      message: `Character's ${attribute} updated successfully.`,
      character,
    });
  } catch (error) {
    next(error);
  }
};

export const joinGuildById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  try {
    const { id } = req.params;
    const { character, guild } = req.body;

    if (character.guild) {
      const previousGuild = await Guild.findById(character.guild._id);
      if (isDifferentGuild(previousGuild, guild._id.toString())) {
        await updateLeaderOrMembersGuild(previousGuild, id);
      } else {
        return res
          .status(400)
          .json({ error: 'Already a member of this guild' });
      }
    }

    await joinGuild(character, guild);

    const updatedCharacter = await Character.findById(id);
    return res.status(200).json({
      message: 'Joined guild successfully.',
      character: updatedCharacter,
    });
  } catch (error) {
    next(error);
  }
};

export const leaveGuildById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  try {
    const { id } = req.params;
    const { character } = req.body;

    if (!character.guild) {
      return res.status(404).json({ error: 'Character doesn\'t have a guild' });
    }

    const previousGuild = await Guild.findById(character.guild._id);

    await updateLeaderOrMembersGuild(previousGuild, id);

    const updatedCharacter = await Character.findById(id);
    return res.status(200).json({
      message: 'Left guild successfully.',
      character: updatedCharacter,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteCharacterById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  try {
    const { id } = req.params;
    const { character } = req.body;
    if (character.guild) {
      if (isLeader(character.guild, id)) {
        await updateLeaderAndDeleteGuild(character.guild);
      } else {
        await leaveGuild(id);
      }
    }

    const deletedCharacter = await Character.deleteById(id);
    return res.status(200).json({
      message: 'Character deleted successfully.',
      character: deletedCharacter,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteAllCharacters = async (
  _: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  try {
    const [characterDeletionResult, guildDeletionResult] = await Promise.all([
      Character.deleteAll(),
      Guild.deleteAll(),
    ]);

    return res.status(200).json({
      message: `${characterDeletionResult.deletedCount} characters and ${guildDeletionResult.deletedCount} guilds deleted successfully.`,
    });
  } catch (error) {
    next(error);
  }
};
