import jwt, { SignOptions } from 'jsonwebtoken';
import { TokenPayload } from '../types/auth.types.js';

const JWT_SECRET = process.env.JWT_SECRET || 'credicord_super_secret_jwt_key_2025_secure!';
const JWT_EXPIRES_IN = (process.env.JWT_EXPIRES_IN || '2h') as string;

export function signToken(payload: TokenPayload, expiresIn: string | number = JWT_EXPIRES_IN): string {
  const options: SignOptions = {
    expiresIn: expiresIn as any,
  };
  return jwt.sign(payload, JWT_SECRET, options);
}

export function verifyToken(token: string): TokenPayload {
  return jwt.verify(token, JWT_SECRET) as TokenPayload;
}
