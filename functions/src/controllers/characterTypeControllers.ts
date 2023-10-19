import { Request, Response } from 'express';
import { CharacterType } from '../models/characterTypeModel';

export const getCharacterTypes = async (req: Request, res: Response) => {
  try {
    const characterTypes = await CharacterType.find().sort({ typeName: 1 }); 
    res.json(characterTypes);
  } catch (error) {
    console.error('Error fetching character types:', error);
    res.status(500).json({ error: 'An error occurred while fetching character types.' });
  }
};
