import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { env } from '../config/environment';

class JwtService {
  generateToken(payload: any): string {
    return jwt.sign(payload, env.JWT_SECRET, {
      expiresIn: env.JWT_EXPIRES_IN,
    });
  }

  verifyToken(token: string): any {
    try {
      return jwt.verify(token, env.JWT_SECRET);
    } catch (error) {
      return null;
    }
  }
}

export const jwtService = new JwtService();