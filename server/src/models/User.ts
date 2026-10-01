import { Schema, model, Document } from 'mongoose';

interface Session {
  refreshToken: string;
  userAgent?: string;
  ip?: string;
  createdAt: Date;
}

export interface User extends Document {
  email: string;
  passwordHash: string;
  refreshTokens: Session[];
}

const UserSchema = new Schema<User>(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address'],
      unique: true,
    },
    passwordHash: {
      type: String,
      required: [true, 'Password is required'],
      select: false,
    },
    refreshTokens: {
      type: [
        {
          refreshToken: { type: String, required: true },
          userAgent: { type: String },
          ip: { type: String },
          createdAt: { type: Date, default: Date.now },
        },
      ],
    },
  },
  { timestamps: true },
);

export const User = model<User>('User', UserSchema);
