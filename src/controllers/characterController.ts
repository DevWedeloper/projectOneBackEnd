import { Request, Response } from 'express';
import { Character, ICharacterDocument } from '../models/characterModel';
import { Guild, IGuildDocument } from '../models/guildModel';
import { joinGuild, leaveGuild, updateLeaderAndDeleteGuild, updateLeaderOrMembersGuild, isLeader, isDifferentGuild } from '../utils/guildCharacterUtils';

export const createCharacter = async (req: Request, res: Response) => {
  try {
    let savedCharacter: ICharacterDocument = await Character.create(req.body);
    return res.status(201).json({ message: 'Character created successfully', character: savedCharacter });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to create the character', message: error.message });
  }
};

export const getAllCharacters = async (req: Request, res: Response) => {
  try {
    const page: number = parseInt(req.query.page as string) || 1;
    const pageSize: number = parseInt(req.query.pageSize as string) || 10;

    const totalCharacters: number = await Character.countDocuments();
    const totalPages: number = Math.ceil(totalCharacters / pageSize);

    const characters: ICharacterDocument[] = await Character.find()
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .populate('guild');

    return res.json({
      page,
      pageSize,
      totalPages,
      totalCharacters,
      characters,
    });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to retrieve characters', message: error.message });
  }
};

export const getCharacterById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const character: ICharacterDocument | null = await Character.findById(id).populate('guild');
    
    if (!character) {
      return res.status(404).json({ error: 'Character not found' });
    } 

    return res.json(character);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to retrieve the character', message: error.message });
  }
};

export const updateCharacterNameById = async (req: Request, res: Response) => {
  try {
    await updateCharacterAttributeById(req, res, 'name');
  } catch (error) {
    return res.status(500).json({ error: 'Failed to update character\'s name', message: error.message });
  }
}

export const updateCharacterTypeById = async (req: Request, res: Response) => {
  try {
    await updateCharacterAttributeById(req, res, 'characterType');
  } catch (error) {
    return res.status(500).json({ error: 'Failed to update character\'s characterType', message: error.message });
  }
}

export const updateCharacterHealthById = async (req: Request, res: Response) => {
  try {
    await updateCharacterAttributeById(req, res, 'health');
  } catch (error) {
    return res.status(500).json({ error: 'Failed to update character\'s health', message: error.message });
  }
}

export const updateCharacterStrengthById = async (req: Request, res: Response) => {
  try {
    await updateCharacterAttributeById(req, res, 'strength');
  } catch (error) {
    return res.status(500).json({ error: 'Failed to update character\'s strength', message: error.message });
  }
}

export const updateCharacterAgilityById = async (req: Request, res: Response) => {
  try {
    await updateCharacterAttributeById(req, res, 'agility');
  } catch (error) {
    return res.status(500).json({ error: 'Failed to update character\'s agility', message: error.message });
  }
}

export const updateCharacterIntelligenceById = async (req: Request, res: Response) => {
  try {
    await updateCharacterAttributeById(req, res, 'intelligence');
  } catch (error) {
    return res.status(500).json({ error: 'Failed to update character\'s intelligence', message: error.message });
  }
}

export const updateCharacterArmorById = async (req: Request, res: Response) => {
  try {
    await updateCharacterAttributeById(req, res, 'armor');
  } catch (error) {
    return res.status(500).json({ error: 'Failed to update character\'s armor', message: error.message });
  }
}

export const updateCharacterCritChanceById = async (req: Request, res: Response) => {
  try {
    await updateCharacterAttributeById(req, res, 'critChance');
  } catch (error) {
    return res.status(500).json({ error: 'Failed to update character\'s critChance', message: error.message });
  }
}

export const joinGuildById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { character, guild } = req.body;

    if (character.guild) {
      const previousGuild: IGuildDocument | null = await Guild.findById(character.guild);
      if (!previousGuild) {
        return res.status(404).json({ error: 'Current guild not found' });
      }
      
      if (isDifferentGuild(previousGuild, guild._id.toString())) {
        await updateLeaderOrMembersGuild(previousGuild, id);
      } else {
        return res.status(400).json({ error: 'Already a member of this guild' });
      }
    }

    await joinGuild(character._id, guild);
    const updatedCharacter = await Character.findById(id);
    if (!updatedCharacter) {
      return res.status(404).json({ error: 'Character not found' });
    }

    return res.json({ message: 'Joined guild successfully.', updatedCharacter });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to join guild', message: error.message });
  }
}

export const leaveGuildById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { character } = req.body;

    if (character.guild === null) {
      return res.status(404).json({ error: 'Character doesn\'t have a guild' });
    }

    const previousGuild: IGuildDocument | null = await Guild.findById(character.guild);
    if (!previousGuild) {
      return res.status(404).json({ error: 'Current guild not found' });
    }
    await updateLeaderOrMembersGuild(previousGuild, id);

    const updatedCharacter = await Character.findById(id);
    if (!updatedCharacter) {
      return res.status(404).json({ error: 'Character not found' });
    }

    return res.json({ message: 'Left guild successfully.', updatedCharacter });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to leave guild', message: error.message });
  }
}

export const deleteCharacterById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { character } = req.body;
    if (character.guild) {
      const guildId = character.guild as IGuildDocument['_id'];
      const guild = await Guild.findById(guildId);
      if (guild) {
        if (isLeader(guild, id)) {
          await updateLeaderAndDeleteGuild(guild);
        } else {
          await leaveGuild(id);
        }
      }
    }

    await Character.findByIdAndDelete(id);
    return res.json({ message: 'Character deleted successfully.', character: character });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to delete the character', message: error.message });
  }
};

export const deleteAllCharacters = async (req: Request, res: Response) => {
  try {
    const [characterDeletionResult, guildDeletionResult] = await Promise.all([
      Character.deleteMany({}),
      Guild.deleteMany({}),
    ]);

    return res.json({
      message: `${characterDeletionResult.deletedCount} characters and ${guildDeletionResult.deletedCount} guilds deleted successfully.`,
    });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to delete characters and guilds.', message: error.message });
  }
};

async function updateCharacterAttributeById(req: Request, res: Response, attributeName: string) {
  try {
    const { id } = req.params;
    const { [attributeName]: attributeValue } = req.body;

    const updateQuery = { [attributeName]: attributeValue };

    const updatedCharacter: ICharacterDocument | null = await Character.findByIdAndUpdate(
      id,
      updateQuery,
      { new: true, runValidators: true }
    );

    if (!updatedCharacter) {
      return res.status(404).json({ error: 'Character not found' });
    } 

    return res.json({ message: `Character's ${attributeName} updated successfully.`, character: updatedCharacter });
  } catch (error) {
    return res.status(500).json({ error: `Failed to update character's ${attributeName}`, message: error.message });
  }
}