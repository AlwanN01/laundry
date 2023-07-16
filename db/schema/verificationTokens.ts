import { InferModel, sql } from "drizzle-orm"
import { pgTable, timestamp, unique, varchar } from "drizzle-orm/pg-core"

export const verificationTokens = pgTable(
  "verification_tokens",
  {
    identifier: varchar("identifier").notNull().unique(),
    token: varchar("token").notNull().unique(),
    expires: timestamp("expires", { precision: 6, withTimezone: true, mode: "date" }).notNull(),
    createdAt: timestamp("created_at", { precision: 6, withTimezone: true, mode: "date" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { precision: 6, withTimezone: true, mode: "date" })
      .defaultNow()
      .notNull(),
  },
  (table) => {
    return {
      identifierIdx: unique("identifier_idx").on(table.identifier),
      tokenIdx: unique("token_idx").on(table.token),
    }
  }
)

export type VerificationToken = InferModel<typeof verificationTokens>
