import { accounts, sessions, users, verificationTokens } from "@/db/schema"
import * as schema from "@/db/schema"
import { and, eq } from "drizzle-orm"
import { NodePgDatabase } from "drizzle-orm/node-postgres"
import { Adapter } from "next-auth/adapters"

/** @return { import("next-auth/adapters").Adapter } */
export default function DrizzleAdapter(
  client: NodePgDatabase<typeof schema>,
  options = {}
): Adapter {
  return {
    async createUser(user) {
      try {
        const [result] = await client.insert(users).values(user).returning()
        if (!result) throw new Error("Failed to create User")

        return result
      } catch (e) {
        throw e
      }
    },
    async getUser(id) {
      return (await client.query.users.findFirst({ where: eq(users.id, id) })) || null
    },
    async getUserByEmail(email) {
      return (await client.query.users.findFirst({ where: eq(users.email, email) })) || null
    },
    async getUserByAccount({ providerAccountId, provider }) {
      return (
        (await client.query.accounts
          .findFirst({
            where: and(
              eq(accounts.providerAccountId, providerAccountId),
              eq(accounts.provider, provider)
            ),
            with: {
              user: true,
            },
          })
          .then((account) => account?.user)) || null
      )
    },
    async updateUser(user) {
      try {
        const [result] = await client
          .update(users)
          .set(user)
          .where(eq(users.id, user.id))
          .returning()
        if (!result) throw new Error("Failed to create User")

        return result
      } catch (e) {
        throw e
      }
    },
    async deleteUser(userId) {
      await client.delete(users).where(eq(users.id, userId)).execute()
      return
    },
    async linkAccount(account) {
      await client.insert(accounts).values(account).execute()
      return
    },
    async unlinkAccount({ providerAccountId, provider }) {
      await client
        .delete(accounts)
        .where(
          and(eq(accounts.providerAccountId, providerAccountId), eq(accounts.provider, provider))
        )
      return
    },
    async createSession({ sessionToken, userId, expires }) {
      try {
        const [result] = await client
          .insert(sessions)
          .values({
            userId,
            sessionToken,
            expires,
          })
          .returning()
          .execute()

        if (!result) throw new Error("Failed to Create Session")

        return result
      } catch (e) {
        throw e
      }
    },
    async getSessionAndUser(sessionToken) {
      return (
        (await client.query.sessions
          .findFirst({
            where: eq(sessions.sessionToken, sessionToken),
            with: {
              user: true,
            },
          })
          .then((sessionWithUser) => {
            if (!sessionWithUser) return null
            const { user, ...session } = sessionWithUser
            return { user, session }
          })) || null
      )
    },
    async updateSession({ sessionToken, ...session }) {
      try {
        const [result] = await client
          .update(sessions)
          .set(session)
          .where(eq(sessions.sessionToken, sessionToken))
          .returning()
          .execute()

        if (!result) throw new Error("Failed to Update Session")

        return result
      } catch (e) {
        throw e
      }
    },
    async deleteSession(sessionToken) {
      await client.delete(sessions).where(eq(sessions.sessionToken, sessionToken)).execute()
      return
    },
    async createVerificationToken(verificationToken) {
      try {
        const [result] = await client
          .insert(verificationTokens)
          .values(verificationToken)
          .returning()
          .execute()

        if (!result) throw new Error("Failed to Create Verification Token")

        return result
      } catch (e) {
        throw e
      }
    },
    async useVerificationToken({ identifier, token }) {
      try {
        const [result] = await client
          .delete(verificationTokens)
          .where(
            and(eq(verificationTokens.identifier, identifier), eq(verificationTokens.token, token))
          )
          .returning()
          .execute()

        if (!result) throw new Error("Failed to useVerificationToken")

        return result
      } catch (e) {
        throw e
      }
    },
  }
}
