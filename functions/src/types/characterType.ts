import { IGuild } from './guildType';

export type ICharacter = {
  _id: string;
  name: string;
  characterType: string;
  health: number;
  strength: number;
  agility: number;
  intelligence: number;
  armor: number;
  critChance: number;
  guild: IGuild | null;
}

export type ICharacterWithoutId = Omit<ICharacter, '_id'>;