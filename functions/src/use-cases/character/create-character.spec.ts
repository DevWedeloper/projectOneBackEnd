import { CharacterService } from '..';
import { validCharacterData } from '../../__tests__/character/character';
import { closeConnection } from '../../data-access/db';
import { ICharacter } from '../../types/character.type';
import { UniqueConstraintError } from '../../utils/errors';
import { createCharacter } from '../types/character.type';

describe('createCharacter', () => {
  let createCharacter: createCharacter;
  let character: ICharacter;

  beforeAll(() => {
    createCharacter = CharacterService.createCharacter;
  });

  afterAll(async () => {
    await CharacterService.deleteCharacterById(character._id, character);
    closeConnection();
  });

  it('should create a character', async () => {
    const createdCharacter = await createCharacter(validCharacterData);

    character = createdCharacter;

    expect(createdCharacter).toBeDefined();
    expect(createdCharacter.name).toEqual(validCharacterData.name);
    expect(createdCharacter.characterType).toEqual(
      validCharacterData.characterType,
    );
    expect(createdCharacter.health).toEqual(validCharacterData.health);
    expect(createdCharacter.strength).toEqual(validCharacterData.strength);
    expect(createdCharacter.agility).toEqual(validCharacterData.agility);
    expect(createdCharacter.intelligence).toEqual(
      validCharacterData.intelligence,
    );
    expect(createdCharacter.armor).toEqual(validCharacterData.armor);
    expect(createdCharacter.critChance).toEqual(validCharacterData.critChance);
    expect(createdCharacter.guild).toEqual(validCharacterData.guild);
  });

  it('should throw an error if character name is not unique', async () => {
    await expect(createCharacter(validCharacterData)).rejects.toThrow(
      UniqueConstraintError,
    );
  });
});
