import { z } from 'zod';
import { ObjectIdSchema } from './common.js';

export type Token = `${string}.${string}.${string}`;

const TOKEN_REGEX = /^[\w-]+\.[\w-]+\.[\w-]+$/; // base64url header.payload.signature
export const isToken = (value: unknown): value is Token =>
  typeof value === 'string' && TOKEN_REGEX.test(value);

const TokenSchema = z.custom<Token>(isToken, { error: 'Invalid token' });

export const JwtPayloadSchema = z.object({
  userId: z.string().min(1),
  iat: z.number(),
  exp: z.number(),
});

export type JwtPayload = z.infer<typeof JwtPayloadSchema>;

export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 72;

export const EmailSchema = z
  .string({
    error: data => (data.input === undefined ? 'Email is required' : 'Email must be a string'),
  })
  .trim()
  .toLowerCase()
  .pipe(z.email({ error: 'Enter valid email' }));

export const RegisterSchema = z.object({
  email: EmailSchema,
  password: z
    .string({ error: 'Password is required' })
    .min(PASSWORD_MIN_LENGTH, { error: `Password min length is ${PASSWORD_MIN_LENGTH}` })
    .max(PASSWORD_MAX_LENGTH, { error: `Password max length is ${PASSWORD_MAX_LENGTH}` }),
});
export type RegisterDTO = z.infer<typeof RegisterSchema>;

export const LoginSchema = z.object({
  email: EmailSchema,
  password: z.string({ error: 'Password is required' }).min(1, { error: 'Password is required' }),
});
export type LoginDTO = z.infer<typeof LoginSchema>;

export const UserDTOSchema = z.object({
  id: ObjectIdSchema,
  email: z.email(),
});
export type UserDTO = z.infer<typeof UserDTOSchema>;

export const AuthResponseSchema = z.object({
  message: z.string(),
  accessToken: TokenSchema,
  user: UserDTOSchema,
});
export type AuthResponse = z.infer<typeof AuthResponseSchema>;

export const RefreshResponseSchema = z.object({ accessToken: TokenSchema });
export type RefreshResponse = z.infer<typeof RefreshResponseSchema>;

export const MeResponseSchema = z.object({ user: UserDTOSchema });
export type MeResponse = z.infer<typeof MeResponseSchema>;
