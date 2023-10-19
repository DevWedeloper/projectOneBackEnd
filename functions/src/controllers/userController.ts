import { Request, Response } from 'express';
import { Schema } from 'mongoose';
import { User, IUserDocument } from '../models/userModel';
import bcrypt from 'bcrypt';

interface AuthRequest extends Request {
  authUserId: Schema.Types.ObjectId;
  authRole: 'admin' | 'standard';
}

export const createUser = async (req: Request, res: Response): Promise<any> => {
  try {
    const { username, password, role } = req.body;

    const existingUser: IUserDocument | null = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser: IUserDocument = await User.create({ username, password: hashedPassword, role });
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create the user' });
  }
};

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users: IUserDocument[] = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve users' });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const user: IUserDocument | null = await User.findById(req.params.id);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
    } else {
      res.status(200).json(user);
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve the user' });
  }
};

export const updateUserById = async (req: Request, res: Response): Promise<any> => {
  try {
    const authReq = req as AuthRequest;
    const { authUserId, authRole } = authReq;
     
    const { id } = req.params;
    const updatedData = req.body;

    const userToUpdate: IUserDocument | null = await User.findById(id);
    if (!userToUpdate) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isOwnerOrAdmin = userToUpdate._id.equals(authUserId) || authRole === 'admin';
    if (!isOwnerOrAdmin) {
      return res.status(403).json({ error: 'Permission denied' });
    }

    if (authRole === 'standard' && updatedData.username) {
      return res.status(403).json({ error: 'Standard users are not allowed to change their username' });
    }

    if (updatedData.password) {
      updatedData.password = await bcrypt.hash(updatedData.password, 10);
    }

    if (authRole === 'admin' && updatedData.username && updatedData.username !== userToUpdate.username) {
      const existingUser: IUserDocument | null = await User.findOne({ username: updatedData.username });
      if (existingUser) {
        return res.status(409).json({ error: 'Username already exists' });
      }
    }

    const updatedUser: IUserDocument | null = await User.findByIdAndUpdate(id, updatedData, { new: true });
    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update the user' });
  }
};

export const deleteUserById = async (req: Request, res: Response): Promise<any> => {
  try {
    const authReq = req as AuthRequest;
    const { authUserId, authRole } = authReq;

    const userToDelete: IUserDocument | null = await User.findById(req.params.id);
    if (!userToDelete) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isOwnerOrAdmin = userToDelete._id.equals(authUserId) || authRole === 'admin';
    if (!isOwnerOrAdmin) {
      return res.status(403).json({ error: 'Standard users are only allowed to delete their own account' });
    }

    const deletedUser: IUserDocument | null = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete the user' });
  }
};