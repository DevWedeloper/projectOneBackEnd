import { Request, Response } from 'express';
import { Character as ICharacter } from '../interface/characterInterface';

export const checkGuildRelationStatus = async (
  req: Request,
  res: Response
): Promise<void | Response> => {
  try {
    const { character }: { character: ICharacter } = req.body;
    if (character?.guild === null) {
      return res.status(200).json({ hasNoGuild: true });
    }

    if (
      character?.guild !== null &&
      character?._id.toString() !== character?.guild?.leader._id.toString()
    ) {
      return res.status(200).json({ memberOfGuild: true });
    }

    if (
      character?.guild !== null &&
      character?._id.toString() === character?.guild?.leader._id.toString()
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
