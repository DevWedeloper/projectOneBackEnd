import { Document as MongooseDocument } from 'mongoose';
import { ICharacter } from '../types/characterType';
import { IGuild, IGuildWithoutId } from '../types/guildType';
import * as Character from './characterModel';
import { Guild } from './schemas/guildSchema';

type GuildOnCreate = Omit<
  IGuild,
  | '_id'
  | 'members'
  | 'totalMembers'
  | 'totalHealth'
  | 'totalStrength'
  | 'totalAgility'
  | 'totalIntelligence'
  | 'totalArmor'
  | 'totalCritChance'
>;

export const create = async (guild: GuildOnCreate): Promise<IGuild> => {
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

export const findOneByQuery = async (
  query: Partial<IGuild>
): Promise<IGuild> => {
  return (
    (await Guild.findOne(query).populate(populateCharacters())) ||
    throwGuildNotFoundError()
  );
};

export const findById = async (id: string): Promise<IGuild> => {
  return (
    (await Guild.findById(id).populate(populateCharacters())) ||
    throwGuildNotFoundError()
  );
};

export const findByName = async (name: string): Promise<IGuild> => {
  return (
    (await Guild.findOne({ name }).populate(populateCharacters())) ||
    throwGuildNotFoundError()
  );
};

export const findMultipleByName = async (
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

export const isUnique = async ({
  name,
}: {
  name: string;
}): Promise<IGuild | null> => {
  return await Guild.findOne({ name });
};

export const updateById = async (
  id: string,
  query: Partial<IGuildWithoutId>
): Promise<IGuild> => {
  return (
    (await Guild.findByIdAndUpdate(id, query, {
      new: true,
      runValidators: true,
    }).populate(populateCharacters())) || throwGuildNotFoundError()
  );
};

export const deleteById = async (id: string): Promise<IGuild> => {
  return (await Guild.findByIdAndDelete(id)) || throwGuildNotFoundError();
};

export const deleteAll = async (): Promise<{
  acknowledged: boolean;
  deletedCount: number;
}> => {
  return await Guild.deleteMany();
};

export const addCharacterToGuild = async (
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

export const removeCharacterFromGuild = async (
  character: ICharacter
): Promise<IGuild> => {
  if (!character.guild) {
    throw new Error('Character guild doesn\'t exist');
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
  throw new Error('Guild not found.');
};
