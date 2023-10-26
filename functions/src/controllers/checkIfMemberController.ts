import { Request, Response } from 'express';
import { Character as ICharacter } from '../interface/characterInterface';
import { Guild as IGuild } from '../interface/guildInterface';
import { Character } from '../models/characterModel';
import { Guild } from '../models/guildModel';

export const checkIfMember = async (req: Request, res: Response): Promise<void | Response> => {
  try {
    const { character, guild } = req.body;
    const selectedCharacter = await Character.findById(character) as ICharacter;
    const selectedGuild = await Guild.findById(guild) as IGuild;
    if (selectedCharacter?.guild?._id.toString() === selectedGuild._id.toString()) {
      return res.status(200).json({ message: 'Member' });
    }
    if (selectedCharacter?.guild?._id.toString() !== selectedGuild._id.toString()) {
      return res.status(200).json({ message: 'Not member' });
    }
  } catch (error) {
    if (error instanceof Error) {
      return res
      .status(500)
      .json({
        error: 'Failed to validate character membership',
        message: error.message,
      });
    }
  }
};