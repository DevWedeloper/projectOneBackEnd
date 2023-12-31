import dotenv from 'dotenv';
import mongoose, { connect } from 'mongoose';
import * as Character from '../models/characterModel';
import * as Guild from '../models/guildModel';
import { IGuild } from '../types/guildType';
import { joinGuild } from '../utils/guildCharacterUtils';
dotenv.config({ path: '../../.env' });

let availableGuilds: IGuild[] = [];

const connectToDatabase = async () => {
  try {
    await connect(process.env.DB_URL!);
    console.log('DB connected');
    await fetchAvailableGuilds();
    await populateGuildsWithCharacters();
    mongoose.disconnect();
  } catch (err) {
    console.error('Error connecting to DB:', err);
  }
};

connectToDatabase();

const populateGuildsWithCharacters = async () => {
  try {
    const characters = await Character.getAllWithoutGuild();
    for (const character of characters) {
      if (Math.random() < 0.8) {
        const randomGuild = availableGuilds[Math.floor(Math.random() * availableGuilds.length)];
        try {
          await joinGuild(character, randomGuild);
          console.log(
            `Character ${character.name} joined guild ${randomGuild.name}`
          );
        } catch (error) {
          if (error instanceof Error) {
            if (error.message === 'Failed to join guild') {
              console.log(
                `Skipped joining guild ${randomGuild.name} due to member limit.`
              );
              availableGuilds.splice(availableGuilds.indexOf(randomGuild), 1);
            } else {
              console.error(
                `Some other error: ${randomGuild.name}: ${error.message}`
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
        error.message
      );
    }
  }
};

const fetchAvailableGuilds = async () => {
  try {
    availableGuilds = await Guild.getAll();
    if (availableGuilds.length === 0) {
      throw new Error('No available guilds found in the database to choose from.');
    }
  } catch (error) {
    if (error instanceof Error) {
      throw new Error('Failed to fetch available guilds: ' + error.message);
    }
  }
};