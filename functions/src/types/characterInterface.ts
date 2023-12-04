import { Guild } from './guildInterface';

export type Character = {
  _id: string;
  name: string;
  characterType: string;
  health: number;
  strength: number;
  agility: number;
  intelligence: number;
  armor: number;
  critChance: number;
  guild: Guild | null;
}

export type CharacterWithoutId = Omit<Character, '_id'>;