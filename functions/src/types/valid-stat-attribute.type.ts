import { ICharacterWithoutId } from './character.type';

export type ValidStatsAttribute = keyof Pick<
  ICharacterWithoutId,
  'health' | 'strength' | 'agility' | 'intelligence' | 'armor' | 'critChance'
>;
