import { Kysely, PostgresDialect } from "kysely"
// this is the Database interface we defined earlier
import { Pool } from "pg"

import { env } from "@/lib/env"

import { DB } from "./types"

const dialect = new PostgresDialect({
  pool: new Pool({
    database: env.DATABASE_NAME,
    host: env.DATABASE_HOST,
    user: env.DATABASE_USER,
    password: env.DATABASE_PASSWORD,
    port: Number(env.DATABASE_PORT),
    max: 10,
  }),
})
export const db = new Kysely<DB>({ dialect })
