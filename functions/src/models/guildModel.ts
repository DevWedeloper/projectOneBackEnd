import { Document as MongooseDocument, Schema, model } from 'mongoose';
import * as Character from './characterModel';
import { ICharacter } from './characterModel';

export interface IGuild {
  _id: string;
  name: string;
  leader: ICharacter;
  members?: ICharacter[];
  totalMembers: number;
  maxMembers: number;
  totalHealth?: number;
  totalStrength?: number;
  totalAgility?: number;
  totalIntelligence?: number;
  totalArmor?: number;
  totalCritChance?: number;
}

export type IGuildWithoutId = Omit<IGuild, '_id'>;

const guildSchema = new Schema<IGuildWithoutId>({
  name: {
    type: String,
    required: true,
    unique: true,
    minlength: 6,
    maxlength: 20,
    match: /^[A-Za-z0-9_]*$/,
    index: true,
  },
  leader: {
    type: Schema.Types.ObjectId,
    ref: 'Character',
    required: true,
    unique: true,
  },
  members: [{ type: Schema.Types.ObjectId, ref: 'Character' }],
  totalMembers: { type: Number, default: 1, min: 1, max: 50 },
  maxMembers: { type: Number, default: 50 },
  totalHealth: { type: Number, default: 0 },
  totalStrength: { type: Number, default: 0 },
  totalAgility: { type: Number, default: 0 },
  totalIntelligence: { type: Number, default: 0 },
  totalArmor: { type: Number, default: 0 },
  totalCritChance: { type: Number, default: 0 },
});

export const Guild = model<IGuildWithoutId>('Guild', guildSchema);

export const create = async (guild: IGuildWithoutId): Promise<IGuild> => {
  return (await Guild.create(guild)).toObject();
};

export const getAll = async (): Promise<IGuild[]> => {
  return await Guild.find();
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
              $in: (
                await Character.findMultipleByName(searchQuery, 0)
              ).map((guild) => guild._id.toString()),
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

export const findOneByQuery = async (
  query: Record<string, unknown>
): Promise<IGuild | null> => {
  return await Guild.findOne(query).populate(populateCharacters());
};

export const findById = async (id: string): Promise<IGuild | null> => {
  return (
    (await Guild.findById(id).populate(populateCharacters()))?.toObject() ||
    null
  );
};

export const findByName = async (name: string): Promise<IGuild | null> => {
  return (
    (
      await Guild.findOne({ name }).populate(populateCharacters())
    )?.toObject() || null
  );
};

export const findMultipleByName = async (
  query: string,
  limit: number
): Promise<IGuild[] | null> => {
  const guilds = await Guild.find({
    name: { $regex: query, $options: 'i' },
  })
    .populate(populateCharacters())
    .limit(limit);

  return guilds.map(mapGuild) || null;
};

export const findMembersByGuild = async (
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

export const updateById = async (
  id: string,
  query: Record<string, unknown>
): Promise<IGuild | null> => {
  return (
    (
      await Guild.findByIdAndUpdate(id, query, {
        new: true,
        runValidators: true,
      }).populate(populateCharacters())
    )?.toObject() || null
  );
};

export const deleteById = async (id: string): Promise<IGuild | null> => {
  return (await Guild.findByIdAndDelete(id))?.toObject() || null;
};

export const deleteAll = async (): Promise<{
  acknowledged: boolean;
  deletedCount: number;
}> => {
  return await Guild.deleteMany();
};

export const getTopGuildsByAttribute = async (
  attribute: string,
  limit: number
): Promise<IGuild[]> => {
  return await Guild.find()
    .sort({ [attribute]: -1 })
    .limit(Number(limit))
    .select(`_id name ${attribute}`);
};

type WellRoundedGuild = IGuild & {
  membersAverage: number;
};

export const getTopWellRoundedGuilds = async (
  limit: number
): Promise<WellRoundedGuild[]> => {
  return await Guild.aggregate([
    {
      $project: {
        _id: 1,
        name: 1,
        membersAverage: {
          $cond: {
            if: { $ne: ['$totalMembers', 0] },
            then: {
              $divide: [
                {
                  $sum: [
                    { $divide: ['$totalHealth', 100] },
                    '$totalStrength',
                    '$totalAgility',
                    '$totalIntelligence',
                    '$totalArmor',
                    { $multiply: ['$totalCritChance', 100] },
                  ],
                },
                '$totalMembers',
              ],
            },
            else: 0,
          },
        },
      },
    },
    {
      $sort: { membersAverage: -1 },
    },
    {
      $limit: Number(limit),
    },
  ]);
};

type TopByAverageAttributeGuild = IGuild & {
  averageAttribute: number;
};

export const getTopGuildsByAverageAttribute = async (
  attribute: string,
  limit: number
): Promise<TopByAverageAttributeGuild[]> => {
  return await Guild.aggregate([
    {
      $project: {
        _id: 1,
        name: 1,
        averageAttribute: { $divide: [`$${attribute}`, '$totalMembers'] },
      },
    },
    {
      $sort: { averageAttribute: -1 },
    },
    {
      $limit: Number(limit),
    },
  ]);
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
