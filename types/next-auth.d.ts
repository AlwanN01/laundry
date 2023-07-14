import { User as UserSchema } from "@prisma/client"
import NextAuth, { DefaultSession, User } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role?: string | null
    } & DefaultSession["user"]
  }
  interface User extends Partial<UserSchema> {}
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role?: string | null
  }
}
