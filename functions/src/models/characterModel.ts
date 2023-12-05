import { Schema, model, Document as MongooseDocument } from 'mongoose';
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
  guild: IGuild;
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

export const getAll = async (
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
    .populate({
      path: 'guild',
      select: '_id name leader',
      populate: {
        path: 'leader',
        model: 'Character',
        select: '_id name',
      },
    });

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

export const findById = async (id: string): Promise<ICharacter | null> => {
  return (await Character.findById(id).populate('guild'))?.toObject() || null;
};

export const findByName = async (name: string): Promise<ICharacter | null> => {
  return (
    (await Character.findOne({ name }).populate('guild'))?.toObject() || null
  );
};

export const findMultipleByName = async (
  query: string,
  limit: number
): Promise<ICharacter[] | null> => {
  const characters = await Character.find({
    name: { $regex: query, $options: 'i' },
  })
    .populate({
      path: 'guild',
      select: '_id name leader',
      populate: {
        path: 'leader',
        model: 'Character',
        select: '_id name',
      },
    })
    .limit(limit);

  return characters.map(mapCharacter) || null;
};

export const updateById = async (
  id: string,
  query: Record<string, string | number>
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

const mapCharacter = (
  rawCharacter: MongooseDocument<unknown, unknown, ICharacter>
): ICharacter => {
  const { _id, ...characterWithoutId } = rawCharacter.toObject();
  return { _id: _id.toString(), ...characterWithoutId } as ICharacter;
};
