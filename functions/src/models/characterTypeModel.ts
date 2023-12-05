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
  return await CharacterType.find();
};

export const populate = async (
  data: ICharacterTypeWithoutId[]
): Promise<ICharacterType[]> => {
  const result = await CharacterType.insertMany(data);
  return result.map((characterType) => characterType.toObject());
};

export const findOne = async (
  characterType: string
): Promise<ICharacterType | null> => {
  return (
    (await CharacterType.findOne({ typeName: characterType }))?.toObject() ||
    null
  );
};
