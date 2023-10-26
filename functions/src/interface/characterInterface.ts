import { Guild } from './guildInterface';

export interface Character {
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

export interface CharacterWithoutId {
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
