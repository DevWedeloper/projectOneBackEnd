import { Character } from './characterInterface';

export type Guild = {
  _id: string;
  name: string;
  leader: Character;
  members: Character[];
  totalMembers: number;
  totalHealth: number;
  totalStrength: number;
  totalAgility: number;
  totalIntelligence: number;
  totalArmor: number;
  totalCritChance: number;
}

export type GuildWithoutId = Omit<Guild, '_id'>;