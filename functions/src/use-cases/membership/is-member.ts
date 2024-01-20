import { isValidObject } from '../../data-access/is-valid-object';
import { CharacterDb, GuildDb } from '../../data-access/types/data-access.type';
import { InvalidOperationError } from '../../utils/errors';
import { requiredParam } from '../../utils/validation-utils';

export const makeIsMember = ({
  characterDb,
  guildDb,
}: {
  characterDb: CharacterDb;
  guildDb: GuildDb;
}) => {
  const isMember = async (character: string, guild: string) => {
    requiredParam(character, 'Character');
    requiredParam(guild, 'Guild');

    const characterQuery = isValidObject(character)
      ? { _id: character }
      : { name: character };
    const guildQuery = isValidObject(guild) ? { _id: guild } : { name: guild };
    const foundCharacter = await characterDb.isExisting(characterQuery);
    const foundGuild = await guildDb.findOneByNameOrId(guildQuery);

    if (!foundCharacter) {
      return 'Member';
    }
    if (foundCharacter?.guild?._id.toString() === foundGuild._id.toString()) {
      return 'Member';
    }
    if (foundCharacter?.guild?._id.toString() !== foundGuild._id.toString()) {
      return 'Not member';
    }

    throw new InvalidOperationError('Membership status not determined.');
  };
  return isMember;
};
