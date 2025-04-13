import CredentialsProvider from "next-auth/providers/credentials";
import { JWT } from "next-auth/jwt";
import axios from "axios";

interface CustomUser {
  id: string;
  email: string;
  name: string;
  role: string;
  accessToken: string;
  refreshToken: string;
  accessTokenExpires: number;
}

interface ExtendedJWT extends JWT {
  accessToken: string;
  refreshToken: string;
  accessTokenExpires: number;
  role: string;
  sub?: string;
}

export const authOptions: any = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        role: { label: "Role", type: "text" },
      },
      async authorize(credentials): Promise<CustomUser | null> {
        if (
          !credentials?.email ||
          !credentials?.password ||
          !credentials?.role
        ) {
          throw new Error("Missing credentials");
        }

        try {
          const endpoint =
            credentials.role === "brand"
              ? "/api/user/brand/login"
              : "/api/user/affiliate/login";

          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}${endpoint}`,
            {
              email: credentials.email,
              password: credentials.password,
            },
            {
              headers: { "Content-Type": "application/json" },
            }
          );

          const data = response.data;

          if (data && data.access_token) {
            return {
              id: data.user.id.toString(),
              email: data.user.email,
              name: data.user.username,
              role: data.user.role,
              accessToken: data.access_token,
              refreshToken: data.refresh_token,
              accessTokenExpires: new Date(
                data.access_token_expires_at
              ).getTime(),
            } as CustomUser;
          }
          return null;
        } catch (error: any) {
          throw new Error(
            error.response?.data?.message || "Authentication failed"
          );
        }
      },
    }),
  ],
  session: {
    strategy: "jwt" as const,
  },
  callbacks: {
    async jwt({
      token,
      user,
    }: {
      token: ExtendedJWT;
      user?: CustomUser;
    }): Promise<ExtendedJWT> {
      if (user) {
        return {
          ...token,
          sub: user.id,
          accessToken: user.accessToken,
          refreshToken: user.refreshToken,
          accessTokenExpires: user.accessTokenExpires,
          role: user.role,
        };
      }
      return token;
    },
    async session({
      session,
      token,
    }: {
      session: any;
      token: ExtendedJWT;
    }): Promise<any> {
      session.user.id = token.sub ?? "";
      session.user.role = token.role;
      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/auth/error", // Optional custom error page
  },
};
