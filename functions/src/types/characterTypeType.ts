export type ICharacterType = {
  _id: string;
  typeName: string;
}

export type ICharacterTypeWithoutId = Omit<ICharacterType, '_id'>;