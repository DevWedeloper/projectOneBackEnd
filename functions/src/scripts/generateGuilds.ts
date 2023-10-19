import { Character } from '../models/characterModel';
import { Guild } from '../models/guildModel';
import mongoose, { connect } from 'mongoose';
import { generateUsername } from 'unique-username-generator';

connect(process.env.DB_URL!)
  .then(async () => {
    console.log('DB connected');
    const numGuildsToGenerate = 10;
    await generateRandomGuilds(numGuildsToGenerate);
    mongoose.disconnect();
  }).catch((err) => {
    console.error('Error connecting to DB:', err);
  });

const generateRandomGuild = async () => {
  try {
    const availableLeaders = await Character.find();

    if (availableLeaders.length === 0) {
      console.error('No available characters found in the database to choose as guild leader.');
      return;
    }

    const randomLeader = availableLeaders[Math.floor(Math.random() * availableLeaders.length)];

    const guildData = {
      name: generateUsername(),
      leader: randomLeader._id,
      totalMembers: 1,
    };

    const savedGuild = await Guild.create(guildData);
    console.log('Guild created successfully:', savedGuild);
  } catch (error: any) {
    console.error('Failed to create the guild:', error.message);
  }
};

const generateRandomGuilds = async (numGuilds: number) => {
  for (let i = 0; i < numGuilds; i++) {
    await generateRandomGuild();
  }
};