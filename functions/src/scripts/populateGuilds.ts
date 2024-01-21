import { IGuild } from '../types/guildType';
import {
  CharacterService,
  GuildService,
  guildCharacterUtils,
} from '../use-cases';

let availableGuilds: IGuild[] = [];

const populateGuildsWithCharacters = async () => {
  try {
    const characters = await CharacterService.getAllWithoutGuild();
    for (const character of characters) {
      if (Math.random() < 0.8) {
        const randomGuild =
          availableGuilds[Math.floor(Math.random() * availableGuilds.length)];
        try {
          await guildCharacterUtils.joinGuild(character, randomGuild);
          console.log(
            `Character ${character.name} joined guild ${randomGuild.name}`,
          );
        } catch (error) {
          if (error instanceof Error) {
            if (error.message === 'Failed to join guild') {
              console.log(
                `Skipped joining guild ${randomGuild.name} due to member limit.`,
              );
              availableGuilds.splice(availableGuilds.indexOf(randomGuild), 1);
            } else {
              console.error(
                `Some other error: ${randomGuild.name}: ${error.message}`,
              );
            }
          }
        }
      }
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error(
        'Failed to populate guilds with characters:',
        error.message,
      );
    }
  }
};

const fetchAvailableGuilds = async () => {
  try {
    availableGuilds = await GuildService.getAllGuilds();
    if (availableGuilds.length === 0) {
      throw new Error(
        'No available guilds found in the database to choose from.',
      );
    }
  } catch (error) {
    if (error instanceof Error) {
      throw new Error('Failed to fetch available guilds: ' + error.message);
    }
  }
};

fetchAvailableGuilds();
populateGuildsWithCharacters();
