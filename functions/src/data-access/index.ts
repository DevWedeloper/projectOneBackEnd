import { makeCharacterDb } from './character-db';
import { makeCharacterStatsDb } from './character-stats-db';
import { makeCharacterTypeDb } from './character-type-db';
import { connectToDatabase } from './db';
import { makeGuildDb } from './guild-db';
import { makeGuildStatsDb } from './guild-stats-db';
import { Character } from './schemas/character-schema';
import { CharacterType } from './schemas/character-type-schema';
import { Guild } from './schemas/guild-schema';

const characterSchemaWrapper = () => {
  connectToDatabase();
  return Character;
};

const guildSchemaWrapper = () => {
  connectToDatabase();
  return Guild;
};

const characterTypeSchemaWrapper = () => {
  connectToDatabase;
  return CharacterType;
};

export const characterDb = makeCharacterDb({
  Character: characterSchemaWrapper(),
});

export const guildDb = makeGuildDb({
  Guild: guildSchemaWrapper(),
});

export const characterStatsDb = makeCharacterStatsDb({
  Character: characterSchemaWrapper(),
});

export const guildStatsDb = makeGuildStatsDb({ Guild: guildSchemaWrapper() });

export const characterTypeDb = makeCharacterTypeDb({
  CharacterType: characterTypeSchemaWrapper(),
});
