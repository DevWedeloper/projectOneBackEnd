import { ICharacter } from '../../types/characterType';
import { IGuild } from '../../types/guildType';

export type createGuild = (
  name: string,
  character: ICharacter,
) => Promise<IGuild>;

export type getPaginatedGuilds = (
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

export type getGuildById = (id: string) => Promise<IGuild>;

export type getGuildByName = (name: string) => Promise<IGuild>;

export type searchGuildsByName = (
  searchQuery: string,
  limit: number,
) => Promise<IGuild[]>;

export type searchGuildMemberById = (
  guild: IGuild,
  searchQuery: string,
  limit: number,
) => Promise<ICharacter[] | null>;

export type updateGuildNameById = (id: string, name: string) => Promise<IGuild>;

export type updateGuildLeaderById = (
  id: string,
  guild: IGuild,
  character: ICharacter,
) => Promise<IGuild>;

export type addMemberToGuildById = (
  id: string,
  guild: IGuild,
  character: ICharacter,
) => Promise<IGuild>;

export type removeMemberFromGuildById = (
  id: string,
  guild: IGuild,
  character: ICharacter,
) => Promise<IGuild>;

export type deleteGuildById = (guild: IGuild) => Promise<IGuild>;

export type deleteAllGuilds = () => Promise<{
  acknowledged: boolean;
  deletedCount: number;
}>;

export type isGuildFull = (guild: IGuild) =>
  | {
      isFull: boolean;
    }
  | {
      isNotFull: boolean;
    };
