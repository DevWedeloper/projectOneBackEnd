import { ICharacter, ICharacterWithoutId } from '../../types/character.type';
import { IGuild } from '../../types/guild.type';

export type createCharacter = (
  data: ICharacterWithoutId,
) => Promise<ICharacter>;

export type getPaginatedCharacters = (
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

export type getCharacterById = (id: string) => Promise<ICharacter>;

export type getCharacterByName = (name: string) => Promise<ICharacter>;

export type searchCharactersByName = (
  searchQuery: string,
  limit: number,
) => Promise<ICharacter[]>;

export type updateCharacterAttributeById = (
  id: string,
  query: Partial<ICharacterWithoutId>,
) => Promise<ICharacter>;

export type joinGuildById = (
  id: string,
  character: ICharacter,
  guild: IGuild,
) => Promise<ICharacter>;

export type leaveGuildById = (
  id: string,
  character: ICharacter,
) => Promise<ICharacter>;

export type deleteCharacterById = (
  id: string,
  character: ICharacter,
) => Promise<ICharacter>;

export type deleteAllCharacters = () => Promise<{
  characterDeletionResult: {
    acknowledged: boolean;
    deletedCount: number;
  };
  guildDeletionResult: {
    acknowledged: boolean;
    deletedCount: number;
  };
}>;

export type checkGuildRelation = (character: ICharacter) =>
  | {
      hasNoGuild: boolean;
    }
  | {
      memberOfGuild: boolean;
    }
  | {
      leaderOfGuild: boolean;
    };

export type getAllWithoutGuild = () => Promise<ICharacter[]>;
