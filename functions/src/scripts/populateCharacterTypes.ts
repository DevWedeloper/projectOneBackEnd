import { CharacterTypeService } from '../use-cases';

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
    await CharacterTypeService.populate(characterTypesData);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error('Failed to populate characterTypes: ' + error);
    }
  }
};

populateCharacterTypes();