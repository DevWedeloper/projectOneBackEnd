import { Request, Response } from 'express';

export const isGuildFull = async (
  req: Request,
  res: Response
): Promise<void | Response> => {
  try {
    const { guild } = req.body;
    if (guild.totalMembers === guild.maxMembers) {
      return res.status(200).json({ isFull: true });
    }
  } catch (error) {
    if (error instanceof Error) {
      return res
        .status(500)
        .json('Failed to check if guild is full.' + error.message);
    }
  }
};
