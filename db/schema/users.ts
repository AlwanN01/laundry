import { InferModel, relations } from "drizzle-orm"
import { pgTable, timestamp, unique, uuid, varchar } from "drizzle-orm/pg-core"

import { accounts } from "./accounts"
import { sessions } from "./sessions"

export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name"),
    email: varchar("email").notNull().unique(),
    emailVerified: timestamp("email_verified", { precision: 6, withTimezone: true, mode: "date" }),
    image: varchar("image"),
    role: varchar("role"),
    hashedPassword: varchar("hashed_password"),
    createdAt: timestamp("created_at", { precision: 6, withTimezone: true, mode: "date" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { precision: 6, withTimezone: true, mode: "date" })
      .defaultNow()
      .notNull(),
  },
  (table) => {
    return {
      emailIdx: unique("email_idx").on(table.email),
    }
  }
)

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  sessions: many(sessions),
}))

export type User = InferModel<typeof users>
