import { Request, Response, NextFunction } from 'express';

export const isGuildFull = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  try {
    const { guild } = req.body;
    if (guild.totalMembers === guild.maxMembers) {
      return res.status(200).json({ isFull: true });
    }
    if (guild.totalMembers < guild.maxMembers) {
      return res.status(200).json({ isNotFull: true });
    }
    return res
      .status(400)
      .json({ message: 'Invalid request. Guild status not determined.' });
  } catch (error) {
    next(error);
  }
};
