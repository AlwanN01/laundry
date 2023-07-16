const { drizzle } = require("drizzle-orm/node-postgres")
const { migrate } = require("drizzle-orm/node-postgres/migrator")
const { Pool } = require("pg")

const connection = new Pool({
  connectionString: process.env.DATABASE_URL,
  allowExitOnIdle: true,
  max: 1,
})

const db = drizzle(connection)

const main = async () => {
  await migrate(db, { migrationsFolder: "drizzle", migrationsTable: "migrations" })
  await connection.end()
}

main()
