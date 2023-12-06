import {
  Document as MongooseDocument,
  UpdateWriteOpResult
} from 'mongoose';
import { ICharacter, ICharacterWithoutId } from '../types/characterTypes';
import * as Guild from './guildModel';
import { Character } from './schemas/characterSchema';

export const create = async (
  character: ICharacterWithoutId
): Promise<ICharacter> => {
  return (await Character.create(character)).toObject();
};

export const getPaginated = async (
  page: number,
  pageSize: number,
  sortBy: string,
  sortOrder: 'asc' | 'desc',
  searchQuery: string
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
                (guild) => guild._id.toString()
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

export const findOneByQuery = async (
  query: Record<string, unknown>
): Promise<ICharacter | null> => {
  return await Character.findOne(query).populate(populateGuild());
};

export const findById = async (id: string): Promise<ICharacter | null> => {
  return (
    (await Character.findById(id).populate(populateGuild()))?.toObject() || null
  );
};

export const findByName = async (name: string): Promise<ICharacter | null> => {
  return (
    (await Character.findOne({ name }).populate(populateGuild()))?.toObject() ||
    null
  );
};

export const findMultipleByName = async (
  query: string,
  limit: number
): Promise<ICharacter[]> => {
  const characters = await Character.find({
    name: { $regex: query, $options: 'i' },
  })
    .populate(populateGuild())
    .limit(limit);

  return characters.map(mapCharacter);
};

export const updateById = async (
  id: string,
  query: Record<string, unknown>
): Promise<ICharacter | null> => {
  return (
    (
      await Character.findByIdAndUpdate(id, query, {
        new: true,
        runValidators: true,
      })
    )?.toObject() || null
  );
};

export const deleteById = async (id: string): Promise<ICharacter | null> => {
  return (await Character.findByIdAndDelete(id))?.toObject() || null;
};

export const deleteAll = async (): Promise<{
  acknowledged: boolean;
  deletedCount: number;
}> => {
  return await Character.deleteMany();
};

export const leaveAllGuild = async (): Promise<UpdateWriteOpResult> => {
  return await Character.updateMany({ $set: { guild: null } });
};

export const getAllWithoutGuild = async (): Promise<ICharacter[]> => {
  return await Character.find({ guild: null });
};

export const membersLeaveGuild = async (
  memberList: ICharacter[]
): Promise<UpdateWriteOpResult> => {
  return await Character.updateMany(
    { _id: { $in: memberList } },
    { $unset: { guild: 1 } }
  );
};

const mapCharacter = (
  rawCharacter: MongooseDocument<unknown, unknown, ICharacter>
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
