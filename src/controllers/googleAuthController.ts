import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user';

// Google OAuth2 configuration
const { OAuth2Client } = require('google-auth-library');
const CLIENT_ID = '156356784234-g54e0b350tugmgebi2i8bfkd3e0bp14f.apps.googleusercontent.com';
const client = new OAuth2Client(CLIENT_ID);

export async function loginWithGoogle(req: Request, res: Response) {
  const { token } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID,
    });
    const payload = ticket.getPayload();

    const { email, name, sub: googleId } = payload;

    let user = await User.findOne({ email });

    if (!user) {
      user = new User({ email, username: name, googleId });
      await user.save();
    }

    const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'defaultSecret', { expiresIn: '1h' });

    return res.status(200).json({ status: 'success', message: 'Login successful', data: { accessToken } });
  } catch (error) {
    console.error('Google login error:', error);
    return res.status(500).json({ status: 'failed', message: 'Internal server error' });
  }
}

export async function getGoogleAuthURL(req: Request, res: Response) {
  try {
    const url = client.generateAuthUrl({
      access_type: 'offline',
      scope: ['email', 'profile'],
    });
    return res.status(200).json({ url });
  } catch (error) {
    console.error('Error generating Google auth URL:', error);
    return res.status(500).json({ status: 'failed', message: 'Internal server error' });
  }
}

export async function getGoogleAccessToken(req: Request, res: Response) {
  const { code } = req.body;
  try {
    const { tokens } = await client.getToken(code);
    const accessToken = tokens.access_token;
    return res.status(200).json({ accessToken });
  } catch (error) {
    console.error('Error fetching access token:', error);
    return res.status(500).json({ status: 'failed', message: 'Internal server error' });
  }
}
