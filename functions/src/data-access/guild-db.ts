import { Document as MongooseDocument } from 'mongoose';
import { characterDb as Character } from '.';
import { ICharacter } from '../types/characterType';
import { IGuild, IGuildWithoutId } from '../types/guildType';
import { UniqueIdentifier } from '../types/uniqueIdentifier';
import { InvalidOperationError, NotFoundError } from '../utils/errors';
import { GuildModel } from './types/data-access.type';
import {
  handleMongooseCastObjectIdError,
  handleMongooseUniqueConstraintError,
} from './utils/handle-mongoose-errors';

type GuildCreate = Pick<IGuildWithoutId, 'name' | 'leader' | 'maxMembers'>;

export const makeGuildDb = ({ Guild }: { Guild: GuildModel }) => {
  const create = async (guild: GuildCreate): Promise<IGuild> => {
    try {
      return (await Guild.create(guild)).toObject();
    } catch (error) {
      if (error instanceof Error) {
        handleMongooseUniqueConstraintError(error);
      }
      throw new Error('Failed to create guild.');
    }
  };

  const getAll = async (): Promise<IGuild[]> => {
    return await Guild.find();
  };

  const getPaginated = async (
    page: number,
    pageSize: number,
    sortBy: string,
    sortOrder: 'asc' | 'desc',
    searchQuery: string
  ): Promise<{
    page: number;
    pageSize: number;
    totalPages: number;
    totalGuilds: number;
    guilds: IGuild[];
  }> => {
    const skip = (page - 1) * pageSize;
    const sort: { [key: string]: 'asc' | 'desc' } = {};
    sort[sortBy] = sortOrder;
    const regex = new RegExp(searchQuery, 'i');
    const query = searchQuery
      ? {
          $or: [
            { name: { $regex: regex } },
            {
              leader: {
                $in: (await Character.findMultipleByName(searchQuery, 0)).map(
                  (guild) => guild._id.toString()
                ),
              },
            },
          ],
        }
      : {};

    const rawGuilds = await Guild.find(query)
      .sort(sort)
      .skip(skip)
      .limit(pageSize)
      .populate(populateCharacters());

    const guilds = rawGuilds.map(mapGuild);
    const totalGuilds = await Guild.countDocuments(query);
    const totalPages = Math.ceil(totalGuilds / pageSize);
    return {
      page,
      pageSize,
      totalPages,
      totalGuilds,
      guilds,
    };
  };

  const findOneByNameOrId = async (
    query: Partial<UniqueIdentifier>
  ): Promise<IGuild> => {
    try {
      return (
        (
          await Guild.findOne(query).populate(populateCharacters())
        )?.toObject() || throwGuildNotFoundError()
      );
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      if (error instanceof Error) {
        handleMongooseCastObjectIdError(error);
      }
      throw new Error('Failed to find guild by name or id.');
    }
  };

  const findById = async (id: string): Promise<IGuild> => {
    try {
      return (
        (await Guild.findById(id).populate(populateCharacters()))?.toObject() ||
        throwGuildNotFoundError()
      );
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      if (error instanceof Error) {
        handleMongooseCastObjectIdError(error);
      }
      throw new Error('Failed to find guild by id.');
    }
  };

  const findByName = async (name: string): Promise<IGuild> => {
    try {
      return (
        (
          await Guild.findOne({ name }).populate(populateCharacters())
        )?.toObject() || throwGuildNotFoundError()
      );
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      if (error instanceof Error) {
        handleMongooseCastObjectIdError(error);
      }
      throw new Error('Failed to find guild by name.');
    }
  };

  const findMultipleByName = async (
    query: string,
    limit: number
  ): Promise<IGuild[]> => {
    const guilds = await Guild.find({
      name: { $regex: query, $options: 'i' },
    })
      .populate(populateCharacters())
      .limit(limit);

    return guilds.map(mapGuild);
  };

  const findMembersByGuild = async (
    guildId: string,
    query: string,
    limit: number
  ): Promise<ICharacter[] | null> => {
    return (
      (
        await Guild.findById(guildId)
          .populate({
            path: 'members',
            match: {
              $or: [{ name: { $regex: new RegExp(query, 'i') } }],
            },
          })
          .limit(limit)
      )?.members || null
    );
  };

  const isUnique = async ({
    name,
  }: {
    name: string;
  }): Promise<IGuild | null> => {
    return (await Guild.findOne({ name }))?.toObject() || null;
  };

  const isExisting = async (
    query: Partial<UniqueIdentifier>
  ): Promise<IGuild | null> => {
    return (await Guild.findOne(query))?.toObject() || null;
  };

  const updateById = async (
    id: string,
    query: Partial<IGuildWithoutId>
  ): Promise<IGuild> => {
    try {
      return (
        (
          await Guild.findByIdAndUpdate(id, query, {
            new: true,
            runValidators: true,
          }).populate(populateCharacters())
        )?.toObject() || throwGuildNotFoundError()
      );
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      if (error instanceof Error) {
        handleMongooseUniqueConstraintError(error);
        handleMongooseCastObjectIdError(error);
      }
      throw new Error('Failed to update guild.');
    }
  };

  const deleteById = async (id: string): Promise<IGuild> => {
    try {
      return (
        (await Guild.findByIdAndDelete(id))?.toObject() ||
        throwGuildNotFoundError()
      );
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      if (error instanceof Error) {
        handleMongooseCastObjectIdError(error);
      }
      throw new Error('Failed to delete guild by id.');
    }
  };

  const deleteAll = async (): Promise<{
    acknowledged: boolean;
    deletedCount: number;
  }> => {
    return await Guild.deleteMany();
  };

  const addCharacterToGuild = async (
    character: ICharacter,
    guild: IGuild
  ): Promise<IGuild> => {
    return (
      (await Guild.findByIdAndUpdate(guild._id.toString(), {
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
      })) || throwGuildNotFoundError()
    );
  };

  const removeCharacterFromGuild = async (
    character: ICharacter
  ): Promise<IGuild> => {
    if (!character.guild) {
      throw new InvalidOperationError('Character guild does not exist');
    }

    return (
      (await Guild.findByIdAndUpdate(character.guild._id.toString(), {
        $pull: { members: character._id.toString() },
        $inc: {
          totalMembers: -1,
          totalHealth: -(character?.health || 0),
          totalStrength: -(character?.strength || 0),
          totalAgility: -(character?.agility || 0),
          totalIntelligence: -(character?.intelligence || 0),
          totalArmor: -(character?.armor || 0),
          totalCritChance: -(character?.critChance || 0),
        },
      })) || throwGuildNotFoundError()
    );
  };

  return Object.freeze({
    create,
    getAll,
    getPaginated,
    findOneByNameOrId,
    findById,
    findByName,
    findMultipleByName,
    findMembersByGuild,
    isUnique,
    isExisting,
    updateById,
    deleteById,
    deleteAll,
    addCharacterToGuild,
    removeCharacterFromGuild,
  });
};

const mapGuild = (
  rawCharacter: MongooseDocument<unknown, unknown, IGuild>
): IGuild => {
  const { _id, ...guildWithoutId } = rawCharacter.toObject();
  return { _id: _id.toString(), ...guildWithoutId } as IGuild;
};

const populateCharacters = () => ({
  path: 'leader members',
  select: '_id name',
});

const throwGuildNotFoundError = () => {
  throw new NotFoundError('Guild not found.');
};
