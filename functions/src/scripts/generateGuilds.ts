import dotenv from 'dotenv';
import mongoose, { connect } from 'mongoose';
import { generateUsername } from 'unique-username-generator';
import { ICharacter } from '../models/characterModel';
import * as Character from '../models/characterModel';
import * as Guild from '../models/guildModel';
dotenv.config({ path: '../../.env' });

const numGuildsToGenerate = 10;
let availableCharacters: ICharacter[] = [];
let guildCtr = 0;

const connectToDatabase = async () => {
  try {
    await connect(process.env.DB_URL!);
    console.log('DB connected');
    await fetchAvailableCharacters();
    await generateRandomGuilds();
    mongoose.disconnect();
  } catch (err) {
    console.error('Error connecting to DB:', err);
  }
};

connectToDatabase();

const generateRandomGuilds = async () => {
  do {
    await generateRandomGuild();
  } while (guildCtr < numGuildsToGenerate);
};

const generateRandomGuild = async () => {
  try {
    const leader = await randomLeader();
    const guildData = {
      name: generateUsername('', 0, 20),
      leader: leader,
      maxMembers: 50,
      totalMembers: 1,
    };

    const savedGuild = await Guild.create(guildData);
    await Character.updateById(leader._id, { guild: savedGuild._id });
    availableCharacters = availableCharacters.filter(character => character._id !== leader._id);
    console.log(guildCtr + 1, ' Guild created successfully:', savedGuild.name);
    guildCtr++;
  } catch (error) {
    if (error instanceof Error) {
      console.error('Failed to create the guild:', error.message);
    }
  }
};

const fetchAvailableCharacters = async () => {
  try {
    availableCharacters = await Character.getAllWithoutGuild();
    if (availableCharacters.length === 0) {
      throw new Error('No available characters found in the database to choose as guild leader.');
    }
  } catch (error) {
    if (error instanceof Error) {
      throw new Error('Failed to fetch available characters: ' + error.message);
    }
  }
};

const randomLeader = async (): Promise<ICharacter> => {
  return availableCharacters[Math.floor(Math.random() * availableCharacters.length)];
};