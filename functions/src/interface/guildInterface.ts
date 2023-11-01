import { Character } from './characterInterface';

export interface Guild {
  _id: string;
  name: string;
  leader: Character;
  members: Character[];
  totalMembers: number;
}

export interface GuildWithoutId {
  name: string;
  leader: Character;
  members: Character[];
  totalMembers: number;
}