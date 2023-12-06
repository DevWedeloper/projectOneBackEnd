import { ICharacter } from './characterTypes';

export type IGuild = {
  _id: string;
  name: string;
  leader: ICharacter;
  members?: ICharacter[];
  totalMembers: number;
  maxMembers: number;
  totalHealth?: number;
  totalStrength?: number;
  totalAgility?: number;
  totalIntelligence?: number;
  totalArmor?: number;
  totalCritChance?: number;
}

export type IGuildWithoutId = Omit<IGuild, '_id'>;