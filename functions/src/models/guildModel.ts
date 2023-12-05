import { Schema, model, Document as MongooseDocument } from 'mongoose';
import { Character, ICharacter } from './characterModel';

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
                await Character.find({
                  name: { $regex: searchQuery, $options: 'i' },
                })
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
    .populate({
      path: 'leader members',
      select: 'name _id',
    });

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

export const findById = async (id: string): Promise<IGuild | null> => {
  return (
    (
      await Guild.findById(id).populate('leader members', 'name _id')
    )?.toObject() || null
  );
};

const mapGuild = (
  rawCharacter: MongooseDocument<unknown, unknown, IGuild>
): IGuild => {
  const { _id, ...guildWithoutId } = rawCharacter.toObject();
  return { _id: _id.toString(), ...guildWithoutId } as IGuild;
};
