import {
  Schema,
  model,
  Document as MongooseDocument,
  UpdateWriteOpResult,
} from 'mongoose';
import { Guild, IGuild } from './guildModel';

export interface ICharacter {
  _id: string;
  name: string;
  characterType: string;
  health: number;
  strength: number;
  agility: number;
  intelligence: number;
  armor: number;
  critChance: number;
  guild?: IGuild | null;
}

export type ICharacterWithoutId = Omit<ICharacter, '_id'>;

const characterSchema = new Schema<ICharacterWithoutId>({
  name: {
    type: String,
    required: true,
    unique: true,
    minlength: 6,
    maxlength: 20,
    match: /^[A-Za-z0-9_]*$/,
    index: true,
  },
  characterType: { type: String, required: true },
  health: { type: Number, required: true, min: 1000, max: 10000 },
  strength: { type: Number, required: true, min: 1, max: 100 },
  agility: { type: Number, required: true, min: 1, max: 100 },
  intelligence: { type: Number, required: true, min: 1, max: 100 },
  armor: { type: Number, required: true, min: 1, max: 100 },
  critChance: { type: Number, required: true, min: 0.01, max: 1 },
  guild: { type: Schema.Types.ObjectId, ref: 'Guild', default: null },
});

export const Character = model<ICharacterWithoutId>(
  'Character',
  characterSchema
);

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
  // Calculate the skip value for pagination
  const skip = (page - 1) * pageSize;

  // Build the sort object based on sortBy and sortOrder
  const sort: { [key: string]: 'asc' | 'desc' } = {};
  sort[sortBy] = sortOrder;

  // Build the search query
  const regex = new RegExp(searchQuery, 'i');
  const query = searchQuery
    ? {
        $or: [
          { name: { $regex: regex } },
          {
            guild: {
              $in: (
                await Guild.find({
                  name: { $regex: searchQuery, $options: 'i' },
                })
              ).map((guild) => guild._id.toString()),
            },
          },
        ],
      }
    : {};

  // Fetch characters from the database based on the provided parameters
  const rawCharacters = await Character.find(query)
    .sort(sort)
    .skip(skip)
    .limit(pageSize)
    .populate(populateGuild());

  // Convert each Mongoose document to a plain JavaScript object
  const characters = rawCharacters.map(mapCharacter);

  // Get the total count of characters for pagination
  const totalCharacters = await Character.countDocuments(query);

  // Calculate the total pages based on pageSize
  const totalPages = Math.ceil(totalCharacters / pageSize);

  // Return the result as a Promise
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
): Promise<ICharacter[] | null> => {
  const characters = await Character.find({
    name: { $regex: query, $options: 'i' },
  })
    .populate(populateGuild())
    .limit(limit);

  return characters.map(mapCharacter) || null;
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

export const getTopCharactersByAttribute = async (
  attribute: string,
  limit: number
): Promise<ICharacter[]> => {
  return await Character.aggregate([
    {
      $project: {
        _id: 1,
        name: 1,
        characterType: 1,
        [attribute]: { $sum: [`$${attribute}`] },
      },
    },
    {
      $sort: { [attribute]: -1 },
    },
    {
      $limit: Number(limit),
    },
  ]);
};

export const getTopWellRoundedCharacters = async (
  limit: number
): Promise<ICharacter[]> => {
  return await Character.aggregate([
    {
      $project: {
        _id: 1,
        name: 1,
        characterType: 1,
        health: 1,
        strength: 1,
        agility: 1,
        intelligence: 1,
        armor: 1,
        critChance: 1,
        guild: 1,
        totalAttribute: {
          $sum: [
            { $divide: ['$health', 100] },
            '$strength',
            '$agility',
            '$intelligence',
            '$armor',
            { $multiply: ['$critChance', 100] },
          ],
        },
      },
    },
    {
      $sort: { totalAttribute: -1 },
    },
    {
      $limit: Number(limit),
    },
  ]);
};

export const getAverageCharacterStats = async (): Promise<{
  avgHealth: number;
  avgStrength: number;
  avgAgility: number;
  avgIntelligence: number;
  avgArmor: number;
  avgCritChance: number;
}> => {
  const [averageStats] = await Character.aggregate([
    {
      $group: {
        _id: null,
        avgHealth: { $avg: '$health' },
        avgStrength: { $avg: '$strength' },
        avgAgility: { $avg: '$agility' },
        avgIntelligence: { $avg: '$intelligence' },
        avgArmor: { $avg: '$armor' },
        avgCritChance: { $avg: '$critChance' },
      },
    },
    {
      $project: {
        _id: 0,
      },
    },
  ]);
  return averageStats as {
    avgHealth: number;
    avgStrength: number;
    avgAgility: number;
    avgIntelligence: number;
    avgArmor: number;
    avgCritChance: number;
  };
};

export const getCharacterDistributionByType = async (): Promise<
  ICharacter[]
> => {
  return await Character.aggregate([
    {
      $group: {
        _id: '$characterType',
        count: { $sum: 1 },
      },
    },
    {
      $sort: { count: -1 },
    },
  ]);
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
