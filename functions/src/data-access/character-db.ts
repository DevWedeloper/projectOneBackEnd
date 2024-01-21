import { Document as MongooseDocument, UpdateWriteOpResult } from 'mongoose';
import { guildDb as Guild } from '.';
import { ICharacter, ICharacterWithoutId } from '../types/characterType';
import { UniqueIdentifier } from '../types/uniqueIdentifier';
import { NotFoundError } from '../utils/errors';
import { CharacterModel } from './types/data-access.type';
import {
  handleMongooseCastObjectIdError,
  handleMongooseUniqueConstraintError,
} from './utils/handle-mongoose-errors';

export const makeCharacterDb = ({
  Character,
}: {
  Character: CharacterModel;
}) => {
  const create = async (
    character: ICharacterWithoutId,
  ): Promise<ICharacter> => {
    try {
      return (await Character.create(character)).toObject();
    } catch (error) {
      if (error instanceof Error) {
        handleMongooseUniqueConstraintError(error);
      }
      throw new Error('Failed to create character.');
    }
  };

  const getPaginated = async (
    page: number,
    pageSize: number,
    sortBy: string,
    sortOrder: 'asc' | 'desc',
    searchQuery: string,
  ): Promise<{
    page: number;
    pageSize: number;
    totalPages: number;
    totalCharacters: number;
    characters: ICharacter[];
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
              guild: {
                $in: (await Guild.findMultipleByName(searchQuery, 0)).map(
                  (guild) => guild._id.toString(),
                ),
              },
            },
          ],
        }
      : {};

    const rawCharacters = await Character.find(query)
      .sort(sort)
      .skip(skip)
      .limit(pageSize)
      .populate(populateGuild());

    const characters = rawCharacters.map(mapCharacter);
    const totalCharacters = await Character.countDocuments(query);
    const totalPages = Math.ceil(totalCharacters / pageSize);
    return {
      page,
      pageSize,
      totalPages,
      totalCharacters,
      characters,
    };
  };

  const findOneByNameOrId = async (
    query: Partial<UniqueIdentifier>,
  ): Promise<ICharacter> => {
    try {
      return (
        (
          await Character.findOne(query).populate(populateGuild())
        )?.toObject() || throwCharacterNotFoundError()
      );
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      if (error instanceof Error) {
        handleMongooseCastObjectIdError(error);
      }
      throw new Error('Failed to find character by name or id.');
    }
  };

  const findById = async (id: string): Promise<ICharacter> => {
    try {
      return (
        (await Character.findById(id).populate(populateGuild()))?.toObject() ||
        throwCharacterNotFoundError()
      );
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      if (error instanceof Error) {
        handleMongooseCastObjectIdError(error);
      }
      throw new Error('Failed to find character by id.');
    }
  };

  const findByName = async (name: string): Promise<ICharacter> => {
    try {
      return (
        (
          await Character.findOne({ name }).populate(populateGuild())
        )?.toObject() || throwCharacterNotFoundError()
      );
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      if (error instanceof Error) {
        handleMongooseCastObjectIdError(error);
      }
      throw new Error('Failed to find character by name.');
    }
  };

  const findMultipleByName = async (
    query: string,
    limit: number,
  ): Promise<ICharacter[]> => {
    const characters = await Character.find({
      name: { $regex: query, $options: 'i' },
    })
      .populate(populateGuild())
      .limit(limit);

    return characters.map(mapCharacter);
  };

  const isUnique = async ({
    name,
  }: {
    name: string;
  }): Promise<ICharacter | null> => {
    return (await Character.findOne({ name }))?.toObject() || null;
  };

  const isExisting = async (
    query: Partial<UniqueIdentifier>,
  ): Promise<ICharacter | null> => {
    return (await Character.findOne(query))?.toObject() || null;
  };

  const updateById = async (
    id: string,
    query: Partial<ICharacterWithoutId>,
  ): Promise<ICharacter> => {
    try {
      return (
        (
          await Character.findByIdAndUpdate(id, query, {
            new: true,
            runValidators: true,
          })
        )?.toObject() || throwCharacterNotFoundError()
      );
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      if (error instanceof Error) {
        handleMongooseUniqueConstraintError(error);
        handleMongooseCastObjectIdError(error);
      }
      throw new Error('Failed to update character.');
    }
  };

  const deleteById = async (id: string): Promise<ICharacter> => {
    try {
      return (
        (await Character.findByIdAndDelete(id))?.toObject() ||
        throwCharacterNotFoundError()
      );
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      if (error instanceof Error) {
        handleMongooseCastObjectIdError(error);
      }
      throw new Error('Failed to delete character by id.');
    }
  };

  const deleteAll = async (): Promise<{
    acknowledged: boolean;
    deletedCount: number;
  }> => {
    return await Character.deleteMany();
  };

  const leaveAllGuild = async (): Promise<UpdateWriteOpResult> => {
    return await Character.updateMany({ $set: { guild: null } });
  };

  const getAllWithoutGuild = async (): Promise<ICharacter[]> => {
    return await Character.find({ guild: null });
  };

  const membersLeaveGuild = async (
    memberList: ICharacter[],
  ): Promise<UpdateWriteOpResult> => {
    return await Character.updateMany(
      { _id: { $in: memberList } },
      { $unset: { guild: 1 } },
    );
  };

  return Object.freeze({
    create,
    getPaginated,
    findOneByNameOrId,
    findById,
    findByName,
    findMultipleByName,
    isUnique,
    isExisting,
    updateById,
    deleteById,
    deleteAll,
    leaveAllGuild,
    getAllWithoutGuild,
    membersLeaveGuild,
  });
};

const mapCharacter = (
  rawCharacter: MongooseDocument<unknown, unknown, ICharacter>,
): ICharacter => {
  const { _id, ...characterWithoutId } = rawCharacter.toObject();
  return { _id: _id.toString(), ...characterWithoutId } as ICharacter;
};

const populateGuild = () => ({
  path: 'guild',
  select: '_id name leader',
  populate: {
    path: 'leader',
    model: 'Character',
    select: '_id name',
  },
});

const throwCharacterNotFoundError = () => {
  throw new NotFoundError('Character not found.');
};
