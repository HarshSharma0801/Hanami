import NextAuth from "next-auth";
import { authOptions } from "./auth-options";

// Export the NextAuth instance for use in middleware
export const { auth, signIn, signOut } = NextAuth(authOptions);
