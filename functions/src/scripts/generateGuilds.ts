import dotenv from 'dotenv';
import mongoose, { connect } from 'mongoose';
import { generateUsername } from 'unique-username-generator';
import { Character, ICharacterDocument } from '../models/characterModel';
import { Guild } from '../models/guildModel';
dotenv.config({ path: '../../.env' });

const numGuildsToGenerate = 10;
let availableCharacters: ICharacterDocument[] = [];
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
      leader: leader._id,
      totalMembers: 1,
    };

    const savedGuild = await Guild.create(guildData);
    await Character.findOneAndUpdate(
      { _id: leader._id },
      { $set: { guild: savedGuild._id } }
    );
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
    availableCharacters = await Character.find();
    if (availableCharacters.length === 0) {
      console.error('No available characters found in the database to choose as guild leader.');
      return;
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error('Failed to fetch available character types:', error.message);
    }
    process.exit(1);
  }
};

const randomLeader = async (): Promise<ICharacterDocument> => {
  return availableCharacters[Math.floor(Math.random() * availableCharacters.length)];
};