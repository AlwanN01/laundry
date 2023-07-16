import { InferModel, relations } from "drizzle-orm"
import { bigint, index, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core"

import { users } from "./users"

export const accounts = pgTable(
  "accounts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id),
    type: varchar("type").notNull(),
    provider: varchar("provider").notNull().unique(),
    providerAccountId: varchar("provider_account_id").notNull().unique(),
    refreshToken: text("refresh_token"),
    accessToken: text("access_token"),
    expires_at: bigint("expires_at", { mode: "number" }),
    token_type: varchar("token_type"),
    scope: varchar("scope"),
    id_token: varchar("id_token"),
    session_state: varchar("session_state"),
    createdAt: timestamp("created_at", { precision: 6, withTimezone: true, mode: "date" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { precision: 6, withTimezone: true, mode: "date" })
      .defaultNow()
      .notNull(),
  },
  (table) => {
    return {
      providerIdx: index("provider_idx").on(table.provider),
      providerAccountIdIdx: index("provider_account_id_idx").on(table.providerAccountId),
    }
  }
)

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, {
    fields: [accounts.userId],
    references: [users.id],
  }),
}))

export type Account = InferModel<typeof accounts>
