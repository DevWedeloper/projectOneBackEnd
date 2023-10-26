import { Request, Response } from 'express';
import { Character } from '../models/characterModel';
import { Character as ICharacter } from '../interface/characterInterface';

export const checkGuildRelationStatus = async (
  req: Request,
  res: Response
): Promise<void | Response> => {
  try {
    const { character } = req.body;
    const selectedCharacter = await Character.findById(character).populate({
      path: 'guild',
      select: '_id name leader',
      populate: {
        path: 'leader',
        model: 'Character',
        select: '_id name',
      },
    }) as ICharacter;

    if (selectedCharacter?.guild === null) {
      return res.status(200).json({ hasNoGuild: true });
    }

    if (
      selectedCharacter?.guild !== null &&
      selectedCharacter?._id.toString() !== selectedCharacter?.guild?.leader._id.toString()
    ) {
      console.log(selectedCharacter._id, selectedCharacter.guild.leader._id);
      
      return res.status(200).json({ memberOfGuild: true });
    }

    if (
      selectedCharacter?.guild !== null &&
      selectedCharacter?._id.toString() === selectedCharacter?.guild?.leader._id.toString()
    ) {
      return res.status(200).json({ leaderOfGuild: true });
    }

  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({
        error: 'Failed to check guild relation status.',
        message: error.message,
      });
    }
  }
};
