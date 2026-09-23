import { type Request, type Response } from 'express';
import { Types } from 'mongoose';
import { User } from '../models/User.js';
import bcrypt from 'bcrypt';
import { generateToken, verifyRefreshToken } from '../utils/tokens.js';

export interface JWTPayload {
  userId: string;
}

export interface AuthRequest extends Request {
  user?: JWTPayload;
}

interface UserBody {
  email: string;
  password: string;
}

export interface AuthResponse {
  message: string;
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
  };
}

const SALT_ROUNDS = 10;

export const registerUser = async (
  req: Request<{}, {}, UserBody>,
  res: Response<AuthResponse | { message: string }>,
): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: 'Email and password are required' });
      return;
    }

    const user = await User.findOne({ email });
    if (user) {
      res.status(400).json({ message: 'User already exists' });
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    const newUser = await User.create({
      email,
      passwordHash,
      refreshTokens: [],
    });

    const tokens = generateToken({ userId: newUser.id.toString() });

    newUser.refreshTokens.push(tokens.refreshToken);
    await newUser.save();

    res.status(201).json({
      message: 'User successfully registered',
      ...tokens,
      user: {
        id: newUser.id.toString(),
        email: newUser.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error during registration' });
  }
};

export const loginUser = async (
  req: Request<{}, {}, UserBody>,
  res: Response<AuthResponse | { message: string }>,
): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: 'Email and password are required' });
      return;
    }

    const user = await User.findOne({ email });

    if (!user) {
      res.status(400).json({ message: 'Invalid email or password' });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      res.status(400).json({ message: 'Invalid email or password' });
      return;
    }

    const tokens = generateToken({ userId: user.id.toString() });

    const MAX_SESSIONS = 5;
    user.refreshTokens.push(tokens.refreshToken);
    if (user.refreshTokens.length > MAX_SESSIONS) {
      user.refreshTokens = user.refreshTokens.slice(-MAX_SESSIONS);
    }
    await user.save();

    res.status(200).json({
      message: 'User successfully logged in',
      ...tokens,
      user: { id: user.id.toString(), email: user.email },
    });
  } catch (error) {
    console.error('Login error details:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

export const logoutUser = async (
  req: Request<{}, {}, { refreshToken: string }>,
  res: Response<{ message: string }>,
): Promise<void> => {
  try {
    const { refreshToken } = req.body;

    if (refreshToken) {
      // await User.updateOne({ refreshTokens: refreshToken }, { $pull: { refreshTokens: refreshToken } });

      const userWhoLoggedOut = await User.findOneAndUpdate(
        { refreshTokens: refreshToken },
        { $pull: { refreshTokens: refreshToken } },
        { new: false },
      );

      console.log(`Вышел пользователь: ${userWhoLoggedOut.email} (ID: ${userWhoLoggedOut._id})`);
    }

    res.json({ message: 'User successfully logged out' });
  } catch (error) {
    console.error('Login error details:', error);
    res.status(500).json({ message: 'Server error during logout' });
  }
};

export const refreshToken = async (req: Request, res: Response): Promise<void> => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      res.status(400).json({ message: 'Refresh token is invalid or expired' });
    }

    const userId = verifyRefreshToken(refreshToken);

    if (!userId) {
      res.status(400).json({ message: 'Refresh token is invalid or expired' });
    }

    const user = await User.findById(userId);

    user.refreshTokens = user.refreshTokens.filter(t => t !== refreshToken);

    const tokens = generateToken({ userId: userId.toString() });

    user.refreshTokens.push(tokens.refreshToken);
    await user.save();

    res.json(tokens);
  } catch (error) {
    res.status(403).json({ message: 'Refresh token is invalid or expired' });
  }
};

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.query;

    if (!id || !Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: 'Incorrect id of user' });
      return;
    }

    await User.findByIdAndDelete(id);
    res.json({ message: 'User successfully deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error during deleting user' });
  }
};
