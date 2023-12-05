import { Schema, model } from 'mongoose';

export interface ICharacterType {
  _id: string;
  typeName: string;
}

export type ICharacterTypeWithoutId = Omit<ICharacterType, '_id'>;

const characterTypeSchema = new Schema<ICharacterTypeWithoutId>({
  typeName: { type: String, required: true, unique: true },
});

export const CharacterType = model<ICharacterTypeWithoutId>(
  'CharacterType',
  characterTypeSchema
);

export const getAll = async (): Promise<ICharacterType[]> => {
  return CharacterType.find();
};
