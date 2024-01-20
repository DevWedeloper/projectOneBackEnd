import { guildCharacterUtils } from '..';
import { makeCharacter } from '../../character/character';
import { GuildDb } from '../../data-access/types/data-access.type';
import { makeGuild } from '../../guild/guild';
import { ICharacter } from '../../types/characterType';
import {
  requiredParam,
  validateStringType,
} from '../../utils/validation-utils';

export const makeCreateGuild = ({ guildDb }: { guildDb: GuildDb }) => {
  const createGuild = async (name: string, character: ICharacter) => {
    requiredParam(name, 'Name');
    requiredParam(character, 'Character');

    validateStringType(name, 'Name');

    makeCharacter(character);

    if (character.guild) {
      await guildCharacterUtils.updateLeaderOrMembersGuild(
        character.guild,
        character._id.toString()
      );
    }

    const guildData = makeGuild({
      name,
      leader: character,
      maxMembers: 50,
      members: [],
      totalMembers: 0,
      totalHealth: 0,
      totalStrength: 0,
      totalAgility: 0,
      totalIntelligence: 0,
      totalArmor: 0,
      totalCritChance: 0,
    });

    const guild = await guildDb.create(guildData);

    await guildCharacterUtils.joinGuild(character, guild);

    return guildDb.findById(guild._id);
  };
  return createGuild;
};
