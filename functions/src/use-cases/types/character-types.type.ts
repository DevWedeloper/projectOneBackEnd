import { ICharacterType } from '../../types/character-type.type';

export type getAllCharacterTypes = () => Promise<ICharacterType[]>;

export type getCharacterType = (
  characterType: string,
) => Promise<ICharacterType>;
