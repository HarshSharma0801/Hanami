import NextAuth from "next-auth";
import { authOptions } from "./auth-options";

export const GET = NextAuth(authOptions).handlers.GET;
export const POST = NextAuth(authOptions).handlers.POST;
