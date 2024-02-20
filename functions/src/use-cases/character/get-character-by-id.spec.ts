import { CharacterService } from '..';
import { closeConnection } from '../../data-access/db';
import { validCharacterData } from '../../tests/character/character';
import { generateFakeObjectId } from '../../tests/generate-fake-mongo-id';
import { ICharacter } from '../../types/character.type';
import { NotFoundError } from '../../utils/errors';
import { createCharacter, getCharacterById } from '../types/character.type';

describe('getCharacterById', () => {
  let createCharacter: createCharacter;
  let getCharacterById: getCharacterById;
  let character: ICharacter;

  beforeAll(() => {
    createCharacter = CharacterService.createCharacter;
    getCharacterById = CharacterService.getCharacterById;
  });

  afterAll(async () => {
    await CharacterService.deleteCharacterById(character._id, character);
    closeConnection();
  });

  it('should find a character', async () => {
    const createdCharacter = await createCharacter(validCharacterData);

    character = createdCharacter;

    const foundCharacter = await getCharacterById(createdCharacter._id);

    expect(foundCharacter).toEqual(createdCharacter);
  });

  it('should throw an error for non-existent character', async () => {
    await expect(getCharacterById(generateFakeObjectId())).rejects.toThrow(
      NotFoundError,
    );
  });
});
