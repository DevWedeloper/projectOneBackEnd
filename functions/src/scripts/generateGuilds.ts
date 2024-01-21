import { ICharacter } from '../types/characterType';
import { CharacterService, GuildService } from '../use-cases';
import { generateUsername } from '../utils/username-generator';

const numGuildsToGenerate = 10;
let availableCharacters: ICharacter[] = [];
let guildCtr = 0;

const generateRandomGuilds = async () => {
  do {
    await generateRandomGuild();
  } while (guildCtr < numGuildsToGenerate);
};

const generateRandomGuild = async () => {
  try {
    const leader = await randomLeader();
    const guild = await GuildService.createGuild(generateUsername(), leader);

    availableCharacters = availableCharacters.filter(
      (character) => character._id !== leader._id
    );
    console.log(guildCtr + 1, ' Guild created successfully:', guild.name);
    guildCtr++;
  } catch (error) {
    if (error instanceof Error) {
      console.error('Failed to create the guild:', error.message);
    }
  }
};

const fetchAvailableCharacters = async () => {
  try {
    availableCharacters = await CharacterService.getAllWithoutGuild();
    if (availableCharacters.length === 0) {
      throw new Error(
        'No available characters found in the database to choose as guild leader.'
      );
    }
  } catch (error) {
    if (error instanceof Error) {
      throw new Error('Failed to fetch available characters: ' + error.message);
    }
  }
};

const randomLeader = async (): Promise<ICharacter> => {
  return availableCharacters[
    Math.floor(Math.random() * availableCharacters.length)
  ];
};

fetchAvailableCharacters();
generateRandomGuilds();
