import { Request, Response } from 'express';

export const checkGuildRelationStatus = async (
  req: Request,
  res: Response
): Promise<void | Response> => {
  try {
    const { character } = req.body;
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

    return res
      .status(400)
      .json({
        message: 'Invalid request. Guild relation status not determined.',
      });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({
        error: 'Failed to check guild relation status.',
        message: error.message,
      });
    }
  }
};
