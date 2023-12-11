import { Schema, model } from 'mongoose';
import { IUser, IUserWithoutId } from '../types/userType';

const userSchema: Schema<IUserWithoutId> = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 6,
    maxlength: 20,
    match: /^[A-Za-z0-9_]*$/,
  },
  password: {
    type: String,
    required: true,
    validate: {
      validator: (value: string) => {
        return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/.test(value);
      },
      message:
        'Password must be at least 8 characters long and include at least one lowercase letter, one uppercase letter, and one digit.',
    },
    index: true,
  },
  role: { type: String, enum: ['admin', 'standard'], default: 'standard' },
});

export const User = model<IUserWithoutId>('User', userSchema);

export const create = async (user: IUserWithoutId): Promise<IUser> => {
  return (await User.create(user)).toObject();
};

export const getAll = async (): Promise<IUser[]> => {
  return await User.find();
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
