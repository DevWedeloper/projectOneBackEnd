import { IGuild } from '../../types/guildType';
import { InvalidOperationError } from '../../utils/errors';
import { requiredParam } from '../../utils/validation-utils';

export const makeIsGuildFull = () => {
  const isGuildFull = (guild: IGuild) => {
    requiredParam(guild, 'Guild');
    if (guild.totalMembers === guild.maxMembers) {
      return { isFull: true };
    }
    if (guild.totalMembers < guild.maxMembers) {
      return { isNotFull: true };
    }

    throw new InvalidOperationError('Guild status not determined.');
  };
  return isGuildFull;
};
