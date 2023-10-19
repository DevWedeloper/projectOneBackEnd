import { Document, Model, Schema, model } from 'mongoose';

export interface ICharacterType {
  typeName: string;
}

export interface ICharacterTypeDocument extends ICharacterType, Document {}

interface ICharacterTypeModel extends Model<ICharacterTypeDocument> {}

const characterTypeSchema: Schema<ICharacterTypeDocument, ICharacterTypeModel> = new Schema({
  typeName: { type: String, required: true, unique: true }
});

export const CharacterType: ICharacterTypeModel = model<ICharacterTypeDocument, ICharacterTypeModel>('CharacterType', characterTypeSchema);