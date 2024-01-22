import { ICharacter } from '../../types/character.type';
import { InvalidOperationError } from '../../utils/errors';
import { requiredParam } from '../../utils/validation-utils';

export const makeCheckGuildRelation = () => {
  const checkGuildRelation = (character: ICharacter) => {
    requiredParam(character, 'Character');

    if (character?.guild === null) {
      return { hasNoGuild: true };
    }

    if (
      character?.guild !== null &&
      character?._id.toString() !== character?.guild?.leader._id.toString()
    ) {
      return { memberOfGuild: true };
    }

    if (
      character?.guild !== null &&
      character?._id.toString() === character?.guild?.leader._id.toString()
    ) {
      return { leaderOfGuild: true };
    }

    throw new InvalidOperationError('Guild relation status not determined.');
  };
  return checkGuildRelation;
};
