import {
  CharacterService,
  CharacterTypeService,
  GuildService,
  isAdmin,
} from '../use-cases';
import { makeIsAdminMiddleware } from './is-admin';
import { makeCheckCharacterExistenceMiddleware } from './is-existing/check-character-existence';
import { makeCheckGuildExistenceMiddleware } from './is-existing/check-guild-existence';
import { makeIsValidCharacterTypeMiddleware } from './is-valid-character-type';
import { makeIsValidCharacterMiddleware } from './is-valid/is-valid-character';
import { makeIsValidGuildMiddleware } from './is-valid/is-valid-guild';

export const isAdminMiddleware = makeIsAdminMiddleware({ isAdmin: isAdmin });

export const isValidCharacterTypeMiddleware =
  makeIsValidCharacterTypeMiddleware({
    getCharacterType: CharacterTypeService.getCharacterType,
  });

export const checkCharacterExistenceMiddleware =
  makeCheckCharacterExistenceMiddleware({
    getCharacterById: CharacterService.getCharacterById,
  });
export const checkGuildExistenceMiddleware = makeCheckGuildExistenceMiddleware({
  getGuildById: GuildService.getGuildById,
});

export const isValidCharacterMiddleware = makeIsValidCharacterMiddleware({
  getCharacterByNameOrId: CharacterService.getCharacterByNameOrId,
});
export const isValidGuildMiddleware = makeIsValidGuildMiddleware({
  getGuildByNameOrId: GuildService.getGuildByNameOrId,
});
