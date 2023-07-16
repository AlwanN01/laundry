import { InferModel, relations } from "drizzle-orm"
import { pgTable, timestamp, unique, uuid, varchar } from "drizzle-orm/pg-core"

import { users } from "./users"

export const sessions = pgTable(
  "sessions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id),
    expires: timestamp("expires", { precision: 6, withTimezone: true, mode: "date" }).notNull(),
    sessionToken: varchar("session_token").notNull(),
    createdAt: timestamp("created_at", { precision: 6, withTimezone: true, mode: "date" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { precision: 6, withTimezone: true, mode: "date" })
      .defaultNow()
      .notNull(),
  },
  (table) => {
    return {
      sessionTokenIdx: unique("session_token_idx").on(table.sessionToken),
    }
  }
)

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}))

export type Session = InferModel<typeof sessions>
