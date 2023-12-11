import { Schema, model } from 'mongoose';
import { IUserWithoutId } from '../../types/userType';

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
