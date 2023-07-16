import * as schema from "@/db/schema"
import { drizzle } from "drizzle-orm/node-postgres"
import { Pool } from "pg"

const connection = new Pool({
  connectionString: process.env.DATABASE_URL,
  allowExitOnIdle: true,
})

export const db = drizzle(connection, { schema })

export default db
