import { ICharacterWithoutId } from './characterType';

export type ValidStatsAttribute = keyof Pick<
  ICharacterWithoutId,
  'health' | 'strength' | 'agility' | 'intelligence' | 'armor' | 'critChance'
>;
