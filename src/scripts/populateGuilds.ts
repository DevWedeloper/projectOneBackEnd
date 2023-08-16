import { Character } from '../models/characterModel';
import { Guild } from '../models/guildModel';
import mongoose, { connect } from 'mongoose';
import { joinGuild } from '../utils/guildCharacterUtils';

connect(process.env.DB_URL)
  .then(async () => {
    console.log('DB connected');
    await populateGuildsWithCharacters();
    mongoose.disconnect();
  })
  .catch((err) => {
    console.error('Error connecting to DB:', err);
});

const populateGuildsWithCharacters = async () => {
  try {
    const guilds = await Guild.find();
    if (guilds.length === 0) {
      console.error('No available guilds found in the database.');
      return;
    }

    const characters = await Character.find();
    for (const character of characters) {
      if (Math.random() < 0.8) {
        const randomGuild = guilds[Math.floor(Math.random() * guilds.length)];
        try {
          await joinGuild(character._id.toString(), randomGuild._id);
          console.log(`Character ${character.name} joined guild ${randomGuild.name}`);
        } catch (error) {
          if (error.message === 'Failed to join guild') {
            console.log(`Skipped joining guild ${randomGuild.name} due to member limit.`);
            guilds.splice(guilds.indexOf(randomGuild), 1);
          } else {
            console.error(`Some other error: ${randomGuild.name}: ${error.message}`);
          }
        }
      }
    }
  } catch (error) {
    console.error('Failed to populate guilds with characters:', error.message);
  }
};
