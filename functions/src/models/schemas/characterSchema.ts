import { Schema, model } from 'mongoose';
import { ICharacterWithoutId } from '../../types/characterTypes';

const characterSchema = new Schema<ICharacterWithoutId>({
  name: {
    type: String,
    required: true,
    unique: true,
    minlength: 6,
    maxlength: 20,
    match: /^[A-Za-z0-9_]*$/,
    index: true,
  },
  characterType: { type: String, required: true },
  health: { type: Number, required: true, min: 1000, max: 10000 },
  strength: { type: Number, required: true, min: 1, max: 100 },
  agility: { type: Number, required: true, min: 1, max: 100 },
  intelligence: { type: Number, required: true, min: 1, max: 100 },
  armor: { type: Number, required: true, min: 1, max: 100 },
  critChance: { type: Number, required: true, min: 0.01, max: 1 },
  guild: { type: Schema.Types.ObjectId, ref: 'Guild', default: null },
});

export const Character = model<ICharacterWithoutId>(
  'Character',
  characterSchema
);