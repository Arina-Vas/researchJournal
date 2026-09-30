import { type Request, type Response } from 'express';
import { User } from '../models/User.js';
import bcrypt from 'bcrypt';
import { generateToken, verifyRefreshToken } from '../utils/tokens.js';
import { type AuthDTO, type AuthResponse, type AuthRequest, type MeResponse, type UserDTO } from '../types/user.js';

const MAX_SESSIONS = 5;
const SALT_ROUNDS = 10;
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: (process.env.NODE_ENV === 'production' ? 'strict' : 'lax') as 'strict' | 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

export const registerUser = async (
  req: Request<{}, {}, AuthDTO>,
  res: Response<AuthResponse | { message: string }>,
): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: 'Email and password are required' });
      return;
    }

    const user = await User.findOne({ email }).select('+passwordHash');
    if (user) {
      res.status(400).json({ message: 'User already exists' });
      return;
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    const newUser = await User.create({
      email,
      passwordHash,
      refreshTokens: [],
    });

    const { refreshToken, accessToken } = generateToken({ userId: newUser.id.toString() });

    newUser.refreshTokens.push({
      refreshToken,
      userAgent: req.headers['user-agent'] || '',
      ip: req.ip || '',
      createdAt: new Date(),
    });
    await newUser.save();

    res.cookie('refreshToken', refreshToken, COOKIE_OPTIONS);

    res.status(201).json({
      message: 'User successfully registered',
      accessToken,
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
  req: Request<{}, {}, AuthDTO>,
  res: Response<AuthResponse | { message: string }>,
): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: 'Email and password are required' });
      return;
    }

    const user = await User.findOne({ email }).select('+passwordHash');

    if (!user) {
      res.status(400).json({ message: 'Invalid email or password' });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      res.status(400).json({ message: 'Invalid email or password' });
      return;
    }

    const { refreshToken, accessToken } = generateToken({ userId: user.id.toString() });

    // check session exist
    const currentUserAgent = req.headers['user-agent'] || 'unknown';
    const currentIp = req.ip || 'unknown';

    const sessionIndex = user.refreshTokens.findIndex(i => i.ip === currentIp && i.userAgent === currentUserAgent);

    if (sessionIndex !== -1) {
      user.refreshTokens[sessionIndex] = {
        ...user.refreshTokens[sessionIndex],
        refreshToken,
        createdAt: new Date(),
      };
    } else {
      if (user.refreshTokens.length >= MAX_SESSIONS) {
        user.refreshTokens.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
        user.refreshTokens.shift();
      }

      user.refreshTokens.push({
        refreshToken,
        userAgent: req.headers['user-agent'] || '',
        ip: req.ip || '',
        createdAt: new Date(),
      });
    }

    await user.save();

    res.cookie('refreshToken', refreshToken, COOKIE_OPTIONS);

    res.status(200).json({
      message: 'User successfully logged in',
      accessToken,
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
    const refreshToken = req.cookies?.refreshToken;
    if (refreshToken) {
      await User.updateOne(
        { 'refreshTokens.refreshToken': refreshToken },
        { $pull: { refreshTokens: { refreshToken } } },
      );

      // const userWhoLoggedOut = await User.findOneAndUpdate(
      //   { 'refreshTokens.refreshToken': refreshToken },
      //   { $pull: { refreshTokens: { refreshToken } } },
      //   { new: false },
      // );
    }

    res.clearCookie('refreshToken', COOKIE_OPTIONS);
    res.json({ message: 'User successfully logged out' });
  } catch (error) {
    console.error('Login error details:', error);
    res.status(500).json({ message: 'Server error during logout' });
  }
};

export const refreshToken = async (req: Request, res: Response): Promise<void> => {
  try {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      res.status(401).json({ message: 'Refresh token not provided' });
      return;
    }

    const payload = verifyRefreshToken(refreshToken);

    if (!payload || !payload.userId) {
      res.status(401).json({ message: 'Refresh token is invalid or expired' });
      return;
    }

    const user = await User.findOne({ _id: payload.userId, 'refreshTokens.refreshToken': refreshToken });

    if (!user) {
      res.status(403).json({ message: 'Invalid refresh token' });
      return;
    }

    const tokens = generateToken({ userId: payload.userId });

    user.refreshTokens = user.refreshTokens.map(session =>
      session.refreshToken === refreshToken
        ? { ...session, refreshToken: tokens.refreshToken, createdAt: new Date() }
        : session,
    );

    await user.save();

    res.cookie('refreshToken', tokens.refreshToken, COOKIE_OPTIONS);
    res.status(200).json({ accessToken: tokens.accessToken });
  } catch (error) {
    res.status(500).json({ message: 'Server error during token refresh' });
  }
};

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.query;

    if (!id) {
      res.status(400).json({ message: 'Incorrect id of user' });
      return;
    }

    await User.findByIdAndDelete(id);
    res.json({ message: 'User successfully deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error during deleting user' });
  }
};

export const getMe = async (req: AuthRequest, res: Response<MeResponse | { message: string }>): Promise<void> => {
  try {
    if (!req.user?.userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const user = await User.findById(req.user.userId);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.status(200).json({
      user: {
        id: user.id.toString(),
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error retrieving user' });
  }
};

export const getUsers = async (req: AuthRequest, res: Response<UserDTO[] | { message: string }>): Promise<void> => {
  try {
    const users = await User.find({ _id: { $ne: req.user?.userId } }, 'email').sort({ email: 1 });

    res.json(users.map(user => ({ id: user.id.toString(), email: user.email })));
  } catch (error) {
    res.status(500).json({ message: 'Server error retrieving users' });
  }
};
