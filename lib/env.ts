import { z } from "zod"

import "dotenv/config"

const envSchema = z.object({
  GITHUB_ID: z.string().nonempty(),
  GITHUB_SECRET: z.string().nonempty(),
  GOOGLE_CLIENT_ID: z.string().nonempty(),
  GOOGLE_CLIENT_SECRET: z.string().nonempty(),
  NEXTAUTH_URL: z.string().nonempty().optional(),
  NEXTAUTH_SECRET: z.string().nonempty(),
  DATABASE_URL: z.string().nonempty(),
  DATABASE_HOST: z.string().nonempty(),
  DATABASE_NAME: z.string().nonempty(),
  DATABASE_PORT: z.string().nonempty(),
  DATABASE_USER: z.string().nonempty(),
  DATABASE_PASSWORD: z.string().nonempty(),
})

export const env = envSchema.parse(process.env)
