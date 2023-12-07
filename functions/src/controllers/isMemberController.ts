import { Request, Response } from 'express';

export const checkIfMember = async (
  req: Request,
  res: Response
): Promise<void | Response> => {
  try {
    const { character, guild } = req.body;
    if (character?.guild?._id.toString() === guild._id.toString()) {
      return res.status(200).json({ message: 'Member' });
    }
    if (character?.guild?._id.toString() !== guild._id.toString()) {
      return res.status(200).json({ message: 'Not member' });
    }
    return res.status(400).json({ message: 'Invalid request. Member status not determined.' });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({
        error: 'Failed to validate character membership',
        message: error.message,
      });
    }
  }
};
