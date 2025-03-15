import { Session as DefaultSession, User as NextAuthUser, JWT as NextAuthJWT } from 'next-auth';
import { JWT as NextAuthJWTType } from 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role: string;
    } & DefaultSession['user'];
    accessToken?: string;
    error?: string;
  }

  interface User extends NextAuthUser {
    role: string;
    accessToken: string;
    refreshToken: string;
    accessTokenExpires: number;
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends NextAuthJWTType {
    accessToken: string;
    refreshToken: string;
    accessTokenExpires: number;
    role: string;
    error?: string;
    sub?: string; // Ensure sub is optional
  }
}