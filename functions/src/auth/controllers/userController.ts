import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import * as User from '../models/userModel';

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

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      password: hashedPassword,
      role,
    });
    return res.status(201).json(user);
  } catch (error) {
    return res.status(500).json({ error });
  }
};

export const getAllUsers = async (
  req: Request,
  res: Response
): Promise<void | Response> => {
  try {
    const users = await User.getAll();
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ error });
  }
};

export const getUserById = async (
  req: Request,
  res: Response
): Promise<void | Response> => {
  try {
    const user = await User.findById(req.params.id);
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ error });
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
    const { updatedData } = req.body;

    const userToUpdate = await User.findById(id);
    const isOwnerOrAdmin =
      userToUpdate._id === authUserId || authRole === 'admin';
    if (!isOwnerOrAdmin) {
      return res.status(403).json({ error: 'Permission denied' });
    }

    if (authRole === 'standard' && updatedData.username) {
      return res.status(403).json({
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
      const existingUser = await User.findOneByQuery({
        username: updatedData.username,
      });
      if (existingUser) {
        return res.status(409).json({ error: 'Username already exists' });
      }
    }

    const user = await User.updateById(id, updatedData);
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ error });
  }
};

export const deleteUserById = async (
  req: Request,
  res: Response
): Promise<void | Response> => {
  try {
    const authReq = req as AuthRequest;
    const { authUserId, authRole } = authReq;

    const userToDelete = await User.findById(req.params.id);
    const isOwnerOrAdmin =
      userToDelete._id === authUserId || authRole === 'admin';
    if (!isOwnerOrAdmin) {
      return res.status(403).json({
        error: 'Standard users are only allowed to delete their own account',
      });
    }

    const deletedUser = await User.deleteById(req.params.id);
    return res
      .status(200)
      .json({ message: 'User deleted successfully', user: deletedUser });
  } catch (error) {
    return res.status(500).json({ error });
  }
};
