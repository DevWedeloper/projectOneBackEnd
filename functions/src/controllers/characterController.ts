import { Request, Response } from 'express';
import { Character, ICharacterDocument } from '../models/characterModel';
import { Guild, IGuildDocument } from '../models/guildModel';
import {
  joinGuild,
  leaveGuild,
  updateLeaderAndDeleteGuild,
  updateLeaderOrMembersGuild,
  isLeader,
  isDifferentGuild,
} from '../utils/guildCharacterUtils';

export const createCharacter = async (
  req: Request,
  res: Response
): Promise<void | Response> => {
  try {
    const savedCharacter: ICharacterDocument = await Character.create(req.body);
    return res
      .status(201)
      .json({
        message: 'Character created successfully',
        character: savedCharacter,
      });
  } catch (error) {
    if (error instanceof Error) {
      return res
        .status(500)
        .json({
          error: 'Failed to create the character',
          message: error.message,
        });
    }
  }
};

export const getAllCharacters = async (
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
        characterType?: { $regex: string; $options: string };
        health?: { $eq: number };
        strength?: { $eq: number };
        agility?: { $eq: number };
        intelligence?: { $eq: number };
        armor?: { $eq: number };
        critChance?: { $eq: number };
        guild?: { $in: string[] };
      }>;
    } = {
      $or: [
        { name: { $regex: searchQuery, $options: 'i' } },
        { characterType: { $regex: searchQuery, $options: 'i' } },
        { guild: { $in: await getGuildIdsByGuildName(searchQuery) } },
      ],
    };
    
    if (searchQuery && !isNaN(Number(searchQuery))) {
      const numericValue = Number(searchQuery);
      query.$or.push(
        { health: { $eq: numericValue } },
        { strength: { $eq: numericValue } },
        { agility: { $eq: numericValue } },
        { intelligence: { $eq: numericValue } },
        { armor: { $eq: numericValue } },
        { critChance: { $eq: numericValue } }
      );
    }

    const totalCharacters: number = await Character.countDocuments(query);
    const totalPages: number = Math.ceil(totalCharacters / pageSize);

    const charactersQuery = Character.find(query)
      .sort(sortCriteria)
      .populate({
        path: 'guild',
        select: '_id name leader',
        populate: {
          path: 'leader',
          model: 'Character',
          select: '_id name',
        },
      })
      .skip((page - 1) * pageSize)
      .limit(pageSize);

    const characters: ICharacterDocument[] = await charactersQuery;

    return res.json({
      page,
      pageSize,
      totalPages,
      totalCharacters,
      characters,
    });
  } catch (error) {
    if (error instanceof Error) {
      return res
        .status(500)
        .json({
          error: 'Failed to retrieve characters',
          message: error.message,
        });
    }
  }
};

export const getCharacterById = async (
  req: Request,
  res: Response
): Promise<void | Response> => {
  try {
    const { id } = req.params;
    const character: ICharacterDocument | null = await Character.findById(
      id
    ).populate('guild');

    if (!character) {
      return res.status(404).json({ error: 'Character not found' });
    }

    return res.json(character);
  } catch (error) {
    if (error instanceof Error) {
      return res
        .status(500)
        .json({
          error: 'Failed to retrieve the character',
          message: error.message,
        });
    }
  }
};

export const searchCharactersByName = async (
  req: Request,
  res: Response
): Promise<void | Response> => {
  try {
    const searchQuery = req.query.name as string;
    const character = await Character.find({
      name: { $regex: searchQuery, $options: 'i' },
    }).populate({
      path: 'guild',
      select: '_id name leader',
      populate: {
        path: 'leader',
        model: 'Character',
        select: '_id name',
      },
    });

    return res.json(character);
  } catch (error) {
    if (error instanceof Error) {
      return res
        .status(500)
        .json({ error: 'Error searching characters', message: error.message });
    }
  }
};

export const updateCharacterAttributeById = async (
  req: Request,
  res: Response
): Promise<void | Response> => {
  const { attribute } = req.params;
  try {
    const { id } = req.params;
    const { [attribute]: attributeValue } = req.body;

    const updateQuery = { [attribute]: attributeValue };

    const updatedCharacter: ICharacterDocument | null =
      await Character.findByIdAndUpdate(id, updateQuery, {
        new: true,
        runValidators: true,
      });

    if (!updatedCharacter) {
      return res.status(404).json({ error: 'Character not found' });
    }

    return res.json({
      message: `Character's ${attribute} updated successfully.`,
      character: updatedCharacter,
    });
  } catch (error) {
    if (error instanceof Error) {
      return res
        .status(500)
        .json({
          error: `Failed to update character's ${attribute}`,
          message: error.message,
        });
    }
  }
};

export const joinGuildById = async (
  req: Request,
  res: Response
): Promise<void | Response> => {
  try {
    const { id } = req.params;
    const { character, guild } = req.body;

    if (character.guild) {
      const previousGuild: IGuildDocument | null = await Guild.findById(
        character.guild
      );
      if (!previousGuild) {
        return res.status(404).json({ error: 'Current guild not found' });
      }

      if (isDifferentGuild(previousGuild, guild._id.toString())) {
        await updateLeaderOrMembersGuild(previousGuild, id);
      } else {
        return res
          .status(400)
          .json({ error: 'Already a member of this guild' });
      }
    }

    await joinGuild(character._id, guild);
    const updatedCharacter = await Character.findById(id);
    if (!updatedCharacter) {
      return res.status(404).json({ error: 'Character not found' });
    }

    return res.json({
      message: 'Joined guild successfully.',
      character: updatedCharacter,
    });
  } catch (error) {
    if (error instanceof Error) {
      return res
        .status(500)
        .json({ error: 'Failed to join guild', message: error.message });
    }
  }
};

export const leaveGuildById = async (
  req: Request,
  res: Response
): Promise<void | Response> => {
  try {
    const { id } = req.params;
    const { character } = req.body;

    if (character.guild === null) {
      return res.status(404).json({ error: 'Character doesn\'t have a guild' });
    }

    const previousGuild: IGuildDocument | null = await Guild.findById(
      character.guild
    );
    if (!previousGuild) {
      return res.status(404).json({ error: 'Current guild not found' });
    }
    await updateLeaderOrMembersGuild(previousGuild, id);

    const updatedCharacter = await Character.findById(id);
    if (!updatedCharacter) {
      return res.status(404).json({ error: 'Character not found' });
    }

    return res.json({
      message: 'Left guild successfully.',
      character: updatedCharacter,
    });
  } catch (error) {
    if (error instanceof Error) {
      return res
        .status(500)
        .json({ error: 'Failed to leave guild', message: error.message });
    }
  }
};

export const deleteCharacterById = async (
  req: Request,
  res: Response
): Promise<void | Response> => {
  try {
    const { id } = req.params;
    const { character } = req.body;
    if (character.guild) {
      const guildId = character.guild as IGuildDocument['_id'];
      const guild = await Guild.findById(guildId);
      if (guild) {
        if (isLeader(guild, id)) {
          await updateLeaderAndDeleteGuild(guild);
        } else {
          await leaveGuild(id);
        }
      }
    }

    await Character.findByIdAndDelete(id);
    return res.json({
      message: 'Character deleted successfully.',
      character: character,
    });
  } catch (error) {
    if (error instanceof Error) {
      return res
        .status(500)
        .json({
          error: 'Failed to delete the character',
          message: error.message,
        });
    }
  }
};

export const deleteAllCharacters = async (
  req: Request,
  res: Response
): Promise<void | Response> => {
  try {
    const [characterDeletionResult, guildDeletionResult] = await Promise.all([
      Character.deleteMany({}),
      Guild.deleteMany({}),
    ]);

    return res.json({
      message: `${characterDeletionResult.deletedCount} characters and ${guildDeletionResult.deletedCount} guilds deleted successfully.`,
    });
  } catch (error) {
    if (error instanceof Error) {
      return res
        .status(500)
        .json({
          error: 'Failed to delete characters and guilds.',
          message: error.message,
        });
    }
  }
};

const getGuildIdsByGuildName = async (guildName: string) => {
  const guildSearchResults = await Guild.find({
    name: { $regex: guildName, $options: 'i' },
  });

  return guildSearchResults.map((guild) => guild._id);
};
