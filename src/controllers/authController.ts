import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';

import { sendOTPByEmail } from '../services/emailService';
import OTP from '../models/otp';
import User from '../models/user';
import Role from '../models/role'; 
import DataDiri from '../models/dataDiriModel';

function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function generateAccessToken(userId: string): string {
  const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET || 'defaultAccessTokenSecret';
  return jwt.sign({ userId }, accessTokenSecret, { expiresIn: '15m' });
}
function generateRefreshToken(userId: string): string {
  const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET || 'defaultRefreshTokenSecret';
  return jwt.sign({ userId }, refreshTokenSecret);
}

export const createDataDiri = async (req: Request, res: Response) => {
  try {
    const newDataDiri = await DataDiri.create(req.body);
    res.status(201).json({status: 'success', message: 'Data created successfully', data: { newDataDiri: newDataDiri }});
  } catch (err) {
    res.status(400).json({ message: 'Failed to create data' });
  }
};

export async function verifyOTP(req: Request, res: Response) {
  const { email, otp } = req.body;

  try {
    // Find the OTP document for the provided email
    const otpDocument = await OTP.findOne({ email });

    if (!otpDocument) {
      return res.status(404).json({ status: 'failed', message: 'Email not found' });
    }

    // Check if the OTP has expired
    if (new Date() > otpDocument.expiration) {
      return res.status(401).json({ status: 'failed', message: 'OTP has expired' });
    }

    // Compare the OTP provided by the user with the stored OTP
    if (otpDocument.otp !== otp) {
      return res.status(401).json({ status: 'failed', message: 'Invalid OTP' });
    }

    // If OTP is valid, delete the OTP document
    await OTP.deleteOne({ email });

    // Update user verification status
    await User.findOneAndUpdate({ email }, { verified: true });

    return res.status(200).json({ status: 'success', message: 'OTP verified successfully' });
  } catch (error) {
    console.error('OTP verification error:', error);
    return res.status(500).json({ status: 'failed', message: 'Internal server error' });
  }
}

export async function regenerateOTP(req: Request, res: Response) {
  const { email } = req.body;

  try {
    // Find the OTP document for the provided email
    const otpDocument = await OTP.findOne({ email });

    if (!otpDocument) {
      return res.status(404).json({ status: 'failed', message: 'Email not found' });
    }

    // Generate new OTP
    const newOTP = generateOTP();

    // Set new expiration time to 5 minutes from now
    const newExpiration = new Date();
    newExpiration.setMinutes(newExpiration.getMinutes() + 5);

    // Update OTP document with new OTP and expiration time
    otpDocument.otp = newOTP;
    otpDocument.expiration = newExpiration;
    await otpDocument.save();

    // Send verification email with new OTP
    await sendOTPByEmail(email, newOTP);

    return res.status(200).json({ status: 'success', message: 'OTP regenerated and sent successfully' });
  } catch (error) {
    console.error('OTP regeneration error:', error);
    return res.status(500).json({ status: 'failed', message: 'Internal server error' });
  }
}

export async function register(req: Request, res: Response) {
  const { email, username, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ status: 'failed', message: 'User already exists' });
    }

    // Generate OTP
    const otp = generateOTP();

    // Set expiration time to 5 minutes from now
    const expiration = new Date();
    expiration.setMinutes(expiration.getMinutes() + 5);

    // Store OTP in the database
    const otpDocument = new OTP({ email, otp, expiration });
    await otpDocument.save();

    // Send verification email with OTP
    await sendOTPByEmail(email, otp);

    const hashedPassword = await bcrypt.hash(password, 10);

    const defaultRole = await Role.findOne({ rolename: 'user' });
    if (!defaultRole) {
      return res.status(500).json({ status: 'failed', message: 'Default role not found' });
    }

    const newUser = new User({ email, username, password: hashedPassword, roles: [defaultRole._id], verified: false }); // Set verified to false
    await newUser.save();

    return res.status(201).json({ status: 'success', message: 'User created successfully', data: { _id: newUser._id, username: newUser.username } });
  } catch (error) {
    console.error('Error creating user:', error);
    return res.status(500).json({ status: 'failed', message: 'Internal server error for register' });
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

