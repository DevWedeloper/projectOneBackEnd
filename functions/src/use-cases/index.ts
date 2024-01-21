import { verify } from 'jsonwebtoken';
import {
  characterDb,
  characterStatsDb,
  characterTypeDb,
  guildDb,
  guildStatsDb,
} from '../data-access';
import { makeGetAverageCharacterStats } from './character-stats/get-average-character-stats';
import { makeGetCharacterDistributionByType } from './character-stats/get-character-distribution-by-type';
import { makeGetTopCharactersByAttribute } from './character-stats/get-top-characters-by-attribute';
import { makeGetTopWellRoundedCharacters } from './character-stats/get-top-well-rounded-characters';
import { makeGetPaginatedCharacterTypes } from './character-type/get-all-character-types';
import { makeGetCharacterType } from './character-type/get-character-type';
import { makePopulate } from './character-type/populate';
import { makeCheckGuildRelation } from './character/check-guild-relation';
import { makeCreateCharacter } from './character/create-character';
import { makeDeleteAllCharacters } from './character/delete-all-characters';
import { makeDeleteCharacterById } from './character/delete-character-by-id';
import { makeGetPaginatedWithoutGuild } from './character/get-all-without-guild';
import { makeGetCharacterById } from './character/get-character-by-id';
import { makeGetCharacterByName } from './character/get-character-by-name';
import { makeGetCharacterByNameOrId } from './character/get-character-by-name-or-id';
import { makeGetPaginatedCharacters } from './character/get-paginated-characters';
import { makeJoinGuildById } from './character/join-guild-by-id';
import { makeLeaveGuildById } from './character/leave-guild-by-id';
import { makeSearchCharactersByName } from './character/search-characters-by-name';
import { makeUpdateCharacterAttributeById } from './character/update-character-attribute-by-id';
import { makeGetTopGuildsByAttribute } from './guild-stats/get-top-guilds-by-attribute';
import { makeGetTopGuildsByAverageAttribute } from './guild-stats/get-top-guilds-by-average-attribute';
import { makeGetTopWellRoundedGuilds } from './guild-stats/get-top-well-rounded-guilds';
import { makeAddMemberToGuildById } from './guild/add-member-to-guild-by-id';
import { makeCreateGuild } from './guild/create-guild';
import { makeDeleteAllGuilds } from './guild/delete-all-guilds';
import { makeDeleteGuildById } from './guild/delete-guild-by-id';
import { makeGetAllGuilds } from './guild/get-all-guilds';
import { makeGetGuildById } from './guild/get-guild-by-id';
import { makeGetGuildByName } from './guild/get-guild-by-name';
import { makeGetGuildByNameOrId } from './guild/get-guild-by-name-or-id';
import { makeGetPaginatedGuilds } from './guild/get-paginated-guilds';
import { makeIsGuildFull } from './guild/is-guild-full';
import { makeRemoveMemberFromGuildById } from './guild/remove-member-from-guild-by-id';
import { makeSearchGuildMemberById } from './guild/search-guild-member-by-id';
import { makeSearchGuildsByName } from './guild/search-guilds-by-name';
import { makeUpdateGuildLeaderById } from './guild/update-guild-leader-by-id';
import { makeUpdateGuildNameById } from './guild/update-guild-name-by-id';
import { makeIsAdmin } from './is-admin';
import { makeIsCharacterUnique } from './is-unique/is-character-unique';
import { makeIsGuildUnique } from './is-unique/is-guild-unique';
import { makeIsMember } from './membership/is-member';
import { makeIsNotMember } from './membership/is-not-member';
import { makeGuildCharacterUtils } from './utils/guild-character-utils';

const createCharacter = makeCreateCharacter({ characterDb });
const getPaginatedCharacters = makeGetPaginatedCharacters({ characterDb });
const getCharacterById = makeGetCharacterById({ characterDb });
const getCharacterByName = makeGetCharacterByName({ characterDb });
const searchCharactersByName = makeSearchCharactersByName({
  characterDb,
});
const updateCharacterAttributeById = makeUpdateCharacterAttributeById({
  characterDb,
});
const joinGuildById = makeJoinGuildById({ characterDb, guildDb });
const leaveGuildById = makeLeaveGuildById({ characterDb, guildDb });
const deleteCharacterById = makeDeleteCharacterById({ characterDb });
const deleteAllCharacters = makeDeleteAllCharacters({
  characterDb,
  guildDb,
});
const checkGuildRelation = makeCheckGuildRelation();
const getCharacterByNameOrId = makeGetCharacterByNameOrId({ characterDb });
const getAllWithoutGuild = makeGetPaginatedWithoutGuild({ characterDb });

export const CharacterService = Object.freeze({
  createCharacter,
  getPaginatedCharacters,
  getCharacterById,
  getCharacterByName,
  searchCharactersByName,
  updateCharacterAttributeById,
  joinGuildById,
  leaveGuildById,
  deleteCharacterById,
  deleteAllCharacters,
  checkGuildRelation,
  getCharacterByNameOrId,
  getAllWithoutGuild,
});

const createGuild = makeCreateGuild({ guildDb });
const getPaginatedGuilds = makeGetPaginatedGuilds({ guildDb });
const getGuildById = makeGetGuildById({ guildDb });
const getGuildByName = makeGetGuildByName({ guildDb });
const searchGuildsByName = makeSearchGuildsByName({ guildDb });
const searchGuildMemberById = makeSearchGuildMemberById({ guildDb });
const updateGuildNameById = makeUpdateGuildNameById({ guildDb });
const updateGuildLeaderById = makeUpdateGuildLeaderById({ guildDb });
const addMemberToGuildById = makeAddMemberToGuildById({ guildDb });
const removeMemberFromGuildById = makeRemoveMemberFromGuildById({ guildDb });
const deleteGuildById = makeDeleteGuildById();
const deleteAllGuilds = makeDeleteAllGuilds({ characterDb, guildDb });
const isGuildFull = makeIsGuildFull();
const getGuildByNameOrId = makeGetGuildByNameOrId({ guildDb });
const getAllGuilds = makeGetAllGuilds({ guildDb });

export const GuildService = Object.freeze({
  createGuild,
  getPaginatedGuilds,
  getGuildById,
  getGuildByName,
  searchGuildsByName,
  searchGuildMemberById,
  updateGuildNameById,
  updateGuildLeaderById,
  addMemberToGuildById,
  removeMemberFromGuildById,
  deleteGuildById,
  deleteAllGuilds,
  isGuildFull,
  getGuildByNameOrId,
  getAllGuilds,
});

export const guildCharacterUtils = makeGuildCharacterUtils({
  characterDb,
  guildDb,
});

const getTopCharactersByAttribute = makeGetTopCharactersByAttribute({
  characterStatsDb,
});
const getTopWellRoundedCharacters = makeGetTopWellRoundedCharacters({
  characterStatsDb,
});
const getAverageCharacterStats = makeGetAverageCharacterStats({
  characterStatsDb,
});
const getCharacterDistributionByType = makeGetCharacterDistributionByType({
  characterStatsDb,
});

export const CharacterStatsService = Object.freeze({
  getTopCharactersByAttribute,
  getTopWellRoundedCharacters,
  getAverageCharacterStats,
  getCharacterDistributionByType,
});

const getTopGuildsByAttribute = makeGetTopGuildsByAttribute({ guildStatsDb });
const getTopWellRoundedGuilds = makeGetTopWellRoundedGuilds({ guildStatsDb });
const getTopGuildsByAverageAttribute = makeGetTopGuildsByAverageAttribute({
  guildStatsDb,
});

export const GuildStatsService = Object.freeze({
  getTopGuildsByAttribute,
  getTopWellRoundedGuilds,
  getTopGuildsByAverageAttribute,
});

const getAllCharacterTypes = makeGetPaginatedCharacterTypes({
  characterTypeDb,
});
const getCharacterType = makeGetCharacterType({ characterTypeDb });
const populate = makePopulate({ characterTypeDb });

export const CharacterTypeService = Object.freeze({
  getAllCharacterTypes,
  getCharacterType,
  populate,
});

const isCharacterNameUnique = makeIsCharacterUnique({ characterDb });
const isGuildNameUnique = makeIsGuildUnique({ guildDb });

export const isUniqueService = Object.freeze({
  isCharacterNameUnique,
  isGuildNameUnique,
});

const isMember = makeIsMember({ characterDb, guildDb });
const isNotMember = makeIsNotMember({ characterDb, guildDb });

export const membershipService = Object.freeze({ isMember, isNotMember });

export const isAdmin = makeIsAdmin({ verify });
