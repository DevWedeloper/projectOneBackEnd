import { CharacterType } from '../models/characterTypeModel';
import mongoose from 'mongoose';

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

const populateCharacterTypes = async () => {
    try {
      // Set the write concern in Mongoose connection options
      await mongoose.connect('mongodb://127.0.0.1:27017/projectOneDb', {
        writeConcern: {
          w: 0,
          j: false,
          wtimeout: 5000,
        },
      });
  
      // Perform the insertion of character types
      await CharacterType.insertMany(characterTypesData);
  
      // Close the connection after insertion
      await mongoose.connection.close();
  
      console.log('Character types populated successfully.');
    } catch (error) {
      console.error('Failed to populate character types:', error);
    }
  };

populateCharacterTypes();