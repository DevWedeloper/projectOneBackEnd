import { IUser, IUserWithoutId } from '../types/userType';
import { User } from './schemas/userSchema';

export const create = async (user: IUserWithoutId): Promise<IUser> => {
  return (await User.create(user)).toObject();
};

export const getAll = async (): Promise<IUser[]> => {
  return await User.find();
};

export const findOneByQuery = async (
  query: Partial<IUser>
): Promise<IUser> => {
  return (
    (await User.findOne(query)) ||
    throwUserNotFoundError()
  );
};

export const findById = async (id: string): Promise<IUser> => {
  return (await User.findById(id)) || throwUserNotFoundError();
};

export const updateById = async (
  id: string,
  query: Partial<IUserWithoutId>
): Promise<IUser> => {
  return (
    (await User.findByIdAndUpdate(id, query, {
      new: true,
      runValidators: true,
    })) || throwUserNotFoundError()
  );
};

export const deleteById = async (id: string): Promise<IUser> => {
  return (await User.findByIdAndDelete(id)) || throwUserNotFoundError();
};

const throwUserNotFoundError = () => {
  throw new Error('User not found.');
};
