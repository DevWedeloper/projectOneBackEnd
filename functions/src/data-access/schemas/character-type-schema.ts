import { Schema, model } from 'mongoose';
import { ICharacterTypeWithoutId } from '../../types/character-type.type';

const characterTypeSchema = new Schema<ICharacterTypeWithoutId>({
  typeName: { type: String, required: true, unique: true },
});

export const CharacterType = model<ICharacterTypeWithoutId>(
  'CharacterType',
  characterTypeSchema,
);
