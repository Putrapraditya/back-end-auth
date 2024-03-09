import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user';
import Role from '../models/role';

let verificationCodes: { [email: string]: string } = {}; // Object to store email verification codes

function generateAccessToken(userId: string): string {
  const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET || 'defaultAccessTokenSecret';
  return jwt.sign({ userId }, accessTokenSecret, { expiresIn: '15m' });
}

function generateRefreshToken(userId: string): string {
  const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET || 'defaultRefreshTokenSecret';
  return jwt.sign({ userId }, refreshTokenSecret);
}

export async function register(req: Request, res: Response) {
  const { email, username, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ status: 'failed', message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const defaultRole = await Role.findOne({ rolename: 'user' });
    if (!defaultRole) {
      return res.status(500).json({ status: 'failed', message: 'Default role not found' });
    }

    const newUser = new User({ email, username, password: hashedPassword, roles: [defaultRole._id] });
    await newUser.save();


    await sendVerificationEmail(email, otp);

    return res.status(201).json({ status: 'success', message: 'User created successfully', data: { _id: newUser._id, username: newUser.username } });
  } catch (error) {
    console.error('Error creating user:', error);
    return res.status(500).json({ status: 'failed', message: 'Internal server error' });
  }
}


export async function login(req: Request, res: Response) {
  const { email, password } = req.body;

  try {

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ status: 'failed', message: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ status: 'failed', message: 'Invalid credentials' });
    }

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,

    });

    // Return tokens
    return res.status(200).json({ status: 'success', message: 'Login successful', data: { accessToken } });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ status: 'failed', message: 'Internal server error' });
  }
}

export async function refresh(req: Request, res: Response) {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ status: 'failed', message: 'Refresh token not provided' });
  }

  try {

    const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET || 'defaultRefreshTokenSecret';
    const decoded = jwt.verify(refreshToken, refreshTokenSecret) as { userId: string };

    const accessToken = generateAccessToken(decoded.userId);

    return res.status(200).json({ status: 'success', message: 'Token refreshed successfully', data: { accessToken } });
  } catch (error) {
    console.error('Token refresh error:', error);
    return res.status(401).json({ status: 'failed', message: 'Invalid refresh token' });
  }
}

export async function logout(req: Request, res: Response) {

  res.clearCookie('refreshToken');

  return res.status(200).json({ status: 'success', message: 'Logout successful', data: null });
}

