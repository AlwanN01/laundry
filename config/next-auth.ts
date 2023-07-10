import { PrismaAdapter } from "@auth/prisma-adapter"
import { type AuthOptions } from "next-auth"
import { type Adapter } from "next-auth/adapters"
import CredentialsProvider from "next-auth/providers/credentials"
import GithubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"

import { env } from "@/lib/env"
import { prisma } from "@/lib/prisma"

export const nextAuthOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma) as Adapter,
  providers: [
    GithubProvider({
      clientId: env.GITHUB_ID,
      clientSecret: env.GITHUB_SECRET,
    }),
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "email.." },
        password: {
          label: "password",
          type: "password",
          placeholder: "Password...",
        },
        username: {
          label: "Username",
          type: "text",
          placeholder: "username..",
        },
      },
      async authorize(credentials) {
        const user = { id: "1", name: "alwan", email: "alwan@gmail.com" }
        return user
      },
    }),
  ],
  secret: env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
  debug: process.env.NODE_ENV === "development",
}
