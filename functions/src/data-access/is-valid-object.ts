import { Types } from 'mongoose';

export const isValidObject = (string: string): boolean => {
  if (string.length === 12 || string.length === 24) {
    return new Types.ObjectId(string).toString() === string;
  }
  return false;
};
