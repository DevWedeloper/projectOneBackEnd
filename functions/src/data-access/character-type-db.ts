import { Document as MongooseDocument } from 'mongoose';
import {
  ICharacterType,
  ICharacterTypeWithoutId,
} from '../types/character-type.type';
import { NotFoundError } from '../utils/errors';
import { CharacterTypeModel } from './types/data-access.type';

export const makeCharacterTypeDb = ({
  CharacterType,
}: {
  CharacterType: CharacterTypeModel;
}) => {
  const getAll = async (): Promise<ICharacterType[]> => {
    const result = await CharacterType.find().sort({ typeName: 1 });
    return result.map(mapCharacterType);
  };

  const populate = async (
    data: ICharacterTypeWithoutId[],
  ): Promise<ICharacterType[]> => {
    const result = await CharacterType.insertMany(data);
    return result.map(mapCharacterType);
  };

  const findOne = async (characterType: string): Promise<ICharacterType> => {
    return (
      (await CharacterType.findOne({ typeName: characterType })) ||
      throwCharacterTypeNotFoundError()
    );
  };

  return Object.freeze({
    getAll,
    populate,
    findOne,
  });
};

const mapCharacterType = (
  rawCharacter: MongooseDocument<unknown, unknown, ICharacterType>,
): ICharacterType => {
  const { _id, ...characterWithoutId } = rawCharacter.toObject();
  return { _id: _id.toString(), ...characterWithoutId } as ICharacterType;
};

const throwCharacterTypeNotFoundError = () => {
  throw new NotFoundError('Character Type not found.');
};
