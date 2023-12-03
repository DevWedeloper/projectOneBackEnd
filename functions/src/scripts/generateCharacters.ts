import dotenv from 'dotenv';
import mongoose, { connect } from 'mongoose';
import { generateUsername } from 'unique-username-generator';
import { Character } from '../models/characterModel';
import { CharacterType, ICharacterType } from '../models/characterTypeModel';
dotenv.config({ path: '../../.env' });

const numCharactersToGenerate = 100;
let availableCharacterTypes: ICharacterType[] = [];
let characterCtr = 0;

const connectToDatabase = async () => {
  try {
    await connect(process.env.DB_URL!);
    console.log('DB connected');
    await fetchAvailableCharacterTypes();
    await generateRandomCharacters();
    mongoose.disconnect();
  } catch (err) {
    console.error('Error connecting to DB:', err);
  }
};

connectToDatabase();

const generateRandomCharacters = async () => {
  do {
    await generateRandomCharacter();
  } while (characterCtr < numCharactersToGenerate);
};

const generateRandomCharacter = async () => {
  try {
    const character = {
      name: generateUsername('', 0, 20),
      characterType: randomCharacterType(),
      health: Math.min(
        10000,
        Math.max(1000, Math.round(generateNormalRandom(5000, 1500)))
      ),
      strength: Math.min(
        100,
        Math.max(1, Math.round(generateNormalRandom(50, 20)))
      ),
      agility: Math.min(
        100,
        Math.max(1, Math.round(generateNormalRandom(50, 20)))
      ),
      intelligence: Math.min(
        100,
        Math.max(1, Math.round(generateNormalRandom(50, 20)))
      ),
      armor: Math.min(
        100,
        Math.max(1, Math.round(generateNormalRandom(50, 20)))
      ),
      critChance: randomCritChance(),
    };

    const savedCharacter = await Character.create(character);
    console.log(characterCtr + 1, ' Character created successfully:', savedCharacter.name);
    characterCtr++;
  } catch (error) {
    if (error instanceof Error) {
      console.error('Failed to create the character:', error.message);
    }
  }
};

const fetchAvailableCharacterTypes = async () => {
  try {
    availableCharacterTypes = await CharacterType.find();
    if (availableCharacterTypes.length === 0) {
      throw new Error('No available character types found in the database.');
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error('Failed to fetch available character types:', error.message);
    }
  }
};

const generateNormalRandom = (mean: number, stdDev: number): number => {
  let u = 0,
    v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  return mean + z * stdDev;
};

const randomCritChance = (): number => {
  const randomCritChance = generateNormalRandom(0.5, 0.15);
  const roundedCritChance = Math.max(0.01, Math.min(1, randomCritChance));
  return Math.round(roundedCritChance * 100) / 100;
};

const randomCharacterType = (): string => {
  return availableCharacterTypes[
    Math.floor(Math.random() * availableCharacterTypes.length)
  ].typeName;
};