import { Schema, model, Document as MongooseDocument } from 'mongoose';

export interface ICharacterType {
  _id: string;
  typeName: string;
}

export type ICharacterTypeWithoutId = Omit<ICharacterType, '_id'>;

const characterTypeSchema = new Schema<ICharacterTypeWithoutId>({
  typeName: { type: String, required: true, unique: true },
});

const CharacterType = model<ICharacterTypeWithoutId>(
  'CharacterType',
  characterTypeSchema
);

export const getAll = async (): Promise<ICharacterType[]> => {
  const result = await CharacterType.find().sort({ typeName: 1 });
  return result.map(mapCharacterType);
};

export const populate = async (
  data: ICharacterTypeWithoutId[]
): Promise<ICharacterType[]> => {
  const result = await CharacterType.insertMany(data);
  return result.map(mapCharacterType);
};

export const findOne = async (
  characterType: string
): Promise<ICharacterType | null> => {
  return (
    (await CharacterType.findOne({ typeName: characterType }))?.toObject() ||
    null
  );
};

const mapCharacterType = (
  rawCharacter: MongooseDocument<unknown, unknown, ICharacterType>
): ICharacterType => {
  const { _id, ...characterWithoutId } = rawCharacter.toObject();
  return { _id: _id.toString(), ...characterWithoutId } as ICharacterType;
};
