import { ICharacter } from '../../types/characterType';

export type getTopCharactersByAttribute = (
  attribute:
    | 'health'
    | 'strength'
    | 'agility'
    | 'intelligence'
    | 'armor'
    | 'critChance',
  limit: number,
) => Promise<ICharacter[]>;

export type getTopWellRoundedCharacters = (
  limit: number,
) => Promise<ICharacter[]>;

export type getAverageCharacterStats = () => Promise<{
  avgHealth: number;
  avgStrength: number;
  avgAgility: number;
  avgIntelligence: number;
  avgArmor: number;
  avgCritChance: number;
}>;

export type getCharacterDistributionByType = () => Promise<ICharacter[]>;
