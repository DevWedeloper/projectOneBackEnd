import { CharacterService } from '..';
import { validCharacterData } from '../../__tests__/character/character';
import { closeConnection } from '../../data-access/db';
import { ICharacter } from '../../types/character.type';
import { NotFoundError } from '../../utils/errors';
import {
  createCharacter,
  deleteCharacterById,
  getCharacterById,
} from '../types/character.type';

describe('deleteCharacterById', () => {
  let createCharacter: createCharacter;
  let deleteCharacterById: deleteCharacterById;
  let getCharacterById: getCharacterById;
  let character: ICharacter;

  beforeAll(() => {
    createCharacter = CharacterService.createCharacter;
    deleteCharacterById = CharacterService.deleteCharacterById;
    getCharacterById = CharacterService.getCharacterById;
  });

  afterAll(() => {
    closeConnection();
  });

  it('should delete a character', async () => {
    const deleteCharacter = await createCharacter(validCharacterData);

    character = deleteCharacter;

    await deleteCharacterById(deleteCharacter._id, deleteCharacter);

    await expect(getCharacterById(deleteCharacter._id)).rejects.toThrow(
      NotFoundError,
    );
  });

  it('should throw an error on non-existing character', async () => {
    await expect(deleteCharacterById(character._id, character)).rejects.toThrow(
      NotFoundError,
    );
  });
});
