import { CharacterStatsDb } from '../../data-access/types/data-access.type';

export const makeGetCharacterDistributionByType = ({
  characterStatsDb,
}: {
  characterStatsDb: CharacterStatsDb;
}) => {
  const getCharacterDistributionByType = async () => {
    return characterStatsDb.getCharacterDistributionByType();
  };
  return getCharacterDistributionByType;
};
