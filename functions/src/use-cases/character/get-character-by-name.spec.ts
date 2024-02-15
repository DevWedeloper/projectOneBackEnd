import { CharacterService } from '..';
import { validCharacterData } from '../../__tests__/character/character';
import { generateFakeName } from '../../__tests__/generate-fake-name';
import { closeConnection } from '../../data-access/db';
import { ICharacter } from '../../types/character.type';
import { NotFoundError } from '../../utils/errors';
import { createCharacter, getCharacterByName } from '../types/character.type';

describe('getCharacterByName', () => {
  let createCharacter: createCharacter;
  let getCharacterByName: getCharacterByName;
  let character: ICharacter;

  beforeAll(() => {
    createCharacter = CharacterService.createCharacter;
    getCharacterByName = CharacterService.getCharacterByName;
  });

  afterAll(async () => {
    await CharacterService.deleteCharacterById(character._id, character);
    closeConnection();
  });

  it('should find a character', async () => {
    const createdCharacter = await createCharacter(validCharacterData);

    character = createdCharacter;

    const foundCharacter = await getCharacterByName(createdCharacter.name);

    expect(foundCharacter).toEqual(createdCharacter);
  });

  it('should throw an error for non-existent character', async () => {
    await expect(getCharacterByName(generateFakeName())).rejects.toThrow(
      NotFoundError,
    );
  });
});
