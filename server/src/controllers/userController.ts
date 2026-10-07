import { type Request, type Response } from 'express';
import { User } from '../models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { generateToken, verifyRefreshToken } from '../utils/tokens.js';
import { type AuthRequest } from '../types/user.js';
import {
  type AuthResponse,
  isToken,
  type RefreshResponse,
  type UserDTO,
  type MeResponse,
  RegisterSchema,
  getIssueMessage,
  LoginSchema,
  type MessageResponse,
  type JwtPayload,
  ObjectIdSchema,
} from '@research/shared';
import { deleteUserRooms } from '../utils/chat.js';

const MAX_SESSIONS = 5;
const SALT_ROUNDS = 10;
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: (process.env.NODE_ENV === 'production' ? 'strict' : 'lax') as 'strict' | 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

export const registerUser = async (
  req: Request<{}, {}, unknown>,
  res: Response<AuthResponse | MessageResponse>,
): Promise<void> => {
  const parsedBody = RegisterSchema.safeParse(req.body);
  if (!parsedBody.success) {
    res.status(400).json({ message: getIssueMessage(parsedBody.error) });
    return;
  }

  const { email, password } = parsedBody.data;

  const user = await User.findOne({ email });

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
    userAgent: req.headers['user-agent'] || 'unknown',
    ip: req.ip || 'unknown',
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
};

export const loginUser = async (
  req: Request<{}, {}, unknown>,
  res: Response<AuthResponse | MessageResponse>,
): Promise<void> => {
  const parsedBody = LoginSchema.safeParse(req.body);
  if (!parsedBody.success) {
    res.status(400).json({ message: getIssueMessage(parsedBody.error) });
    return;
  }

  const { email, password } = parsedBody.data;

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

  const session = user.refreshTokens.find(
    i => i.ip === currentIp && i.userAgent === currentUserAgent,
  );

  if (session) {
    session.refreshToken = refreshToken;
    session.createdAt = new Date();
  } else {
    if (user.refreshTokens.length >= MAX_SESSIONS) {
      user.refreshTokens.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
      user.refreshTokens.shift();
    }

    user.refreshTokens.push({
      refreshToken,
      userAgent: currentUserAgent,
      ip: currentIp,
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
};

export const logoutUser = async (req: Request, res: Response<MessageResponse>): Promise<void> => {
  const refreshToken = req.cookies.refreshToken;

  if (isToken(refreshToken)) {
    await User.updateOne(
      { 'refreshTokens.refreshToken': refreshToken },
      { $pull: { refreshTokens: { refreshToken } } },
    );
  }

  res.clearCookie('refreshToken', COOKIE_OPTIONS);
  res.json({ message: 'User successfully logged out' });
};

export const refreshToken = async (
  req: Request,
  res: Response<RefreshResponse | MessageResponse>,
): Promise<void> => {
  if (!isToken(req.cookies.refreshToken)) {
    res.status(401).json({ message: 'Refresh token is invalid or expired' });
    return;
  }

  const refreshToken = req.cookies.refreshToken;

  let payload: JwtPayload;
  try {
    payload = verifyRefreshToken(refreshToken);
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      res.clearCookie('refreshToken', COOKIE_OPTIONS);
      res.status(401).json({ message: 'Refresh token is invalid or expired' });
      return;
    }
    res.status(500).json({ message: 'Server error during token refresh' });
    return;
  }

  const tokens = generateToken({ userId: payload.userId });

  const findFilter = {
    _id: payload.userId,
    'refreshTokens.refreshToken': refreshToken,
  };

  const updateFields = {
    $set: {
      'refreshTokens.$.refreshToken': tokens.refreshToken,
      'refreshTokens.$.createdAt': new Date(),
    },
  };

  const updateResult = await User.updateOne(findFilter, updateFields);

  if (updateResult.matchedCount === 0) {
    res.status(403).json({ message: 'Invalid refresh token' });
    return;
  }

  res.cookie('refreshToken', tokens.refreshToken, COOKIE_OPTIONS);
  res.status(200).json({ accessToken: tokens.accessToken });
};

export const deleteUser = async (
  req: AuthRequest,
  res: Response<MessageResponse>,
): Promise<void> => {
  const userId = req.user?.userId;

  if (!userId) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  const exists = await User.exists({ _id: userId });
  if (!exists) {
    res.clearCookie('refreshToken', COOKIE_OPTIONS);
    res.status(404).json({ message: 'User not found' });
    return;
  }

  await deleteUserRooms(userId);
  await User.findByIdAndDelete(userId);
  res.clearCookie('refreshToken', COOKIE_OPTIONS);
  res.json({ message: 'User successfully deleted' });
};

export const getMe = async (
  req: AuthRequest,
  res: Response<MeResponse | MessageResponse>,
): Promise<void> => {
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
};

export const getUsers = async (
  req: AuthRequest,
  res: Response<UserDTO[] | MessageResponse>,
): Promise<void> => {
  const users = await User.find({ _id: { $ne: req.user?.userId } }, 'email').sort({ email: 1 });
  res.json(users.map(user => ({ id: user.id.toString(), email: user.email })));
};

export const getUserById = async (
  req: Request<{ userId: string }>,
  res: Response<UserDTO | MessageResponse>,
): Promise<void> => {
  const isValid = ObjectIdSchema.safeParse(req.params.userId).success;

  if (!isValid) {
    res.status(404).json({ message: 'User not found' });
    return;
  }

  const user = await User.findById(req.params.userId, 'email').lean();

  if (!user) {
    res.status(404).json({ message: 'User not found' });
    return;
  }

  res.json({ id: user._id.toString(), email: user.email });
};
