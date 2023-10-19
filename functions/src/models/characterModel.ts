import { Document, Model, Schema, model } from 'mongoose';
import { IGuildDocument } from './guildModel';

interface ICharacter {
  name: string;
  characterType: string;
  health: number;
  strength: number;
  agility: number;
  intelligence: number;
  armor: number;
  critChance: number;
  guild: Schema.Types.ObjectId | IGuildDocument;
}

export interface ICharacterDocument extends ICharacter, Document {}

interface ICharacterModel extends Model<ICharacterDocument> {}

const characterSchema: Schema<ICharacterDocument, ICharacterModel> = new Schema(
  {
    name: { type: String, required: true, unique: true },
    characterType: { type: String, required: true },
    health: { type: Number, required: true, min: 1000, max: 10000 },
    strength: { type: Number, required: true, min: 1, max: 100 },
    agility: { type: Number, required: true, min: 1, max: 100 },
    intelligence: { type: Number, required: true, min: 1, max: 100 },
    armor: { type: Number, required: true, min: 1, max: 100 },
    critChance: { type: Number, required: true, min: 0.01, max: 1 },
    guild: { type: Schema.Types.ObjectId, ref: 'Guild', default: null },
  }
);

export const Character: ICharacterModel = model<
  ICharacterDocument,
  ICharacterModel
>('Character', characterSchema);
