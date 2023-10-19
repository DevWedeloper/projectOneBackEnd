import { Character } from '../models/characterModel';
import { CharacterType } from '../models/characterTypeModel';
import mongoose, { connect } from 'mongoose';
import { generateUsername } from 'unique-username-generator';

connect(process.env.DB_URL!)
  .then(async () => {
    console.log('DB connected');
    const numCharactersToGenerate = 100;
    await generateRandomCharacters(numCharactersToGenerate);
    mongoose.disconnect();
  }).catch((err) => {
    console.error('Error connecting to DB:', err);
  });

const generateNormalRandom = (mean: number, stdDev: number): number => {
  let u = 0,
    v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  return mean + z * stdDev;
};

const generateRandomCharacter = async () => {
  try {
    const availableCharacterTypes = await CharacterType.find();

    if (availableCharacterTypes.length === 0) {
      console.error('No available character types found in the database.');
      return;
    }

    const randomCharacterType =
      availableCharacterTypes[Math.floor(Math.random() * availableCharacterTypes.length)].typeName;

    const randomCritChance = generateNormalRandom(0.5, 0.15);
    const roundedCritChance = Math.max(0.01, Math.min(1, randomCritChance));
    const roundedCritChanceTwoDecimals = Math.round(roundedCritChance * 100) / 100;

    const characterAttributes = {
      name: generateUsername(),
      characterType: randomCharacterType,
      health: Math.min(10000, Math.max(1000, Math.round(generateNormalRandom(5000, 1500)))),
      strength: Math.min(100, Math.max(1, Math.round(generateNormalRandom(50, 20)))),
      agility: Math.min(100, Math.max(1, Math.round(generateNormalRandom(50, 20)))),
      intelligence: Math.min(100, Math.max(1, Math.round(generateNormalRandom(50, 20)))),
      armor: Math.min(100, Math.max(1, Math.round(generateNormalRandom(50, 20)))),
      critChance: roundedCritChanceTwoDecimals,
    };

    const savedCharacter = await Character.create(characterAttributes);
    console.log('Character created successfully:', savedCharacter);
  } catch (error: any) {
    console.error('Failed to create the character:', error.message);
  }
};

const generateRandomCharacters = async (numCharacters: number) => {
  for (let i = 0; i < numCharacters; i++) {
    await generateRandomCharacter();
  }
};
