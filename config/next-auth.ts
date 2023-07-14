import { PrismaAdapter } from "@auth/prisma-adapter"
import { compare } from "bcryptjs"
import { type AuthOptions } from "next-auth"
import { type Adapter } from "next-auth/adapters"
import CredentialsProvider from "next-auth/providers/credentials"
import GithubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"

import { env } from "@/lib/env"
import { prisma } from "@/lib/prisma"
import { loginSchema } from "@/app/(auth)/schemas/auth-schema"

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
        const result = loginSchema.safeParse(credentials)
        if (!result.success) throw new Error("Please enter an email and password")
        const { data } = result
        const user = await prisma.user.findUnique({
          where: { email: result.data.email },
        })
        if (!user || !user.hashedPassword) throw new Error("No user found")
        const matchPassword = await compare(data.password, user.hashedPassword)
        if (!matchPassword) throw new Error("Incorrect password")
        return user
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // The arguments user, account, profile and isNewUser are only passed the first time this callback is called on a new session, after the user signs in. In subsequent calls, only token will be available.
      if (trigger == "update" && session?.name) {
        token.name = session.name
        //update user new name to db
        // await prisma.user.update({where:{id:token.id},data:})
      }
      if (user) {
        token.id = user.id
        token.role = user.role
      }

      return token
    },
    // token from jwt is passed frow jwt callback
    async session({ session, token }) {
      // const user = await prisma.user.findUnique({ where: { email: token.email! } })
      // if (!user) throw new Error("Email does not exist")
      // session.user = user
      // return session
      session.user.id = token.id
      session.user.role = token.role
      return session
    },
  },
  pages: {
    signIn: "/sign-in",
  },
  secret: env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
  debug: process.env.NODE_ENV === "development",
}
