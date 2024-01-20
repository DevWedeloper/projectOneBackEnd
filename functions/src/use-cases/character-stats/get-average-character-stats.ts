import { CharacterStatsDb } from '../../data-access/types/data-access.type';

export const makeGetAverageCharacterStats = ({
  characterStatsDb,
}: {
  characterStatsDb: CharacterStatsDb;
}) => {
  const getAverageCharacterStats = async () => {
    return characterStatsDb.getAverageCharacterStats();
  };
  return getAverageCharacterStats;
};
