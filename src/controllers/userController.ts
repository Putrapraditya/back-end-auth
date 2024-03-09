import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import User from '../models/user';


export async function getUsers(req: Request, res: Response) {
  try {
    const users = await User.find();
    return res.status(200).json({ status: 'success', data: users });
  } catch (error) {
    console.error('Error fetching users:', error);
    return res.status(500).json({ status: 'failed', message: 'Internal server error' });
  }
}


export async function getUserById(req: Request, res: Response) {
  const userId = req.params.id;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ status: 'failed', message: 'User not found' });
    }
    return res.status(200).json({ status: 'success', data: user });
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    return res.status(500).json({ status: 'failed', message: 'Internal server error' });
  }
}


export async function createUser(req: Request, res: Response) {
  const { email, username, password } = req.body;

  try {
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ status: 'failed', message: 'User already exists' });
    }

    
    const hashedPassword = await bcrypt.hash(password, 10);

    
    const newUser = new User({ email, username, password: hashedPassword });
    await newUser.save();

    return res.status(201).json({ status: 'success', data: newUser });
  } catch (error) {
    console.error('Error creating user:', error);
    return res.status(500).json({ status: 'failed', message: 'Internal server error' });
  }
}

export async function deleteUser(req: Request, res: Response) {
  const userId = req.params.id;

  try {
    // Find user by ID and delete
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).json({ status: 'failed', message: 'User not found' });
    }
    return res.status(200).json({ status: 'success', message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    return res.status(500).json({ status: 'failed', message: 'Internal server error' });
  }
}
