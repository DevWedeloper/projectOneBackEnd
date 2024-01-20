import {
  CharacterService,
  CharacterStatsService,
  CharacterTypeService,
  GuildService,
  GuildStatsService,
  isUniqueService,
  membershipService,
} from '../use-cases';
import { makeGetAverageCharacterStatsEndpoint } from './character-stats/get-average-character-stats';
import { makeGetCharacterDistributionByTypeEndpoint } from './character-stats/get-character-distribution-by-type';
import { makeGetTopCharactersByAttributeEndpoint } from './character-stats/get-top-characters-by-attribute';
import { makeGetTopWellRoundedCharactersEndpoint } from './character-stats/get-top-well-rounded-characters';
import { makeGetAllCharacterTypesEndpoint } from './character-type/get-all-character-types';
import { makeCheckGuildRelationStatusEndpoint } from './character/check-guild-relation';
import { makeCreateCharacterEndpoint } from './character/create-character';
import { makeDeleteAllCharactersEndpoint } from './character/delete-all-characters';
import { makeDeleteCharacterByIdEndpoint } from './character/delete-character-by-id';
import { makeGetCharacterByIdEndpoint } from './character/get-character-by-id';
import { makeGetCharacterByNameEndpoint } from './character/get-character-by-name';
import { makeGetPaginatedCharactersEndpoint } from './character/get-paginated-characters';
import { makeJoinGuildByIdEndpoint } from './character/join-guild-by-id';
import { makeLeaveGuildByIdEndpoint } from './character/leave-guild-by-id';
import { makeSearchCharactersByNameEndpoint } from './character/search-characters-by-name';
import { makeUpdateCharacterAttributeByIdEndpoint } from './character/update-character-attribute-by-id';
import { makeGetTopGuildsByAttributeEndpoint } from './guild-stats/get-top-guilds-by-attribute';
import { makeGetTopGuildsByAverageAttributeEndpoint } from './guild-stats/get-top-guilds-by-average-attribute';
import { makeGetTopWellRoundedGuildsEndpoint } from './guild-stats/get-top-well-rounded-guild';
import { makeAddMemberToGuildByIdEndpoint } from './guild/add-member-to-guild-by-id';
import { makeCreateGuildEndpoint } from './guild/create-guild';
import { makeDeleteAllGuildsEndpoint } from './guild/delete-all-guilds';
import { makeDeleteGuildByIdEndpoint } from './guild/delete-guild-by-id';
import { makeGetGuildByIdEndpoint } from './guild/get-guild-by-id';
import { makeGetGuildByNameEndpoint } from './guild/get-guild-by-name';
import { makeGetPaginatedGuildsEndpoint } from './guild/get-paginated-guilds';
import { makeIsGuildFullEndpoint } from './guild/is-guild-full';
import { makeRemoveMemberFromGuildByIdEndpoint } from './guild/remove-member-from-guild-by-id';
import { makeSearchGuildMemberByIdEndpoint } from './guild/search-guild-member-by-id';
import { makeSearchGuildsByNameEndpoint } from './guild/search-guilds-by-name';
import { makeUpdateGuildLeaderByIdEndpoint } from './guild/update-guild-leader-by-id';
import { makeUpdateGuildNameByIdEndpoint } from './guild/update-guild-name-by-id';
import { makeIsCharacterNameUniqueEndpoint } from './is-unique/is-character-unique';
import { makeIsGuildNameUniqueEndpoint } from './is-unique/is-guild-unique';
import { makeIsMemberEndpoint } from './membership/is-member';
import { makeIsNotMemberEndpoint } from './membership/is-not-member';

export const createCharacterEndpoint = makeCreateCharacterEndpoint({
  createCharacter: CharacterService.createCharacter,
});
export const getPaginatedCharactersEndpoint =
  makeGetPaginatedCharactersEndpoint({
    getPaginatedCharacters: CharacterService.getPaginatedCharacters,
  });
export const getCharacterByIdEndpoint = makeGetCharacterByIdEndpoint({
  getCharacterById: CharacterService.getCharacterById,
});
export const getCharacterByNameEndpoint = makeGetCharacterByNameEndpoint({
  getCharacterByName: CharacterService.getCharacterByName,
});
export const searchCharactersByNameEndpoint =
  makeSearchCharactersByNameEndpoint({
    searchCharactersByName: CharacterService.searchCharactersByName,
  });
export const updateCharacterAttributeByIdEndpoint =
  makeUpdateCharacterAttributeByIdEndpoint({
    updateCharacterAttributeById: CharacterService.updateCharacterAttributeById,
  });
export const joinGuildByIdEndpoint = makeJoinGuildByIdEndpoint({
  joinGuildById: CharacterService.joinGuildById,
});
export const leaveGuildByIdEndpoint = makeLeaveGuildByIdEndpoint({
  leaveGuildById: CharacterService.leaveGuildById,
});
export const deleteCharacterByIdEndpoint = makeDeleteCharacterByIdEndpoint({
  deleteCharacterById: CharacterService.deleteCharacterById,
});
export const deleteAllCharactersEndpoint = makeDeleteAllCharactersEndpoint({
  deleteAllCharacters: CharacterService.deleteAllCharacters,
});
export const checkGuildRelationStatusEnpoint =
  makeCheckGuildRelationStatusEndpoint({
    checkGuildRelation: CharacterService.checkGuildRelation,
  });

export const createGuildEndpoint = makeCreateGuildEndpoint({
  createGuild: GuildService.createGuild,
});
export const getPaginatedGuildsEndpoint = makeGetPaginatedGuildsEndpoint({
  getPaginatedGuilds: GuildService.getPaginatedGuilds,
});
export const getGuildByIdEndpoint = makeGetGuildByIdEndpoint({
  getGuildById: GuildService.getGuildById,
});
export const getGuildByNameEndpoint = makeGetGuildByNameEndpoint({
  getGuildByName: GuildService.getGuildByName,
});
export const searchGuildsByNameEndpoint = makeSearchGuildsByNameEndpoint({
  searchGuildsByName: GuildService.searchGuildsByName,
});
export const searchGuildMemberByIdEndpoint = makeSearchGuildMemberByIdEndpoint({
  searchGuildMemberById: GuildService.searchGuildMemberById,
});
export const updateGuildNameByIdEndpoint = makeUpdateGuildNameByIdEndpoint({
  updateGuildNameById: GuildService.updateGuildNameById,
});
export const updateGuildLeaderByIdEndpoint = makeUpdateGuildLeaderByIdEndpoint({
  updateGuildLeaderById: GuildService.updateGuildLeaderById,
});
export const addMemberToGuildByIdEndpoint = makeAddMemberToGuildByIdEndpoint({
  addMemberToGuildById: GuildService.addMemberToGuildById,
});
export const removeMemberFromGuildByIdEndpoint =
  makeRemoveMemberFromGuildByIdEndpoint({
    removeMemberFromGuildById: GuildService.removeMemberFromGuildById,
  });
export const deleteGuildByIdEndpoint = makeDeleteGuildByIdEndpoint({
  deleteGuildById: GuildService.deleteGuildById,
});
export const deleteAllGuildsEndpoint = makeDeleteAllGuildsEndpoint({
  deleteAllGuilds: GuildService.deleteAllGuilds,
});
export const isGuildFullEndpoint = makeIsGuildFullEndpoint({
  isGuildFull: GuildService.isGuildFull,
});

export const getTopCharactersByAttributeEndpoint =
  makeGetTopCharactersByAttributeEndpoint({
    getTopCharactersByAttribute:
      CharacterStatsService.getTopCharactersByAttribute,
  });
export const getTopWellRoundedCharactersEndpoint =
  makeGetTopWellRoundedCharactersEndpoint({
    getTopWellRoundedCharacters:
      CharacterStatsService.getTopWellRoundedCharacters,
  });
export const getAverageCharacterStatsEndpoint =
  makeGetAverageCharacterStatsEndpoint({
    getAverageCharacterStats: CharacterStatsService.getAverageCharacterStats,
  });
export const getCharacterDistributionByTypeEndpoint =
  makeGetCharacterDistributionByTypeEndpoint({
    getCharacterDistributionByType:
      CharacterStatsService.getCharacterDistributionByType,
  });

export const getTopGuildsByAttributeEndpoint =
  makeGetTopGuildsByAttributeEndpoint({
    getTopGuildsByAttribute: GuildStatsService.getTopGuildsByAttribute,
  });
export const getTopWellRoundedGuildsEndpoint =
  makeGetTopWellRoundedGuildsEndpoint({
    getTopWellRoundedGuilds: GuildStatsService.getTopWellRoundedGuilds,
  });
export const getTopGuildsByAverageAttributeEndpoint =
  makeGetTopGuildsByAverageAttributeEndpoint({
    getTopGuildsByAverageAttribute:
      GuildStatsService.getTopGuildsByAverageAttribute,
  });

export const getAllCharacterTypesEndpoint = makeGetAllCharacterTypesEndpoint({
  getAllCharacterTypes: CharacterTypeService.getAllCharacterTypes,
});

export const isCharacterNameUniqueEndpoint = makeIsCharacterNameUniqueEndpoint({
  isCharacterNameUnique: isUniqueService.isCharacterNameUnique,
});
export const isGuildNameUniqueEndpoint = makeIsGuildNameUniqueEndpoint({
  isGuildNameUnique: isUniqueService.isGuildNameUnique,
});

export const isMemberEndpoint = makeIsMemberEndpoint({
  isMember: membershipService.isMember,
});
export const isNotMemberEndpoint = makeIsNotMemberEndpoint({
  isNotMember: membershipService.isNotMember,
});
