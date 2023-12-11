import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import { User } from '../models/userModel';

interface AuthRequest extends Request {
  authUserId: string;
  authRole: 'admin' | 'standard';
}

export const createUser = async (
  req: Request,
  res: Response
): Promise<void | Response> => {
  try {
    const { username, password, role } = req.body;
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      username,
      password: hashedPassword,
      role,
    });
    return res.status(201).json(newUser);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to create the user' });
  }
};

export const getAllUsers = async (
  req: Request,
  res: Response
): Promise<void | Response> => {
  try {
    const users = await User.find();
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to retrieve users' });
  }
};

export const getUserById = async (
  req: Request,
  res: Response
): Promise<void | Response> => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    } else {
      return res.status(200).json(user);
    }
  } catch (error) {
    return res.status(500).json({ error: 'Failed to retrieve the user' });
  }
};

export const updateUserById = async (
  req: Request,
  res: Response
): Promise<void | Response> => {
  try {
    const authReq = req as AuthRequest;
    const { authUserId, authRole } = authReq;

    const { id } = req.params;
    const updatedData = req.body;

    const userToUpdate = await User.findById(id);
    if (!userToUpdate) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isOwnerOrAdmin =
      userToUpdate._id.equals(authUserId) || authRole === 'admin';
    if (!isOwnerOrAdmin) {
      return res.status(403).json({ error: 'Permission denied' });
    }

    if (authRole === 'standard' && updatedData.username) {
      return res
        .status(403)
        .json({
          error: 'Standard users are not allowed to change their username',
        });
    }

    if (updatedData.password) {
      updatedData.password = await bcrypt.hash(updatedData.password, 10);
    }

    if (
      authRole === 'admin' &&
      updatedData.username &&
      updatedData.username !== userToUpdate.username
    ) {
      const existingUser = await User.findOne({
        username: updatedData.username,
      });
      if (existingUser) {
        return res.status(409).json({ error: 'Username already exists' });
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      updatedData,
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.status(200).json(updatedUser);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to update the user' });
  }
};

export const deleteUserById = async (
  req: Request,
  res: Response
): Promise<void | Response> => {
  try {
    const authReq = req as AuthRequest;
    const { authUserId, authRole } = authReq;

    const userToDelete = await User.findById(
      req.params.id
    );
    if (!userToDelete) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isOwnerOrAdmin =
      userToDelete._id.equals(authUserId) || authRole === 'admin';
    if (!isOwnerOrAdmin) {
      return res
        .status(403)
        .json({
          error: 'Standard users are only allowed to delete their own account',
        });
    }

    const deletedUser = await User.findByIdAndDelete(
      req.params.id
    );
    if (!deletedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to delete the user' });
  }
};
