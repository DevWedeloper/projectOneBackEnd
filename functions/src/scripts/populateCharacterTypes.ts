import mongoose, { connect } from 'mongoose';
import * as CharacterType from '../models/characterTypeModel';

const characterTypesData = [
  {
    typeName: 'Warrior',
  },
  {
    typeName: 'Mage',
  },
  {
    typeName: 'Archer',
  },
  {
    typeName: 'Thief',
  },
  {
    typeName: 'Paladin',
  },
  {
    typeName: 'Wizard',
  },
  {
    typeName: 'Cleric',
  },
  {
    typeName: 'Rogue',
  },
  {
    typeName: 'Knight',
  },
  {
    typeName: 'Sorcerer',
  },
  {
    typeName: 'Ranger',
  },
  {
    typeName: 'Assassin',
  },
  {
    typeName: 'Berserker',
  },
  {
    typeName: 'Druid',
  },
  {
    typeName: 'Warlock',
  },
  {
    typeName: 'Monk',
  },
  {
    typeName: 'Summoner',
  },
  {
    typeName: 'Necromancer',
  },
  {
    typeName: 'Alchemist',
  },
  {
    typeName: 'Gunner',
  },
  {
    typeName: 'Barbarian',
  },
  {
    typeName: 'Enchanter',
  },
  {
    typeName: 'Dancer',
  },
  {
    typeName: 'Bard',
  },
  {
    typeName: 'Sentinel',
  },
  {
    typeName: 'Oracle',
  },
  {
    typeName: 'Trickster',
  },
  {
    typeName: 'Juggernaut',
  },
  {
    typeName: 'Engineer',
  },
  {
    typeName: 'Illusionist',
  },
];

const connectToDatabase = async () => {
  try {
    await connect(process.env.DB_URL!);
    console.log('DB connected');
    await populateCharacterTypes();
    mongoose.disconnect();
  } catch (err) {
    console.error('Error connecting to DB:', err);
  }
};

connectToDatabase();

const populateCharacterTypes = async () => {
  try {
    await CharacterType.populate(characterTypesData);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error('Failed to populate characterTypes: ' + error);
    }
  }
};
