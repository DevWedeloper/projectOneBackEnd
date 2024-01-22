import { Model, UpdateWriteOpResult } from 'mongoose';
import { ICharacter, ICharacterWithoutId } from '../../types/character.type';
import {
  ICharacterType,
  ICharacterTypeWithoutId,
} from '../../types/character-type.type';
import { IGuild, IGuildWithoutId } from '../../types/guild.type';
import { UniqueIdentifier } from '../../types/unique-identifier.type';
import { ValidStatsAttribute } from '../../types/valid-stat-attribute.type';

export type CharacterModel = Model<ICharacterWithoutId>;
export type GuildModel = Model<IGuildWithoutId>;
export type CharacterTypeModel = Model<ICharacterTypeWithoutId>;

export type CharacterDb = {
  create: (character: ICharacterWithoutId) => Promise<ICharacter>;
  getPaginated: (
    page: number,
    pageSize: number,
    sortBy: string,
    sortOrder: 'asc' | 'desc',
    searchQuery: string,
  ) => Promise<{
    page: number;
    pageSize: number;
    totalPages: number;
    totalCharacters: number;
    characters: ICharacter[];
  }>;
  findOneByNameOrId: (query: Partial<UniqueIdentifier>) => Promise<ICharacter>;
  findById: (id: string) => Promise<ICharacter>;
  findByName: (name: string) => Promise<ICharacter>;
  findMultipleByName: (query: string, limit: number) => Promise<ICharacter[]>;
  isUnique: (params: { name: string }) => Promise<ICharacter | null>;
  isExisting: (query: Partial<UniqueIdentifier>) => Promise<ICharacter | null>;
  updateById: (
    id: string,
    query: Partial<ICharacterWithoutId>,
  ) => Promise<ICharacter>;
  deleteById: (id: string) => Promise<ICharacter>;
  deleteAll: () => Promise<{ acknowledged: boolean; deletedCount: number }>;
  leaveAllGuild: () => Promise<UpdateWriteOpResult>;
  getAllWithoutGuild: () => Promise<ICharacter[]>;
  membersLeaveGuild: (memberList: ICharacter[]) => Promise<UpdateWriteOpResult>;
};

export type GuildDb = {
  create: (guild: IGuildWithoutId) => Promise<IGuild>;
  getAll: () => Promise<IGuild[]>;
  getPaginated: (
    page: number,
    pageSize: number,
    sortBy: string,
    sortOrder: 'asc' | 'desc',
    searchQuery: string,
  ) => Promise<{
    page: number;
    pageSize: number;
    totalPages: number;
    totalGuilds: number;
    guilds: IGuild[];
  }>;
  findOneByNameOrId: (query: Partial<UniqueIdentifier>) => Promise<IGuild>;
  findById: (id: string) => Promise<IGuild>;
  findByName: (name: string) => Promise<IGuild>;
  findMultipleByName: (query: string, limit: number) => Promise<IGuild[]>;
  findMembersByGuild: (
    guildId: string,
    query: string,
    limit: number,
  ) => Promise<ICharacter[] | null>;
  isUnique: (params: { name: string }) => Promise<IGuild | null>;
  isExisting: (query: Partial<UniqueIdentifier>) => Promise<IGuild | null>;
  updateById: (id: string, query: Partial<IGuildWithoutId>) => Promise<IGuild>;
  deleteById: (id: string) => Promise<IGuild>;
  deleteAll: () => Promise<{ acknowledged: boolean; deletedCount: number }>;
  addCharacterToGuild: (
    character: ICharacter,
    guild: IGuild,
  ) => Promise<IGuild>;
  removeCharacterFromGuild: (character: ICharacter) => Promise<IGuild>;
};

export type CharacterStatsDb = {
  getTopCharactersByAttribute: (
    attribute: ValidStatsAttribute,
    limit: number,
  ) => Promise<ICharacter[]>;
  getTopWellRoundedCharacters: (limit: number) => Promise<ICharacter[]>;
  getAverageCharacterStats: () => Promise<{
    avgHealth: number;
    avgStrength: number;
    avgAgility: number;
    avgIntelligence: number;
    avgArmor: number;
    avgCritChance: number;
  }>;
  getCharacterDistributionByType: () => Promise<ICharacter[]>;
};

export type WellRoundedGuild = IGuild & {
  membersAverage: number;
};

export type TopByAverageAttributeGuild = IGuild & {
  averageAttribute: number;
};

export type GuildStatsDb = {
  getTopGuildsByAttribute: (
    attribute: string,
    limit: number,
  ) => Promise<IGuild[]>;
  getTopWellRoundedGuilds: (limit: number) => Promise<WellRoundedGuild[]>;
  getTopGuildsByAverageAttribute: (
    attribute: string,
    limit: number,
  ) => Promise<TopByAverageAttributeGuild[]>;
};

export type CharacterTypeDb = {
  getAll: () => Promise<ICharacterType[]>;
  populate: (data: ICharacterTypeWithoutId[]) => Promise<ICharacterType[]>;
  findOne: (characterType: string) => Promise<ICharacterType>;
};
