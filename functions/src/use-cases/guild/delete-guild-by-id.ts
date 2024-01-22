import { guildCharacterUtils } from '..';
import { makeGuild } from '../../guild/guild';
import { IGuild } from '../../types/guild.type';
import { requiredParam } from '../../utils/validation-utils';

export const makeDeleteGuildById = () => {
  const deleteGuildById = async (guild: IGuild) => {
    requiredParam(guild, 'Guild');

    makeGuild(guild);

    await guildCharacterUtils.updateLeaderAndDeleteGuild(guild);

    return guild;
  };
  return deleteGuildById;
};
