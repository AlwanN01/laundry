import { Config } from "drizzle-kit"

const config: Config = {
  schema: "./db/schema/*.ts",
  out: "./drizzle",
  driver: "pg",
  dbCredentials: {
    connectionString: String(process.env.DATABASE_URL),
  },
}

export default config
